$REALTIME_ALERTS_URI = "http://localhost:3001/realtime"
$OUTPUT_PATH = "$(Get-Location)\data\options-recap\realtime\csv"

# Utilize when specifying start and/or stop time
$START_DATE = 1630972800
$STOP_DATE = 1631059200

# Utilize when not specifying start and/or stop time
# $START_DATE = $null
# $STOP_DATE = $null

function JSONToCSV {
	param ($json)
	$data = ConvertFrom-Json $json
	$sb = [System.Text.StringBuilder]::new()
	[void]$sb.Append("Ticker,Option Type,Alerted At,Day of Week,Time of Day,Expiry,Days to Exp.,Strike,Underlying,Diff %,Volume,Open Interest,Vol/OI,Implied Volatility,Delta,Gamma,Vega,Theta,Rho,Alert Ask`n")
	$mtTimezone = Get-TimeZone -Id "Mountain Standard Time" 
	foreach ($line in $data) {
		$alertDate = Get-Date -UnixTimeSeconds $line.alert_date -Format "yyyy-MM-dd HH:mm"
		$expiry = Get-Date -UnixTimeSeconds $line.expires -Format "yyyy-MM-dd"
		$dayOfWeek = NumberToDayOfWeek $line.day_of_week.value
		$timeOfDayUTC = Get-Date -UnixTimeSeconds $line.time_of_day.value
		$timeOfDay = Get-Date ($timeOfDayUTC.AddHours( - ($mtTimezone.BaseUtcOffset.totalhours))) -Format "HH:mm"
		$diff = [math]::Round($line.diff.value, 2)
		$vol_oi = [math]::Round(($line."vol/oi".value * 100), 2)
		$impliedVol = [math]::Round(($line.implied_volatility.value * 100), 2)
		$ask = $line.ask.value * 100
		[void]$sb.Append("$($line.ticker),$($line.option_type),$($alertDate),$($line.day_of_week.rate)|$($dayOfWeek),$($line.time_of_day.rate)|$($timeOfDay),$($expiry),$($line.days_to_expiry.rate)|$($line.days_to_expiry.value),$($line.strike.rate)|`$$($line.strike.value),$($line.underlying.rate)|`$$($line.underlying.value),$($line.diff.rate)|$($diff)%,$($line.volume.rate)|$($line.volume.value),$($line.open_interest.rate)|$($line.open_interest.value),$($line."vol/oi".rate)|$($vol_oi),$($line.implied_volatility.rate)|$($impliedVol)%,$($line.delta.rate)|$($line.delta.value),$($line.gamma.rate)|$($line.gamma.value),$($line.vega.rate)|$($line.vega.value),$($line.theta.rate)|$($line.theta.value),$($line.rho.rate)|$($line.rho.value),$($line.ask.rate)|`$$($ask)`n")
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

Main $REALTIME_ALERTS_URI $START_DATE $STOP_DATE $OUTPUT_PATH