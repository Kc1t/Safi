# Script PowerShell para compilar e executar SAFI Backend
Write-Host "=== SAFI Backend - Script de Compilação ===" -ForegroundColor Green

# Navegar para o diretório do projeto
Set-Location "Safi.Backend"

Write-Host "Diretório atual: $(Get-Location)" -ForegroundColor Yellow

# Limpar build anterior
Write-Host "Limpando build anterior..." -ForegroundColor Yellow
if (Test-Path "bin") { Remove-Item -Recurse -Force "bin" }
if (Test-Path "obj") { Remove-Item -Recurse -Force "obj" }

# Restaurar pacotes
Write-Host "Restaurando pacotes NuGet..." -ForegroundColor Yellow
dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro na restauração de pacotes!" -ForegroundColor Red
    exit 1
}

# Compilar o projeto
Write-Host "Compilando projeto..." -ForegroundColor Yellow
dotnet build --verbosity normal

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilação bem-sucedida!" -ForegroundColor Green
    Write-Host "Iniciando aplicação..." -ForegroundColor Yellow
    Write-Host "Acesse: https://localhost:7001/scalar/v1" -ForegroundColor Cyan
    dotnet run
} else {
    Write-Host "Erro na compilação!" -ForegroundColor Red
    Write-Host "Verifique os erros acima." -ForegroundColor Red
}
