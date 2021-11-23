$HISTORICAL_ALERTS_URI = "http://localhost:3001/historical"

function Main {
	param ($uri)
	Invoke-RestMethod -Uri $uri -Method DELETE
}

Main $HISTORICAL_ALERTS_URI