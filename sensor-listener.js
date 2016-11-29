
var SensorTag = require('sensortag');
var mathjs = require('mathjs');

var log = function(text) {
  if(text) {
    console.log(text);
  }
}



//==============================================================================
// Step 1: Connect to sensortag device.
//------------------------------------------------------------------------------
var ADDRESS = "b0:b4:48:c9:09:85";
var connected = new Promise((resolve, reject) => SensorTag.discoverByAddress(ADDRESS, (tag) => resolve(tag)))
  .then((tag) => new Promise((resolve, reject) => tag.connectAndSetup(() => resolve(tag))));

//==============================================================================
// Step 2: Enable the sensors you need.
//------------------------------------------------------------------------------
var sensor = connected.then(function(tag) {
  log("connected");

  tag.enableAccelerometer(log);
  tag.notifyAccelerometer(log);

  tag.enableGyroscope(log);
  tag.notifyGyroscope(log);

  return tag;
});

//==============================================================================
// Step 3: Register listeners on the sensor.
//------------------------------------------------------------------------------

sensor.then(function(tag) {
  tag.on("accelerometerChange", function(x, y,z) {
  	console.log("Acc data: (x, y, z) = (" + x + ", " + y + ", " + z + " )"  + "Time: "+ Date.now());
    writeToFile(x + ","  + y + "," + z);

  })
});


sensor.then(function(tag) {
  tag.on("gyroscopeChange", function(x, y,z) {
  	console.log("Gyro  data: (x, y, z) = (" + x + ", " + y + ", " + z + " )" );
    writeToFile("," + x + "," + y + "," + z + "\n");

  })
});

//==============================================================================
// Step 4 (optional): Configure periods for sensor reads.
//------------------------------------------------------------------------------
sensor.then(function(tag) {
	  tag.setAccelerometerPeriod(100, log);
	  tag.setGyroscopePeriod(100,log);
});




