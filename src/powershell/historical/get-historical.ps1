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
	$mtTimezone = Get-TimeZone -Id "Mountain Standard Time" 
	foreach ($line in $data) {
		$alertDate = Get-Date -UnixTimeSeconds $line.alert_date -Format "yyyy-MM-dd HH:mm"
		$expiry = Get-Date -UnixTimeSeconds $line.expires -Format "yyyy-MM-dd"
		$dayOfWeek = NumberToDayOfWeek $line.day_of_week
		$timeOfDayUTC = Get-Date -UnixTimeSeconds $line.time_of_day
		$timeOfDay = Get-Date ($timeOfDayUTC.AddHours( - ($mtTimezone.BaseUtcOffset.totalhours))) -Format "HH:mm"
		$diff = [math]::Round($line.diff, 2)
		$vol_oi = [math]::Round(($line."vol/oi" * 100), 2)
		$impliedVol = [math]::Round(($line.implied_volatility * 100), 2)
		$ask = $line.ask * 100
		$highestAsk = $line.highest_ask * 100
		$p_l = [math]::Round(($line."p/l" * 100), 2)
		[void]$sb.Append("$($line.ticker),$($line.option_type),$($alertDate),$($dayOfWeek),$($timeOfDay),$($expiry),$($line.days_to_expiry),`$$($line.strike),`$$($line.underlying),$($diff)%,$($line.volume),$($line.open_interest),$($vol_oi),$($impliedVol)%,$($line.delta),$($line.gamma),$($line.vega),$($line.theta),$($line.rho),`$$($ask),`$$($highestAsk),$($p_l)%,$($line.time_passed),$($line.rate)`n")
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