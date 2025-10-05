@echo off
echo Compilando SAFI Backend...
cd Safi.Backend
dotnet build
if %ERRORLEVEL% EQU 0 (
    echo Compilacao bem-sucedida!
    echo Executando aplicacao...
    dotnet run
) else (
    echo Erro na compilacao!
    pause
)
