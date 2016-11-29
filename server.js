var http = require('http');
var request = require('request');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000,function(){

	server.get
	request({
    	url: 'http://ec2-54-212-222-6.us-west-2.compute.amazonaws.com:3000/fall', //URL to hit
    	qs: {sensor: 'SensorTag2650', severity: '3'}, //Query string data
    	method: 'POST',
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log(response.statusCode, body);
	    }
	});

});


//Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");



