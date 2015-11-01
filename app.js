// https://github.com/form-data/form-data
var remotecamera = require('remotecamera');
var gpio = require('rpi-gpio');

var options = {
  url: "http://maton.herokuapp.com/",
  width: 1280, height: 720,
  data: { secret: 'secretstringaaaaaaa' }
};

//gpio.on('change', function(channel, value) {
setInterval(function(){
  remotecamera(options, function(err, res, body){
    if (err) return console.log(err);
    if (res.statusCode !== 200) return console.log("Error: " + res.statusCode);
    console.log(body);
  });
}, 2000);
//});

//gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

require('http').createServer().listen(3000);
