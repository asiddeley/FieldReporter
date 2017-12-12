/**********************************

Contract
Admin
SQL
B
Architecture
H


Andrew Siddeley

12-Dec-2017
********************************/


var casql={};
sql.createProjectTable="CREATE TABLE IF NOT EXISTS projects (pnum, pname, address, client, gc, UNIQUE ( pnum ) ON CONFLICT IGNORE)";

exports.casql=casql;


