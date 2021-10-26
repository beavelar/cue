function GetWinLoss {
	param($ask, $low, $lowDate, $alertDate)
	$dateDiff = ($highDate - $lowDate).Days
	$lossPL = ([double]$line.low/[double]$line.ask) - 1

	return -not ($dateDiff -gt 0 -and $lossPL -lt -.25)
}

function Main {
	param ()
	$FILE_NAME = "2020-12"
	$CSV_FILE_PATH = "D:\Projects\Programming\Cue\data\historical-alerts\CM\csv\$($FILE_NAME).csv"
	$OUTPUT_JSON_PATH = "D:\Projects\Programming\Cue\data\historical-alerts\CM\json\$($FILE_NAME).json"

	$data = Import-Csv -Path $CSV_FILE_PATH
	$json = [ordered]@{}

	foreach ($line in $data) {
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
			$pl = ([double]$line.high - [double]$line.ask)/[double]$line.ask
			$timePassed = ($highDate - $alertDate).Days
		}
		else {
			$highestAsk = $line.low
			$pl = ([double]$line.low/[double]$line.ask) - 1
			$timePassed = ($lowDate - $alertDate).Days
		}
		$lineHashTable = @{
			"ticker" = $line.ticker_symbol
			"option_type" = $line.option_type
			"alert_time" = $dateTimeString
			"time_of_day" = $dateTimeString.Split("T")[1].Replace("Z", "")
			"expires" = $line.expires_at
			"days_to_expiry" = ($expireDate - $alertDate).Days
			"strike" = [double]$line.strike_price
			"underlying" = [double]$line.underlying_purchase_price
			"diff" = [double]$line.diff
			"volume" = [int]$line.volume
			"open_interest" = [int]$line.open_interest
			"vol/oi" = [int]$line.volume/[int]$line.open_interest
			"implied_volatility" = [double]$line.implied_volatility
			"delta" = [double]$line.delta
			"gamma" = [double]$line.gamma
			"vega" = [double]$line.vega
			"theta" = [double]$line.theta
			"rho" = [double]$line.rho
			"ask" = [int]$line.ask
			"highest_ask" = $highestAsk
			"p/l" = $pl
			"time_passed" = $timePassed
		}
		$json.Add($line.alert_time, $lineHashTable)
	}
	$json | ConvertTo-Json | Out-File $OUTPUT_JSON_PATH	
}

Main