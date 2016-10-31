var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET message send page with the same view. */
router.get('/send', function(req, res, next) {
  res.render('index', { title: 'Express' });
  request({
    url: 'http://ec2-54-212-222-6.us-west-2.compute.amazonaws.com:3000', //URL to hit
    qs: {to: '5121234567', msg: 'Whatsup Lena??'}, //Query string data
    method: 'POST',
	}, function(error, response, body){
	  	if(error) {
	     	console.log(error);
	    } else {
	        console.log(response.statusCode, body);
	    }
	});
});



module.exports = router;
