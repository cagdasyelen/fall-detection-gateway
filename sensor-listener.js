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
var mathjs = require('mathjs');

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


var rawArr = []
var temp = []


sensor.then(function(tag) {
  tag.on("accelerometerChange", function(x, y,z) {
  	//console.log("Acc data: (x, y, z) = (" + x + ", " + y + ", " + z + " )"  + "Time: "+ Date.now());
    //writeToFile(x + ","  + y + "," + z);
    console.log(rawArr.length + "\n"); 
    if(rawArr.length > 29){
    	rawArr.shift();
    }
    temp.push(x);
    temp.push(y);
    temp.push(z);
  })
});


sensor.then(function(tag) {
  tag.on("gyroscopeChange", function(x, y,z) {
  	//console.log("Gyro  data: (x, y, z) = (" + x + ", " + y + ", " + z + " )" );
    //writeToFile("," + x + "," + y + "," + z + "\n");
    temp.push(x);
    temp.push(y);
    temp.push(z);
    
    temp = [];
    rawArr.push(temp);

    data = mathjs.matrix(rawArr);
    console.log(data.size());

  })
});

//==============================================================================
// Step 4 (optional): Configure periods for sensor reads.
//------------------------------------------------------------------------------
// The registered listeners will be invoked with the specified interval.
//

sensor.then(function(tag) {
	  tag.setAccelerometerPeriod(100, log);
	  tag.setGyroscopePeriod(100,log);
});

writeToFile = function(line){
  var fs = require('fs');
  fs.appendFile("/tmp/data.csv", line, function(err){
    if(err){
      return console.log(err);
    }
  });

}

classifier = function(data){
  if(ed['aP2P'] <= 0.941){
    return 0;
  }
  else{
    if(ed['aAvg'] <= 1.2813){
      if(ed['gAvg'] <=95.5936){
        return 1;
      }
      else{
        if(ed['aAvg'] <= 1.2155){
          if(ed['aStd'] <= 0.6642){
            if(ed['aAvg'] <= 0.7339){
              return 2;
            }
            else{
              if(ed['aMin'] <= 0.1213){
                return 1;
              }
              else{
                return 2;
              }
          }
          else{
            if(ed['gMax'] <= 367.7342){
              return 1;
            }
            else{
              return 2;
            }
          }
        }
        else{
          return 1;
        }
      }
    }
    
    else{
      if(ed['aMin'] <= 0.0565){
        if(ed['gAvg'] <= 257.9375){
          if(ed['gMin'] <= 3.6016){
            return 2;
          }
          else{
            return 1;
          }
        }
        else{
          if(ed['gStd'] <= 133.4024){
            return 2;
          }
          else{
            return 3;
          }
        }
      }
      else{
        if(ed['aMin'] <= 0.1215){
          if(ed['gAvg'] <= 187.825){
            return 2;
          }
          else{
            return 3;
          }
        }
        else{
          return 3;
        }
      }
    }

  }
}




