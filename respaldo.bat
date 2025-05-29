@echo off
setlocal

set MYSQL_USER=root
set MYSQL_PASSWORD=
set DATABASE=checktec
set PATH_MYSQLDUMP="C:\xampp\mysql\bin\mysqldump.exe"
set BACKUP_DIR=C:\respaldos_mysql

for /f "tokens=2 delims==." %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set FECHA=%datetime:~0,8%
set HORA=%datetime:~8,6%
set FECHA=%FECHA:~0,4%-%FECHA:~4,2%-%FECHA:~6,2%
set HORA=%HORA:~0,2%%HORA:~2,2%

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

::echo "%BACKUP_DIR%\%DATABASE%_%FECHA%_%HORA%.sql"

%PATH_MYSQLDUMP% -u %MYSQL_USER% %DATABASE% > "%BACKUP_DIR%\%DATABASE%_%FECHA%_%HORA%.sql"

endlocal