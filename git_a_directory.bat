@echo off
setlocal enabledelayedexpansion

REM Get repository URL and local directory from command line arguments
set "rurl=%~1"
set "localdir=%~2"

REM Create local directory if it doesn't exist
if not exist "%localdir%" (
    mkdir "%localdir%"
)

REM Change directory to the local directory
cd "%localdir%"

REM Initialize Git repository and add remote
git init
git remote add -f origin "%rurl%"

REM Enable sparse checkout
git config core.sparseCheckout true

REM Loop over remaining arguments and add them to sparse-checkout
shift
:loop
if "%~1"=="" goto :done
echo %~1>> .git\info\sparse-checkout
shift
goto :loop
:done

REM Pull from remote repository
git pull origin master

endlocal