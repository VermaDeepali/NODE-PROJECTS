const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res)=>{
    /* console.log(req.url,req.method);
       console.log("request made");  this console will be shown in backend only not on the browser console coz its server console */

    // lodash
    const num = _.random(0,20);
    console.log(num);

    const greet = _.once(()=>{
        console.log("Hello");
    })

    greet();
    greet();

    // set header content type
    res.setHeader('Content-Type','text/html');

    /*res.write("<h1>Hello World!!!</h1>");
    res.write("<h1>Hello Beautiful!!!</h1>");
    res.end();*/

    let path = './views/';

    switch(req.url){
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/about':
            path += 'about.html'
            res.statusCode = 200;
            break;
        case '/about-me':
            res.statusCode = 301;
            res.setHeader('Location','/about');
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    }

 
    //Send an html data
    fs.readFile(path,(err, data)=>{
        if(err){
            console.log(err);
            res.end();
        }
        // res.write(data);
        res.end(data);
    })


});

server.listen(3000,'localhost',()=>{
    console.log("server is listening for request on port 3000");
})


