var AWS = require('aws-sdk'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    _ = require('underscore'),
    fs = require('fs');

var awsConfig = require('./config.json');

// console.dir(awsConfig.aws);
// console.dir(awsConfig.s3);

AWS.config.update(awsConfig.aws); // the configuration in config.json File
var return_image_path = "https://s3-us-west-2.amazonaws.com/myimagebucket/"; // change this as this url will be send to your mobile device stating that the image is uploaded at this URL

http.createServer(function(request,response){
var s3 = new AWS.S3();
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  // console.log("hot server"+JSON.stringify(query)); 
  // data : ----------------> "type":"mytype","imagename":"7208079951_201652417469.jpg"
    var tempFile = fs.createWriteStream(__dirname+"/"+query.imagename);
    request.pipe(tempFile);

    var fileSize = request.headers['content-length'];
    var uploadedBytes = 0 ;

    request.on('data',function(d){
      uploadedBytes += d.length;
      var progress = (uploadedBytes/fileSize) * 100;
      console.log(progress); // displays the percentage as how much percentage image is uploaded //response.write(progress);
    });

    request.on('end',function(){
      var respdata = {
        "file":profile_path+"prescriptions/"+query.imagename,
        "imagename":query.imagename
      };
      params = _.clone(awsConfig.s3_config); // s3 bucket configuration
      console.log("resp > "+JSON.stringify(respdata));
      var body = fs.createReadStream(query.imagename);
      params.Key = query.imagename;
      params.Body = body;
      
      // params.Bucket = params.Bucket+"/my_folder";     
      // uncomment if your bucket has a folder and you want to upload in that folder instead of the bucket directly.

      s3.upload(params, function(err, data) {
        if(!err){
          // console.dir(data); -- shows whether the image is uploaded or not.
          fs.unlink(query.imagename, (err) => {
            if (err) throw err;
            console.log('successfully deleted tempFile'); // delete the file from localmachine after uploading image to s3 bucket
          });
        }else{
          console.dir(err); // shows the error
        }
      });

      response.writeHead(200, {"Content-Type": "application/json"});
      response.write(JSON.stringify(respdata));
      response.end();
    });
}).listen(awsConfig.port,function(){
  console.log("server started at %d",awsConfig.port);
});
