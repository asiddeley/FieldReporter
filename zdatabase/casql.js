/**********************************

Contract
Admin
Site | SQL database
Built for
Architectural
Heros

Andrew Siddeley

12-Dec-2017
********************************/


exports.createTableProjects="CREATE TABLE IF NOT EXISTS projects (pnum, pname, address, client, gc, xdata, UNIQUE ( pnum ) ON CONFLICT IGNORE)";

exports.createTableSVRs="CREATE TABLE IF NOT EXISTS svrs (svrnum, pnum, title, dateofvisit, timeofvisit, dateofreport, reviewer, xdata, UNIQUE ( svrnum ) ON CONFLICT IGNORE)";








