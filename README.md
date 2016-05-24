Image Upload to Amazon S3 Bucket from Mobile Devices Cross Platform.
- Using NodeJS



Titanium Image Upload Code

```
var imageuploadxhr = Titanium.Network.createHTTPClient();
var response;    

imageuploadxhr.onload = function(e) {
	//Ti.API.info(this.responseText);
	response=JSON.parse(this.responseText);
	url=response.file;  //image url returned from server
};
imageuploadxhr.onerror = function(e) {
	Ti.API.info("error > "+JSON.stringify(e));
};
imageuploadxhr.open("POST", "http://192.168.2.179:5600?type=type_of_imageToBeSent&imagename=" + fileName + ".jpg");
//Dipesh's IPAddress
imageuploadxhr.send(iImage); // iImage is image Object 
```


config.json has all configuration for s3 Bucket
and also the AWS Configuration


config also has the port on which your app must run.
