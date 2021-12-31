$ENV_HASH = @{}
Import-Csv "$(Get-Location)\.env" -Delimiter "=" -Header Var, Value | ForEach-Object { $ENV_HASH[$_.Var] = $_.Value }

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
	else {
		$json = Invoke-RestMethod -Uri $uri -Method GET
		$csv = JSONToCSV $json

		$csv | Out-File "$($outputPath)\ALL_DATA.csv"
	}
}

if ([string]::IsNullOrEmpty($ENV_HASH.HISTORICAL_PROXY_ENDPOINT)) {
	Write-Host "HISTORICAL_PROXY_ENDPOINT environment variable not provided"
}
elseif ($null -eq $ENV_HASH.GET_HISTORICAL_OUTPUT) {
	Write-Host "GET_HISTORICAL_OUTPUT environment variable not provided"
}
else {
	$start = $null
	$stop = $null

	if ((-not [string]::IsNullOrEmpty($ENV_HASH.GET_HISTORICAL_START)) -and (-not [string]::IsNullOrEmpty($ENV_HASH.GET_HISTORICAL_STOP))) {
		$start = [double]$ENV_HASH.GET_HISTORICAL_START
		$stop = [double]$ENV_HASH.GET_HISTORICAL_STOP
	}
	else {
		Write-Host "GET_HISTORICAL_START and/or GET_HISTORICAL_STOP not provided, retrieving all historical data"
	}

	Main $ENV_HASH.HISTORICAL_PROXY_ENDPOINT $start $stop $ENV_HASH.GET_HISTORICAL_OUTPUT
}