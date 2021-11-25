$HISTORICAL_ALERTS_URI = "http://localhost:3001/historical"
$OUTPUT_PATH = "$(Get-Location)\data\options-recap\historical\csv"

# Utilize when specifying start and/or stop time
$START_DATE = 1627862400
$STOP_DATE = 1627948800

# Utilize when not specifying start and/or stop time
# $START_DATE = $null
# $STOP_DATE = $null

function Main {
	param ($uri, $start, $stop, $outputPath)
	if (($null -ne $start) -and ($null -ne $stop)) {
		Invoke-RestMethod -Uri "$($uri)/$($start)/$($stop)" -Method GET
		$csv = JSONToCSV $json

		$startDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($start))).ToString("yyyy.MM.dd-hh.mm.ss")
		$stopDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($stop))).ToString("yyyy.MM.dd-hh.mm.ss")
		$csv | Out-File "$($outputPath)\$($startDate)_$($stopDate).csv"
	}
	elseif ($null -ne $start) {
		Invoke-RestMethod -Uri "$($uri)/$($start)" -Method GET
		$csv = JSONToCSV $json

		$startDate = ((Get-Date 01.01.1970) + ([System.TimeSpan]::fromseconds($start))).ToString("yyyy.MM.dd-hh.mm.ss")
		$csv | Out-File "$($outputPath)\$($startDate).csv"
	}
	else {
		Invoke-RestMethod -Uri $uri -Method GET
		$csv = JSONToCSV $json

		$csv | Out-File "$($outputPath)\ALL_DATA.csv"
	}
}

Main $HISTORICAL_ALERTS_URI $START_DATE $STOP_DATE $OUTPUT_PATH