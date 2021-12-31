$ENV_HASH = @{}
Import-Csv "$(Get-Location)\.env" -Delimiter "=" -Header Var, Value | ForEach-Object { $ENV_HASH[$_.Var] = $_.Value }

function Main {
	param ($uri)
	Invoke-RestMethod -Uri $uri -Method DELETE
}

if ([string]::IsNullOrEmpty($ENV_HASH.HISTORICAL_PROXY_ENDPOINT)) {
	Write-Host "HISTORICAL_PROXY_ENDPOINT environment variable not provided"
}
else {
	Main $ENV_HASH.HISTORICAL_PROXY_ENDPOINT
}