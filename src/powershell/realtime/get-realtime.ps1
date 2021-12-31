$ENV_HASH = @{}
Import-Csv "$(Get-Location)\.env" -Delimiter "=" -Header Var, Value | ForEach-Object { $ENV_HASH[$_.Var] = $_.Value }

function JSONToCSV {
	param ($json)
	$data = ConvertFrom-Json $json
	$sb = [System.Text.StringBuilder]::new()
	[void]$sb.Append("Ticker,Option Type,Alerted At,Day of Week,Time of Day,Expiry,Days to Exp.,Strike,Underlying,Diff %,Volume,Open Interest,Vol/OI,Implied Volatility,Delta,Gamma,Vega,Theta,Rho,Alert Ask,Score`n")
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
		$score = [math]::Round(((CalculateScore $line) * 100), 2)
		[void]$sb.Append("$($line.ticker),$($line.option_type),$($alertDate),$($line.day_of_week.rate)|$($dayOfWeek),$($line.time_of_day.rate)|$($timeOfDay),$($expiry),$($line.days_to_expiry.rate)|$($line.days_to_expiry.value),$($line.strike.rate)|`$$($line.strike.value),$($line.underlying.rate)|`$$($line.underlying.value),$($line.diff.rate)|$($diff)%,$($line.volume.rate)|$($line.volume.value),$($line.open_interest.rate)|$($line.open_interest.value),$($line."vol/oi".rate)|$($vol_oi),$($line.implied_volatility.rate)|$($impliedVol)%,$($line.delta.rate)|$($line.delta.value),$($line.gamma.rate)|$($line.gamma.value),$($line.vega.rate)|$($line.vega.value),$($line.theta.rate)|$($line.theta.value),$($line.rho.rate)|$($line.rho.value),$($line.ask.rate)|`$$($ask),$($score)%`n")
	}
	return $sb.ToString()
}

function CalculateScore {
	param($alert)
	return ((RateToNumber $($line.day_of_week.rate)) +
	(RateToNumber $($line.time_of_day.rate)) +
	(RateToNumber $($line.days_to_expiry.rate)) +
	(RateToNumber $($line.strike.rate)) +
	(RateToNumber $($line.underlying.rate)) +
	(RateToNumber $($line.diff.rate)) +
	(RateToNumber $($line.volume.rate)) +
	(RateToNumber $($line.open_interest.rate)) +
	(RateToNumber $($line."vol/oi".rate)) +
	(RateToNumber $($line.implied_volatility.rate)) +
	(RateToNumber $($line.delta.rate)) +
	(RateToNumber $($line.gamma.rate)) +
	(RateToNumber $($line.vega.rate)) +
	(RateToNumber $($line.theta.rate)) +
	(RateToNumber $($line.rho.rate)) +
	(RateToNumber $($line.ask.rate))) / 64
}

function RateToNumber {
	param ($value)
	switch ($value) {
		"BAD" { return 1; Break }
		"OKAY" { return 2; Break }
		"GOOD" { return 3; Break }
		"BEST" { return 4; Break }
	}
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
	else {
		$json = Invoke-RestMethod -Uri $uri -Method GET	
		$csv = JSONToCSV $json

		$csv | Out-File "$($outputPath)\ALL_DATA.csv"
	}
}

if ([string]::IsNullOrEmpty($ENV_HASH.REALTIME_PROXY_ENDPOINT)) {
	Write-Host "REALTIME_PROXY_ENDPOINT environment variable not provided"
}
elseif ($null -eq $ENV_HASH.GET_REALTIME_OUTPUT) {
	Write-Host "GET_REALTIME_OUTPUT environment variable not provided"
}
else {
	$start = $null
	$stop = $null

	if ((-not [string]::IsNullOrEmpty($ENV_HASH.GET_REALTIME_START)) -and (-not [string]::IsNullOrEmpty($ENV_HASH.GET_REALTIME_STOP))) {
		$start = [double]$ENV_HASH.GET_REALTIME_START
		$stop = [double]$ENV_HASH.GET_REALTIME_STOP
	}
	else {
		Write-Host "GET_REALTIME_START and/or GET_REALTIME_STOP not provided, retrieving all historical data"
	}

	Main $ENV_HASH.REALTIME_PROXY_ENDPOINT $start $stop $ENV_HASH.GET_REALTIME_OUTPUT
}