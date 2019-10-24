@ECHO OFF

rem ======================================= Login ==============================================

call :log Starting Microsoft authorization service...
az login || goto :error

rem ======================================= Functions ==========================================

:log 
echo [RELEASER LOGGER] %*
goto :eof

:error
IF %ERRORLEVEL% NEQ 0 (
echo [ERROR] Application failed with error #%ERRORLEVEL%
echo [ERROR] Make sure you have AZURE CLI installed
error /b 1
)