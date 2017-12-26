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

exports.createTableComments="CREATE TABLE IF NOT EXISTS comments ( itemno, pnum, svrnum, comment, refs )";

exports.createTableIssues="CREATE TABLE IF NOT EXISTS issues (iid, pnum, description, dateopened, dateclosed, status, idrefs, UNIQUE ( iid ) ON CONFLICT IGNORE)";

exports.createTablePhotos="CREATE TABLE IF NOT EXISTS photos (pid, pnum, folder, description, datetaken, xdata, UNIQUE ( pid ) ON CONFLICT IGNORE)";

exports.createTableGlobals="CREATE TABLE IF NOT EXISTS globals (name, value, UNIQUE ( name ) ON CONFLICT REPLACE)";



