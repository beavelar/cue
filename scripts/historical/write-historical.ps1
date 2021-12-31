$ENV_HASH = @{}
Import-Csv "$(Get-Location)\.env" -Delimiter "=" -Header Var, Value | ForEach-Object { $ENV_HASH[$_.Var] = $_.Value }

function GetWinLoss {
	param($ask, $low, $lowDate, $alertDate)
	$dateDiff = ($highDate - $lowDate).Days
	$lossPL = ([double]$line.low / [double]$line.ask) - 1

	return -not ($dateDiff -gt 0 -and $lossPL -lt -.25)
}

function InputToJSON {
	param($inputData)
	$json = [ordered]@{}
	$TextInfo = (Get-Culture).TextInfo
	try {
		Write-Host "Parsing ingested historical data"
		foreach ($line in $inputData) {
			# Date info:
			#  - Alert date
			#  - Alert date seconds
			#  - Day of week
			#  - Day of alert
			#  - Seconds of day
			#  - Alert time seconds
			#  - Expiry date
			#  - Days to expiration
			#  - Expiration in seconds
			#  - High date
			#  - Low date
			$alertDate = Get-Date $line.alert_time.Replace(" ", "T")
			$alertDateSeconds = ([DateTimeOffset]$alertDate).ToUnixTimeSeconds()
			$dayOfWeek = $alertDate.DayOfWeek
			$dayOfAlert = Get-Date $alertDate.ToString("yyyy-MM-dd")
			$secondsOfDay = ([DateTimeOffset]$dayOfAlert).ToUnixTimeSeconds()
			$alertTimeSeconds = $alertDateSeconds - $secondsOfDay
			$expiryDate = Get-Date $line.expires_at
			$daysToExp = ($expiryDate - $alertDate).Days
			$expirySeconds = ([DateTimeOffset]$expiryDate).ToUnixTimeSeconds()
			$highDate = Get-Date $line.high_date_time.Replace(" ", "T")
			$lowDate = Get-Date $line.low_date_time.Replace(" ", "T")
			
			# P/L info:
			#  - Highest ask
			#  - P/L
			#  - Time passed after alert date to highest ask date
			$highestAsk = 0
			$pl = 0
			$timePassed = 0
			if (GetWinLoss $line.ask $line.low $lowDate $alertDate) {
				$highestAsk = [double]$line.high
				$pl = ([double]$line.high - [double]$line.ask) / [double]$line.ask
				$timePassed = ($highDate - $alertDate).Days
			}
			else {
				$highestAsk = [double]$line.low
				$pl = ([double]$line.low / [double]$line.ask) - 1
				$timePassed = ($lowDate - $alertDate).Days
			}

			$lineHashTable = @{
				"ticker"             = $line.ticker_symbol
				"option_type"        = $TextInfo.ToTitleCase($line.option_type)
				"alert_date"         = $alertDateSeconds
				"day_of_week"        = $dayOfWeek
				"time_of_day"        = $alertTimeSeconds
				"expires"            = $expirySeconds
				"days_to_expiry"     = $daysToExp
				"strike"             = [double]$line.strike_price
				"underlying"         = [double]$line.underlying_purchase_price
				"diff"               = [double]$line.diff
				"volume"             = [int]$line.volume
				"open_interest"      = [int]$line.open_interest
				"vol/oi"             = [int]$line.volume / [int]$line.open_interest
				"implied_volatility" = [double]$line.implied_volatility
				"delta"              = [double]$line.delta
				"gamma"              = [double]$line.gamma
				"vega"               = [double]$line.vega
				"theta"              = [double]$line.theta
				"rho"                = [double]$line.rho
				"ask"                = [double]$line.ask
				"highest_ask"        = $highestAsk
				"p/l"                = $pl
				"time_passed"        = $timePassed
			}
			$json.Add("$($line.ticker_symbol)|$($TextInfo.ToTitleCase($line.option_type))|$($alertDateSeconds)", $lineHashTable)
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
		$data = Import-Csv -Path $inputFilePath
		$json = InputToJSON $data
		if ($null -ne $json) {
			Write-Host "Saving parsed historical data to: $($outputFilePath)"
			$json | Out-File $outputFilePath
			Write-Host "Executing POST request to: $($uri)"
			Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
		}
		else {
			Write-Host "No historical data in the provided input path :("
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
		Write-Host "Invalid historical alerts path :("
		return
	}
}

if ([string]::IsNullOrEmpty($ENV_HASH.HISTORICAL_PROXY_ENDPOINT)) {
	Write-Host "HISTORICAL_PROXY_ENDPOINT environment variable not provided"
}
elseif ([string]::IsNullOrEmpty($ENV_HASH.WRITE_HISTORICAL_INPUT)) {
	Write-Host "WRITE_HISTORICAL_INPUT environment variable not provided"
}
elseif ([string]::IsNullOrEmpty($ENV_HASH.WRITE_HISTORICAL_OUTPUT)) {
	Write-Host "WRITE_HISTORICAL_OUTPUT environment variable not provided"
}
else {
	$inputPath = $ENV_HASH.WRITE_HISTORICAL_INPUT
	$outputPath = $ENV_HASH.WRITE_HISTORICAL_OUTPUT

	if (-not [string]::IsNullOrEmpty($ENV_HASH.WRITE_HISTORICAL_FILE)) {
		$inputPath = "$($inputPath)\$($ENV_HASH.WRITE_HISTORICAL_FILE).csv"
		$outputPath = "$($outputPath)\$($ENV_HASH.WRITE_HISTORICAL_FILE).json"
	}
	else {
		Write-Host "WRITE_HISTORICAL_FILE not provided, writing all historical data"
	}

	Main $inputPath $outputPath $ENV_HASH.HISTORICAL_PROXY_ENDPOINT
}