$HISTORICAL_ALERTS_URI = "http://localhost:3001/historical"
$START_DATE = 1627862400
$STOP_DATE = 1627948800

function Main {
	param ($uri, $start, $stop)
	if (($null -ne $start) -and ($null -ne $stop)) {
		Invoke-RestMethod -Uri "$($uri)/$($start)/$($stop)" -Method GET
	}
	elseif ($null -ne $start) {
		Invoke-RestMethod -Uri "$($uri)/$($start)" -Method GET
	}
	else {
		Invoke-RestMethod -Uri $uri -Method GET	
	}
}

Main $HISTORICAL_ALERTS_URI $START_DATE $STOP_DATE