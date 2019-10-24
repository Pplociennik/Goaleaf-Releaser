@ECHO OFF

set RELEASER_VERSION=1.1

rem ==================================== Configuration ==================================================

set GIT="C:\Program Files\Git\bin\git.exe"
set MVN="C:\opt\apache-maven-3.6.1\bin\mvn.cmd"
set JAVA="C:\Program Files\Java\jdk1.8.0_192"
set MAIN_DIRECTORY=%CD%
set WORKSPACE_DIRECTORY=%MAIN_DIRECTORY%\workspace
set RELEASE_DIRECTORY=%MAIN_DIRECTORY%\distribution
set CONFIG_DIRECTORY=%MAIN_DIRECTORY%\.config

rem ===================================== Check these variables before releasing ========================

rem Repository link
set REPOSITORY=https://github.com/Pplociennik/GoaLeaf.git

rem Repository name
set REPOSITORY_NAME=GoaLeaf

rem This is the branch we are working on
set DEVELOP_BRANCH=develop

rem This is the branch where releases are stored
set RELEASE_BRANCH=develop

rem This is release repository
set RELEASE_REPOSITORY=https://glf_git_deployAdmin@glf-api.scm.azurewebsites.net/glf-api.git

rem ------------------------------------------------------------------------------------------------------

rem This is last stable released version
set LAST_STABLE_VERSION=0.2.1

rem This is the version that will be released
set RELEASED_VERSION=0.3.0

rem This is the version that will be pushed on develop branch
set NEXT_VERSION=0.4.0

rem =============================================== PHASE 1 ========================================================

call :log Starting Goaleaf Releaser v.%RELEASER_VERSION%

echo You are going to release Goaleaf server version:
echo        last     : %LAST_STABLE_VERSION%
echo        released : %RELEASED_VERSION%
echo        next     : %NEXT_VERSION%


set /p VERSIONS_CONFIRM="Would you like to begin release process? y/n : "

IF "%VERSIONS_CONFIRM%" EQU "y" (
ECHO Starting...
) ELSE (
goto :eof
)

call :prepareWorkspace

call :changeDirectory %WORKSPACE_DIRECTORY% || goto :error

call :log Starting executing phase 1

call :clone
 
call :changeDirectory "%WORKSPACE_DIRECTORY%\%REPOSITORY_NAME%\Server"

call :build

call :buildPackage

call :log Finished executing phase 1

set /p DEPLOY_CONFIRM="Distribution package built. Are you sure you want to make a release? y/n : "
IF "%DEPLOY_CONFIRM%" EQU "n" (
call :log Release process aborted...
call :error GOALEAF RELEASE FAILURE
exit /b 1
)

rem =============================================== PHASE 2 ========================================================

call :log Starting executing phase 2

call :prepareReleaseRepository

call :deploy

call :log Finished executing phase 2

set /p PUSH_CONFIRM="[GSA Deploy Success] Goaleaf Server Application deployed! Would you like to push release and snapshot versions to github? y/n : "
IF "%PUSH_CONFIRM%" EQU "n" (
call :log Release process aborted...
call :error GOALEAF RELEASE FAILURE
exit /b 1
)

rem =============================================== PHASE 3 =========================================================

call :log Starting executing phase 3

call :pushRelease

call :pushDevelop

call :log Finished executing phase 3

call :log GOALEAF RELEASE SUCCESS

exit /b 0

rem ========================================================================================================

:prepareWorkspace
IF EXIST %WORKSPACE_DIRECTORY% (
call :cleanWorkspace
)
call :log Creating workspace directory
mkdir workspace || goto :error
goto :eof

:prepareReleaseRepository
IF EXIST %RELEASE_DIRECTORY% (
rmdir /s /q %RELEASE_DIRECTORY% || goto :error
call :log Removed repository directory
)
mkdir %RELEASE_DIRECTORY% || goto :error
call :log Created repository directory
call :changeDirectory %RELEASE_DIRECTORY%
%GIT% init || goto :error
call :log Initiated git repository
%GIT% remote add origin %RELEASE_REPOSITORY% || goto :error
call :log Added remote url: %RELEASE_REPOSITORY%
rem call :log Pulling repository
rem %GIT% pull origin master || goto :error
rem call :log Cloning repository from %RELEASE_REPOSITORY%
rem %GIT% clone %RELEASE_REPOSITORY% || goto :error
rem call :log Repository cloned successfully
rem call :log Clearing repository
rem del /q /s *.* || goto :error
rem %GIT% rm . || goto :error
rem call :log Repository empty!
goto :eof

