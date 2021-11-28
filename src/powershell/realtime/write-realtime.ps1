$REALTIME_ALERTS_URI = "http://localhost:3001/realtime"

# Variables to utilize if ingesting a single file
# $FILE_NAME = "2021-10-01"
# $INPUT_PATH = "$(Get-Location)\data\realtime-alerts\input\$($FILE_NAME).txt"
# $OUTPUT_PATH = "$(Get-Location)\data\realtime-alerts\output\$($FILE_NAME).json"

# Variables to utilize if ingesting a directory with files
$INPUT_PATH = "$(Get-Location)\data\realtime-alerts\input"
$OUTPUT_PATH = "$(Get-Location)\data\realtime-alerts\output"

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
			#  - Day of alert
			#  - Seconds of day
			#  - Alert time seconds
			#  - Days to expiration
			#  - Expiration in seconds
			$alertDate = Get-Date $inputData[$index + 22]
			$alertDateSeconds = ([DateTimeOffset]$alertDate).ToUnixTimeSeconds()
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

Main $INPUT_PATH $OUTPUT_PATH $REALTIME_ALERTS_URI