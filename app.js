// https://github.com/form-data/form-data
var FormData = require('form-data');
var request = require('request');
var fs = require('fs');

(function sendImage(){

  function onRequestSucceed(data){
    console.log("Sent: ", data);
    setTimeout(sendImage, 1000);
  }

  var response = function (err, res) {
    if (err) return console.error(err);

    var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    });
    res.on('end', function() {
      onRequestSucceed(body);
    });
  };

  var form = new FormData();
  if (fs.existsSync('test.jpg')) {
    form.append('info', 'It works!');
    form.append('image', fs.createReadStream('./test.jpg'));
    form.submit('http://localhost:3000', response);
  }
})();

require('http').createServer().listen(3001);
