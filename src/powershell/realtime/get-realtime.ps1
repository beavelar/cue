$REALTIME_ALERTS_URI = "http://localhost:3001/realtime"

function Main {
	param ($uri)
	Invoke-RestMethod -Uri $uri -Method GET
}

Main $REALTIME_ALERTS_URI