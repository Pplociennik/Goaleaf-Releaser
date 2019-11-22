@ECHO OFF

rem ======================================= Login ==============================================

call :log Starting Heroku authorization service...
heroku login || goto :error

rem ======================================= Functions ==========================================

:log 
echo [RELEASER LOGGER] %*
goto :eof

:error
IF %ERRORLEVEL% NEQ 0 (
echo [ERROR] Application failed with error #%ERRORLEVEL%
echo [ERROR] Make sure you have HEROKU CLI installed
error /b 1
)