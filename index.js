var http = require('http');
var url = require('url')

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
    response.writeHead(200, {'Content-Type' : 'text/html'})
    response.write('WILL GET THE USER DETIALS ');
    response.end();
}


console.log("Server running at http://localhost:%d", port);
