// https://github.com/form-data/form-data
var remotecamera = require('./remotecamera.js');

var options = {
  url: "http://maton.herokuapp.com/",
  width: 1280, height: 720,
  data: { secret: 'secretstringaaaaaaa' }
};

remotecamera(options, function(err, res, body){
  if (err) return console.log(err);
  if (res.statusCode !== 200) return console.log("Error: " + res.statusCode);
  console.log(body);
});

require('http').createServer().listen(3000);
