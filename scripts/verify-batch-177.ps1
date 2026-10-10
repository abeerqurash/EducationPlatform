param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $projectDirectory
try {
    $checks = @(
        @('run', 'test', '--workspace=@education/database'),
        @('run', 'test', '--workspace=@education/calculators'),
        @('run', 'typecheck'),
        @('run', 'lint')
    )
    if (-not $SkipBuild) { $checks += ,@('run', 'build') }
    foreach ($check in $checks) {
        Write-Host ('Running npm ' + ($check -join ' '))
        & npm.cmd @check
        if ($LASTEXITCODE -ne 0) { throw ('Validation failed: npm ' + ($check -join ' ')) }
    }
    Write-Host 'Batch 177 checks passed. Apply the support migration using the release instructions.'
} finally { Pop-Location }
