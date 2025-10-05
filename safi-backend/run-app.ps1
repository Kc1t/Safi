# Script para executar a aplicação SAFI Backend
Write-Host "Iniciando SAFI Backend..." -ForegroundColor Green

# Navegar para o diretório do projeto
Set-Location "Safi.Backend"

# Compilar o projeto
Write-Host "Compilando projeto..." -ForegroundColor Yellow
dotnet build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilação bem-sucedida!" -ForegroundColor Green
    Write-Host "Iniciando aplicação..." -ForegroundColor Yellow
    
    # Executar a aplicação
    dotnet run
} else {
    Write-Host "Erro na compilação!" -ForegroundColor Red
}


