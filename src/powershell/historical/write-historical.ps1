$HISTORICAL_ALERTS_URI = "http://localhost:3001/historical"

# Variables to utilize if ingesting a single file
# $FILE_NAME = "2021-08"
# $INPUT_PATH = "$(Get-Location)\data\historical-alerts\input\$($FILE_NAME).csv"
# $OUTPUT_PATH = "$(Get-Location)\data\historical-alerts\output\$($FILE_NAME).json"

# Variables to utilize if ingesting a directory with files
$INPUT_PATH = "$(Get-Location)\data\historical-alerts\input"
$OUTPUT_PATH = "$(Get-Location)\data\historical-alerts\output"

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
			$alertDateString = $line.alert_time.Replace(" ", "T")
			$highDateString = $line.high_date_time.Replace(" ", "T")
			$lowDateString = $line.low_date_time.Replace(" ", "T")
			$expireDate = Get-Date $line.expires_at
			$alertDate = Get-Date $alertDateString
			$highDate = Get-Date $highDateString
			$lowDate = Get-Date $lowDateString
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
				"alert_date"         = $alertDateString
				"time_of_day"        = $alertDateString.Split("T")[1].Replace("Z", "")
				"expires"            = $line.expires_at
				"days_to_expiry"     = ($expireDate - $alertDate).Days
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
			$json.Add("$($line.ticker_symbol)|$($TextInfo.ToTitleCase($line.option_type))|$($alertDateString)", $lineHashTable)
		}
		return ConvertTo-Json $json -Compress
	}
	catch {
		Write-Host "An error occurred parsing incoming realtime data"
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
			Write-Host "No historical JSON data in the provided output path :("
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

Main $INPUT_PATH $OUTPUT_PATH $HISTORICAL_ALERTS_URI