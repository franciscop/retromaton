// Node included modules
var fs = require('fs');
var exec = require('child_process').exec;

// NPM modules
var defaults = require('defaults');
var uid = require('node-uuid');
var FormData = require('form-data');

// Actually perform the work
module.exports = function(options, callback){

  // Allow for single argument if we don't care about the others
  if (typeof options === 'string')
    options = { url: options };

  if (!options.url) {
    return callback(new Error("You need to specify an url to send the image"));
  }

  // Default arguments
  options = defaults(options, {
    width: 640,
    height: 480,
    folder: 'images',
    timeout: 2000,
    name: new Date().getTime() + '_' + uid.v4(),
    form: 'image',
    data: {},
    debug: false
  });

  // Derivated options that cannot be changed
  options.base = __dirname + '/' + options.folder + '/';
  options.file = options.base + options.name + '.jpg';
  options.temp = options.base + options.name + '.jpeg';

  // Start here
  takeimage(options, callback);
};

// Take a local image
function takeimage(opt, callback) {

  // Make sure that the folder exists
  if (!fs.existsSync(opt.base)){
    fs.mkdirSync(opt.base);
  }

  // Execute the command to take an image of the specified size and name
  var size = '-s' + opt.width + 'x' + opt.height;
  child = exec("streamer " + size + " -f jpeg -o " + opt.temp, execCommand);

  // When the previous command to take a picture is executed
  function execCommand (err){
    if (err) return callback(err);

    // Change name to .jpg
    fs.rename(opt.temp, opt.file, renamed);
  }

  // When we change the name of the file
  function renamed(err, file){
    if (err) return callback(err);

    // Send the form to the remote api
    var form = new FormData();
    form.append(opt.form, fs.createReadStream(opt.file));
    // Add any extra data that we have
    for(var name in opt.data){
      form.append(name, opt.data[name]);
    }
    form.submit(opt.url, response);
  }

  function response(err, res) {
    if (err) return callback(err);

    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('error', function(error) {
      err = error;
    });
    res.on('end', function(){
      if (err) return callback(err);

      // Finally!!
      callback(false, res, body);
      fs.unlink(opt.file);
    });
  }
}
