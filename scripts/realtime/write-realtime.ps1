$ENV_HASH = @{}
Import-Csv "$(Get-Location)\.env" -Delimiter "=" -Header Var, Value | ForEach-Object { $ENV_HASH[$_.Var] = $_.Value }

function InputToJSON {
	param($inputData)
	$json = [ordered]@{}
	try {
		Write-Host "Parsing ingested realtime data"
		for ($index = 0; $index -lt $inputData.Length; $index = $index + 46) {
			# Retrieve header info:
			#  - Ticker
			#  - Option type
			#  - Exiry date
			#  - Strike price
			$header = $inputData[$index].Split(" ")
			$ticker = $header[0].Replace("$", "")
			$optionType = if ($header[2] -eq "C") { "Call" } else { "Put" }
			$expiryDate = Get-Date $header[1]
			$strike = [double]$header[3].Replace("$", "").Replace(",", "")

			# Date info:
			#  - Alert date
			#  - Alert date seconds
			#  - Day of week
			#  - Day of alert
			#  - Seconds of day
			#  - Alert time seconds
			#  - Days to expiration
			#  - Expiration in seconds
			$alertDate = Get-Date $inputData[$index + 22]
			$alertDateSeconds = ([DateTimeOffset]$alertDate).ToUnixTimeSeconds()
			$dayOfWeek = $alertDate.DayOfWeek
			$dayOfAlert = Get-Date $alertDate.ToString("yyyy-MM-dd")
			$secondsOfDay = ([DateTimeOffset]$dayOfAlert).ToUnixTimeSeconds()
			$alertTimeSeconds = $alertDateSeconds - $secondsOfDay
			$daysToExp = ($expiryDate - $alertDate).Days
			$expirySeconds = ([DateTimeOffset]$expiryDate).ToUnixTimeSeconds()

			# Pricing:
			#  - Underlying price
			#  - Difference between the strike price and underlying price
			$underlying = [double]$inputData[$index + 16].Replace("$", "").Replace(",", "")
			$diff = if ($underlying -gt $strike) { (($strike / $underlying) - 1) * 100 } else { (($strike - $underlying) / $underlying) * 100 }

			# Option field values:
			#  - Volume
			#  - Open interest
			#  - Volume/Open interest
			#  - Implied volatility
			#  - Delta
			#  - Gamma
			#  - Vega
			#  - Theta
			#  - Rho
			#  - Ask
			$volume = [int]$inputData[$index + 28]
			$openInterest = [int]$inputData[$index + 26]
			$vol_oi = $volume / $openInterest
			$impliedVolatility = ([double]$inputData[$index + 30].Replace("%", "")) / 100
			$delta = [double]$inputData[$index + 32]
			$gamma = [double]$inputData[$index + 40]
			$vega = [double]$inputData[$index + 38]
			$theta = [double]$inputData[$index + 42]
			$rho = [double]$inputData[$index + 44]
			$ask = [double]$inputData[$index + 20].Replace("$", "")
	
			$lineHashTable = @{
				"ticker"             = $ticker
				"option_type"        = $optionType
				"alert_date"         = $alertDateSeconds
				"day_of_week"        = $dayOfWeek
				"time_of_day"        = $alertTimeSeconds
				"expires"            = $expirySeconds
				"days_to_expiry"     = $daysToExp
				"strike"             = $strike
				"underlying"         = $underlying
				"diff"               = $diff
				"volume"             = $volume
				"open_interest"      = $openInterest
				"vol/oi"             = $vol_oi
				"implied_volatility" = $impliedVolatility
				"delta"              = $delta
				"gamma"              = $gamma
				"vega"               = $vega
				"theta"              = $theta
				"rho"                = $rho
				"ask"                = $ask
			}
			$json.Add("$($ticker)|$($optionType)|$($alertDateSeconds)", $lineHashTable)
		}
		return ConvertTo-Json $json -Compress
	}
	catch {
		Write-Host "An error occurred parsing incoming realtime data"
		Write-Error $_
	}
	return $null
}

function IngestAlerts {
	param ($inputFilePath, $outputFilePath, $uri)
	if ((Test-Path -Path $outputFilePath -PathType Leaf) -and ($null -ne ($json = Get-Content $outputFilePath))) {
		Write-Host "Executing POST request to: $($uri)"
		Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
	}
	else {
		$data = Get-Content -Path $inputFilePath
		$json = InputToJSON $data
		if ($null -ne $json) {
			Write-Host "Saving parsed realtime data to: $($outputFilePath)"
			$json | Out-File $outputFilePath
			Write-Host "Executing POST request to: $($uri)"
			Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
		}
		else {
			Write-Host "No realtime data in the provided input path :("
		}
	}
}

function Main {
	param ($inputPath, $outputPath, $uri)
	if (Test-Path -Path $inputPath -PathType Leaf) {
		IngestAlerts $inputPath $outputPath $uri
	}
	elseif (Test-Path -Path $inputPath -PathType Container) {
		$files = Get-ChildItem -Path $inputPath
		foreach ($file in $files) {
			$inputFilePath = $file.FullName
			$outputFilePath = "$($outputPath)\$($file.Basename).json"
			IngestAlerts $inputFilePath $outputFilePath $uri
		}
	}
	else {
		Write-Host "Invalid realtime alerts path :("
		return
	}
}

if ([string]::IsNullOrEmpty($ENV_HASH.REALTIME_PROXY_ENDPOINT)) {
	Write-Host "REALTIME_PROXY_ENDPOINT environment variable not provided"
}
elseif ([string]::IsNullOrEmpty($ENV_HASH.WRITE_REALTIME_INPUT)) {
	Write-Host "WRITE_REALTIME_INPUT environment variable not provided"
}
elseif ([string]::IsNullOrEmpty($ENV_HASH.WRITE_REALTIME_OUTPUT)) {
	Write-Host "WRITE_REALTIME_OUTPUT environment variable not provided"
}
else {
	$inputPath = $ENV_HASH.WRITE_REALTIME_INPUT
	$outputPath = $ENV_HASH.WRITE_REALTIME_OUTPUT

	if (-not [string]::IsNullOrEmpty($ENV_HASH.WRITE_REALTIME_FILE)) {
		$inputPath = "$($inputPath)\$($ENV_HASH.WRITE_REALTIME_FILE).txt"
		$outputPath = "$($outputPath)\$($ENV_HASH.WRITE_REALTIME_FILE).json"
	}
	else {
		Write-Host "WRITE_REALTIME_FILE not provided, writing all historical data"
	}

	Main $inputPath $outputPath $ENV_HASH.REALTIME_PROXY_ENDPOINT
}