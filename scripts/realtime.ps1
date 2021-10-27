$FILE_NAME = "2021-10-01"
$REALTIME_ALERTS_URI = "http://localhost:3001/realtime"
$TXT_FILE_PATH = "$(Get-Location)\data\realtime-alerts\txt\$($FILE_NAME).txt"
$OUTPUT_JSON_PATH = "$(Get-Location)\data\realtime-alerts\json\$($FILE_NAME).json"

function GetWinLoss {
	param($ask, $low, $lowDate, $alertDate)
	$dateDiff = ($highDate - $lowDate).Days
	$lossPL = ([double]$line.low/[double]$line.ask) - 1

	return -not ($dateDiff -gt 0 -and $lossPL -lt -.25)
}

function Main {
	param ($txtFilePath, $outputJsonPath, $uri)
	$data = Get-Content -Path $txtFilePath
	$json = [ordered]@{}

    for ($index = 0; $index -lt $data.Length; $index = $index + 46) {
        $header = $data[$index].Split(" ")
        $ticker = $header[0].Replace("$", "")
        $optionType = if ($header[2] -eq "C") { "Call" } else { "Put" }
        $alertDate = Get-Date $data[$index+22]
        $alertDateString = $alertDate.ToString("yyyy-MM-ddThh:mm:ss")
        $alertTimeString = $alertDate.ToString("hh:mm:ss")
        $expiryDate = Get-Date $header[1]
        $daysToExp = ($expiryDate - $alertDate).Days
        $underlying = [double]$data[$index+16].Replace("$", "").Replace(",", "")
        $strike = [double]$header[3].Replace("$", "").Replace(",", "")
        $diff = if ($underlying -gt $strike) { (($strike/$underlying)-1)*100 } else { ($strike-$underlying)*100 }
        $volume = [int]$data[$index+28]
        $openInterest = [int]$data[$index+26]
        $vol_oi = $volume/$openInterest
        $impliedVolatility = [double]$data[$index+30].Replace("%", "")
        $delta = [double]$data[$index+32]
        $gamma = [double]$data[$index+40]
        $vega = [double]$data[$index+38]
        $theta = [double]$data[$index+42]
        $rho = [double]$data[$index+44]
        $ask = [double]$data[$index+20].Replace("$", "")

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
    $json | ConvertTo-Json | Out-File $outputJsonPath
	Invoke-RestMethod -Uri $uri -Method POST -Body $json -ContentType "application/json"
}

Main $TXT_FILE_PATH $OUTPUT_JSON_PATH $REALTIME_ALERTS_URI