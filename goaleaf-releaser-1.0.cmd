@ECHO OFF

set RELEASER_VERSION=1.0

rem ==================================== Configuration ==================================================

set GIT="C:\Program Files\Git\bin\git.exe"
set MVN="C:\opt\apache-maven-3.6.1\bin\mvn.cmd"
set JAVA="C:\Program Files\Java\jdk1.8.0_192"
set WORKSPACE_DIRECTORY=%CD%

rem ===================================== Check these variables before releasing ========================

rem Repository link
set REPOSITORY=https://github.com/Pplociennik/GoaLeaf.git

rem Repository name
set REPOSITORY_NAME=GoaLeaf

rem This is the branch we are working on
set DEVELOP_BRANCH=develop

rem This is the branch where releases are stored
set RELEASE_BRANCH=develop

rem ------------------------------------------------------------------------------------------------------

rem This is last stable released version
set LAST_STABLE_VERSION=0.2.0

rem This is the version that will be released
set RELEASED_VERSION=0.2.1

rem This is the version that will be pushed on develop branch
set NEXT_VERSION=0.3.0

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

IF EXIST %WORKSPACE_DIRECTORY%\workspace (
call :cleanWorkspace
)

call :log Creating workspace directory
mkdir workspace

call :log Starting executing phase 1

call :clone
 
call :changeCatalogue "workspace\%REPOSITORY_NAME%\Server"

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

:cleanWorkspace
call :log Cleaning workspace directory
rmdir /s /q workspace || goto :error
goto :eof

:clone
call :log Cloning repository %REPOSITORY%
call :changeCatalogue workspace
%GIT% clone %REPOSITORY% || goto :error
call :log Finished cloning repository %REPOSITORY%
call :changeCatalogue "workspace\%REPOSITORY_NAME%"
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
%MVN% azure-webapp:deploy || goto :error
call :log Finished goaleaf server deploy
goto :eof

:pushRelease
call :log Pushing goaleaf server release version to repository.
%GIT% add . || goto :error
%GIT% commit -a -m "Release %RELEASED_VERSION%" || goto :error
%GIT% push || goto :error
call :log Pushed goaleaf server release version to repository
goto :eof

:pushDevelop
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

:changeCatalogue
cd "%WORKSPACE_DIRECTORY%\%1" || goto :error
call :log Changed workspace to %CD%
goto :eof

:error
IF %ERRORLEVEL% NEQ 0 (
echo [ERROR] Goaleaf Releaser failed with error #%ERRORLEVEL%
exit /b 1
)

:log
echo [RELEASER] %* || goto :error
goto :eof