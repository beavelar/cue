$FILE_NAME = "2021-10-01"
$REALTIME_ALERTS_URI = "http://localhost:3001/realtime"
$TXT_FILE_PATH = "$(Get-Location)\data\realtime-alerts\txt\$($FILE_NAME).txt"
$OUTPUT_JSON_PATH = "$(Get-Location)\data\realtime-alerts\json\$($FILE_NAME).json"

function TxtToJSON {
	param($txt)
	$json = [ordered]@{}
	try {
		for ($index = 0; $index -lt $txt.Length; $index = $index + 46) {
			$header = $txt[$index].Split(" ")
			$ticker = $header[0].Replace("$", "")
			$optionType = if ($header[2] -eq "C") { "Call" } else { "Put" }
			$alertDate = Get-Date $txt[$index+22]
			$alertDateString = $alertDate.ToString("yyyy-MM-ddThh:mm:ss")
			$alertTimeString = $alertDate.ToString("hh:mm:ss")
			$expiryDate = Get-Date $header[1]
			$daysToExp = ($expiryDate - $alertDate).Days
			$underlying = [double]$txt[$index+16].Replace("$", "").Replace(",", "")
			$strike = [double]$header[3].Replace("$", "").Replace(",", "")
			$diff = if ($underlying -gt $strike) { (($strike/$underlying)-1)*100 } else { ($strike-$underlying)*100 }
			$volume = [int]$txt[$index+28]
			$openInterest = [int]$txt[$index+26]
			$vol_oi = $volume/$openInterest
			$impliedVolatility = [double]$txt[$index+30].Replace("%", "")
			$delta = [double]$txt[$index+32]
			$gamma = [double]$txt[$index+40]
			$vega = [double]$txt[$index+38]
			$theta = [double]$txt[$index+42]
			$rho = [double]$txt[$index+44]
			$ask = [double]$txt[$index+20].Replace("$", "")
	
			$lineHashTable = @{
				"ticker" = $ticker
				"option_type" = $optionType
				"alert_date" = $alertDateString
				"time_of_day" = $alertTimeString
				"expires" = $expiryDate.ToString("yyyy-MM-dd")
				"days_to_expiry" = $daysToExp
				"strike" = $strike
				"underlying" = $underlying
				"diff" = $diff
				"volume" = $volume
				"open_interest" = $openInterest
				"vol/oi" = $vol_oi
				"implied_volatility" = $impliedVolatility
				"delta" = $delta
				"gamma" = $gamma
				"vega" = $vega
				"theta" = $theta
				"rho" = $rho
				"ask" = $ask
			}
			$json.Add("$($ticker)|$($optionType)|$($alertDateString)", $lineHashTable)
		}
		return ConvertTo-Json $json -Compress
	}
	catch {
		Write-Host "Whoopsies"
	}
	return $null
}
function Main {
	param ($txtFilePath, $outputJsonPath, $uri)
	if (-not (Test-Path -Path $txtFilePath -PathType Leaf)) {
		Write-Host "No txt file :("
		return
	}
	if ((Test-Path -Path $outputJsonPath -PathType Leaf) -and ($null -ne ($json = Get-Content $outputJsonPath))) {
		Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
	}
	else {
		$data = Get-Content -Path $txtFilePath
		$json = TxtToJSON $data
		if ($null -ne $json) {
			$json | Out-File $outputJsonPath
			Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
		}
		else {
			Write-Host "Empty json :("
		}
	}
}

Main $TXT_FILE_PATH $OUTPUT_JSON_PATH $REALTIME_ALERTS_URI