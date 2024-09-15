@echo off
setlocal

node vjq-win win %*

@REM echo checking if clasp existsing in your environment. please wait...
@REM clasp -v > nul
@REM echo %ERRORLEVEL%;
@REM if %ERRORLEVEL% equ 0 (
@REM   echo no error
@REM   if exist .clasp.json (
@REM     echo .clasp.json exist
@REM     node vjq %*
@REM   ) else (
@REM     echo .clasp.json does not exist
@REM     node vjq -i
@REM   )
@REM ) else (
@REM   echo therefore, clasp will be installed automatically.
@REM   npm install -g @google/clasp & node vjq -i
@REM )

endlocal