:cleanWorkspace
call :log Cleaning workspace directory
rmdir /s /q workspace || goto :error
goto :eof

:updateConfig
call :log Updating web.config file version to %RELEASED_VERSION%
rem sed -i 's/%LAST_STABLE_VERSION%/%RELEASED_VERSION%/g' %CONFIG_DIRECTORY%\web.config || goto :error
rem for /f "tokens=*" %%a in (%CONFIG_DIRECTORY%\web.config) do (
rem   set newline=%%a
rem    call set newline= %%newline:%LAST_STABLE_VERSION%=%RELEASED_VERSION% %%
rem    call echo %%newline%% >>%RELEASE_DIRECTORY%\web.config
rem )
powershell -Command "(gc %CONFIG_DIRECTORY%\web.config) -replace '%LAST_STABLE_VERSION%', '%RELEASED_VERSION%' | Out-File -encoding ASCII %RELEASE_DIRECTORY%\web.config" || goto :error
call :log Finished updating web.config file
goto :eof

:clone
call :log Cloning repository %REPOSITORY%
%GIT% clone %REPOSITORY% || goto :error
call :log Finished cloning repository %REPOSITORY%
call :changeDirectory "%WORKSPACE_DIRECTORY%\%REPOSITORY_NAME%"
call :log Checking out branch %DEVELOP_BRANCH%...
%GIT% checkout %DEVELOP_BRANCH% || goto :error
call :log Updating repository
%GIT% pull || goto :error
goto :eof

:build
call :log Building goaleaf server project
call :changeVersion %RELEASED_VERSION%
%MVN% clean install || goto :error
call :log Finished building goaleaf server project
goto :eof

:buildPackage
call :log Building goaleaf server distribution package
%MVN% clean package || goto :error
call :log Finished building server distribution package
goto :eof

:deploy
call :log Starting goaleaf server deploy.
rem %MVN% azure-webapp:deploy || goto :error
call :changeDirectory %WORKSPACE_DIRECTORY%\%REPOSITORY_NAME%\Server\target
copy GoaLeaf-%RELEASED_VERSION%.war %RELEASE_DIRECTORY% || goto :error
call :changeDirectory %CONFIG_DIRECTORY%
call :updateConfig
rem copy web.config %RELEASE_DIRECTORY% || goto :error
call :changeDirectory %RELEASE_DIRECTORY%
%GIT% add . || goto :error
%GIT% commit -m "Release %RELEASED_VERSION%" || goto :error
git push -f origin master || goto :error
call :log Finished goaleaf server deploy
goto :eof

:pushRelease
call :changeDirectory %WORKSPACE_DIRECTORY%\%REPOSITORY_NAME%\Server
call :log Pushing goaleaf server release version to repository.
%GIT% add . || goto :error
%GIT% commit -a -m "Release %RELEASED_VERSION%" || goto :error
%GIT% push || goto :error
call :log Pushed goaleaf server release version to repository
goto :eof

:pushDevelop
call :changeDirectory %WORKSPACE_DIRECTORY%\%REPOSITORY_NAME%\Server
call :log Pushing development version to repository.
call :changeVersion %NEXT_VERSION%-SNAPSHOT
%GIT%  add . || goto :error
%GIT% commit -a -m "Next version is %NEXT_VERSION%"
%GIT% push || goto :error
call :log Pushed development version to repository
goto :eof

:changeVersion
call :log Changing project version to %1
%MVN% versions:set -DnewVersion=%1 -DgenerateBackupPoms=false || goto :error
call :log Changed project version to %1
goto :eof

:changeDirectory
popd
call :log Changing directory to %1
pushd "%1" || goto :error
call :log Changed directory to %CD%
goto :eof

:error
IF %ERRORLEVEL% NEQ 0 (
echo [ERROR] Goaleaf Releaser failed with error #%ERRORLEVEL%
exit /b 1
)

:log
echo [RELEASER] %* || goto :error
goto :eof