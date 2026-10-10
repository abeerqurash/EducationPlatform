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
    Write-Host 'Automated release checks passed. Apply the migration/role seed separately and verify your own accounts.'
} finally { Pop-Location }
