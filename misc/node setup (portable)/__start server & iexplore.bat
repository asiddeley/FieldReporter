echo off
path=%path%;C:\Users\ASIDDELEY\Documents\ASi Dev\__node portable\npm-1.4.9\node_modules\npm\bin
path=%path%;C:\Users\ASIDDELEY\Documents\ASi Dev\__node portable
path=%path%;C:\Program Files\Internet Explorer
set PROMPT=NODE $P$G
REM ////////////////////////////////////////////////
REM use start for asynchronous batch command else batch blocked until command done. 
start "1" http-server
start "2" iexplore.exe  http://localhost:8080
