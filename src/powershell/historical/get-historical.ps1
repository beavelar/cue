$HISTORICAL_ALERTS_URI = "http://localhost:3001/historical"
$OUTPUT_PATH = "$(Get-Location)\data\options-recap\historical\csv"

# Utilize when specifying start and/or stop time
$START_DATE = 1627862400
$STOP_DATE = 1627948800

# Utilize when not specifying start and/or stop time
# $START_DATE = $null
# $STOP_DATE = $null

function JSONToCSV {
	param ($json)
	$data = ConvertFrom-Json $json
	$sb = [System.Text.StringBuilder]::new()
	[void]$sb.Append("Ticker,Option Type,Alerted At,Day of Week,Time of Day,Expiry,Days to Exp.,Strike,Underlying,Diff %,Volume,Open Interest,Vol/OI,Implied Volatility,Delta,Gamma,Vega,Theta,Rho,Alert Ask,Highest Ask,P/L,Time Passed,Rate`n")
	foreach ($line in $data) {
		$alertDate = Get-Date -UnixTimeSeconds $line.alert_date -Format "yyyy-MM-dd HH:mm"
		$expiry = Get-Date -UnixTimeSeconds $line.expires -Format "yyyy-MM-dd"
		$dayOfWeek = NumberToDayOfWeek $line.day_of_week
		[void]$sb.Append("$($line.ticker),$($line.option_type),$($alertDate),$($dayOfWeek),$($line.time_of_day),$($expiry),$($line.days_to_expiry),$($line.strike),$($line.underlying),$($line.diff),$($line.volume),$($line.open_interest),$($line."vol/oi"),$($line.implied_volatility),$($line.delta),$($line.gamma),$($line.vega),$($line.theta),$($line.rho),$($line.ask),$($line.highest_ask),$($line."p/l"),$($line.time_passed),$($line.rate)`n")
	}
	return $sb.ToString()
}

function NumberToDayOfWeek {
	param ($value)
	switch ($value) {
		0 { return "Sunday"; Break }
		1 { return "Monday"; Break }
		2 { return "Tuesday"; Break }
		3 { return "Wednesday"; Break }
		4 { return "Thursday"; Break }
		5 { return "Friday"; Break }
		6 { return "Saturday"; Break }
		default { return "Unknown" }
	}
}

function Main {
	param ($uri, $start, $stop, $outputPath)
	if (($null -ne $start) -and ($null -ne $stop)) {
		$json = Invoke-RestMethod -Uri "$($uri)/$($start)/$($stop)" -Method GET
		$csv = JSONToCSV $json

		$startDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($start))).ToString("yyyy.MM.dd-hh.mm.ss")
		$stopDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($stop))).ToString("yyyy.MM.dd-hh.mm.ss")
		$csv | Out-File "$($outputPath)\$($startDate)_$($stopDate).csv"
	}
	elseif ($null -ne $start) {
		$json = Invoke-RestMethod -Uri "$($uri)/$($start)" -Method GET
		$csv = JSONToCSV $json

		$startDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($start))).ToString("yyyy.MM.dd-hh.mm.ss")
		$csv | Out-File "$($outputPath)\$($startDate).csv"
	}
	else {
		$json = Invoke-RestMethod -Uri $uri -Method GET
		$csv = JSONToCSV $json

		$csv | Out-File "$($outputPath)\ALL_DATA.csv"
	}
}

Main $HISTORICAL_ALERTS_URI $START_DATE $STOP_DATE $OUTPUT_PATH