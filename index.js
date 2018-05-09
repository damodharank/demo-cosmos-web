var http = require('http');
var url = require('url')

var documentClient = require("documentdb").DocumentClient;
var config = require("./config");



var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;


/**
 * Get the database by ID, or create if it doesn't exist.
 * @param {string} database - The database to get or create
 */
function getDatabase() {
    console.log(`Getting database:\n${config.database.id}\n`);
    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Get the collection by ID, or create if it doesn't exist.
 */
function getCollection() {
    console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}



/**
 * Query the collection using SQL
 */
function queryCollection() {
    console.log(`Querying collection through index:\n${config.collection.id}`);

    return new Promise((resolve, reject) => {
        client.queryDocuments(
            collectionUrl,
            'SELECT * FROM c'
        ).toArray((err, results) => {
            if (err) reject(err)
            else {
                for (var queryResult of results) {
                    let resultString = JSON.stringify(queryResult);
                    //console.log(`\tQuery returned ${resultString}`);
                }
                console.log();
                resolve(results);
            }
        });
    });
};

/**
 * Exit the app with a prompt
 * @param {message} message - The message to display
 */
function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}


// getDatabase()
//     .then(() => getCollection())
//     .then(() => queryCollection())
//     .then(() => console.log(" Delete area..."))
//     .then(() => console.log("Cleanup area..."))
//     .then(() => { exit(`Completed successfully`); })
//     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });









var server = http.createServer(onRequest);

var port = process.env.PORT || 1337;
server.listen(port);

function onRequest(request, response) {
    //response.writeHead(200, {"Content-Type": "text/plain"});
    //response.end("My first node app");
    var pathName = url.parse(request.url).pathname
    console.log('pathname---' + pathName);
    //response.writeHead(200);
    //response.write('welcome --');
    //response.end();
    //showpage(response, pathName)
    showfunc(response, pathName)
}

//================= FOR PAGE NAVIGATION ==============//

function showpage(response, pathName){
    if(pageMap[pathName]){
        response.writeHead(200, {'Content-Type' : 'text/html'})
        response.write(pageMap[pathName]);
        response.end();
    }else {
        response.writeHead(404, {'Content-Type': 'text/html'})
        response.write('404 Page not found');
        response.end();
      }
}
var pageMap = {
    '/' : 'Welcome to first app page',
    '/contact': '<h1> Contact Page</h1>',
    '/getuser': '<h1> Contact Page</h1>'
}
//================= FOR FUNCTION NAVIGATION ==============//

function showfunc(response, pathName){
    if(pathName === '/getuser'){
        // response.writeHead(200, {'Content-Type': 'text/html'})
        // response.write("wewewe");
        // response.end();
        getUserDetails(response)
       }else {
        response.writeHead(404, {'Content-Type' : 'text/html'})
        response.write('404 Page not found');
        response.end();
      }
}

function getUserDetails(response){
    // response.writeHead(200, {'Content-Type' : 'text/html'})
    // response.write('WILL GET THE USER DETIALS ');
    var resl = [];
    getDatabase()
    .then(() => getCollection())
    .then(() => queryCollection())
    .then((querydata) => { 

        for (var queryResult of querydata) {
            let resultString = queryResult;
            console.log(`\tQuery -returned---- ${resultString}`);
            resl.push(resultString);
        }
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(resl));
        response.end();
        exit(`Completed successfully--`); })
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   
}


console.log("Server running at http://localhost:%d", port);
