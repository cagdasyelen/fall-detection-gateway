/*
    SensorTag IR Temperature sensor example
    This example uses Sandeep Mistry's sensortag library for node.js to
    read data from a TI sensorTag.
    The sensortag library functions are all asynchronous and there is a
    sequence that must be followed to connect and enable sensors.
      Step 1: Connect
        1) discover the tag
        2) connect to and set up the tag
      Step 2: Activate sensors
        3) turn on the sensor you want to use (in this case, IR temp)
        4) turn on notifications for the sensor
      Step 3: Register listeners
        5) listen for changes from the sensortag
      Step 4 (optional): Configure sensor update interval
*/
var SensorTag = require('sensortag');

var log = function(text) {
  if(text) {
    console.log(text);
  }
}

//==============================================================================
// Step 1: Connect to sensortag device.
//------------------------------------------------------------------------------
// It's address is printed on the inside of the red sleeve
// (replace the one below).
var ADDRESS = "b0:b4:48:c9:09:85";
var connected = new Promise((resolve, reject) => SensorTag.discoverByAddress(ADDRESS, (tag) => resolve(tag)))
  .then((tag) => new Promise((resolve, reject) => tag.connectAndSetup(() => resolve(tag))));

//==============================================================================
// Step 2: Enable the sensors you need.
//------------------------------------------------------------------------------
// For a list of available sensors, and other functions,
// see https://github.com/sandeepmistry/node-sensortag.
// For each sensor enable it and activate notifications.
// Remember that the tag object must be returned to be able to call then on the
// sensor and register listeners.
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
// You can register multiple listeners per sensor.
//

sensor.then(function(tag) {
  tag.on("accelerometerChange", function(x, y,z) {
  	console.log("Acc data: (x, y, z) = (" + x + ", " + y + ", " + z + " )"  + "Time: "+ Date.now());
  })
});


sensor.then(function(tag) {
  tag.on("gyroscopeChange", function(x, y,z) {
  	console.log("Gyro  data: (x, y, z) = (" + x + ", " + y + ", " + z + " )" );
  })
});

//==============================================================================
// Step 4 (optional): Configure periods for sensor reads.
//------------------------------------------------------------------------------
// The registered listeners will be invoked with the specified interval.
//

sensor.then(function(tag) {
	  tag.setAccelerometerPeriod(50, log);
	  tag.setGyroscopePeriod(50,log);
});
