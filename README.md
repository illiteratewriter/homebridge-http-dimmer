# Homebridge-http-plugin

`homebridge-http-dimmer` is a Homebridge plugin with which you can configure HomeKit lightbulbs
which forward any requests to an http server. This can be used when you have an
automated equipment which can be controlled via http requests (You have a wifi
enable Arduino, which is triggered with http requests).

Example plugin configuration:
```
{
    "accessory":"HTTP-DIMMER",
    "name":"happy light",
    "onUrl": "http://10.0.0.9/dimmerOn",
    "offUrl": "http://10.0.0.9/dimmerOff",
    "statusUrl": "http://10.0.0.9/getDimmerState",
    "setBrightnessUrl": "http://10.0.0.9/setBrightness?brightness=",
    "getBrightnessUrl":"http://10.0.0.9/getBrightness"
}
```

### Configuration options

```
name 		: <string> name of the accessory. This is displayed on HomeKit
onUrl 		: <string> url to turn on the accessory
offUrl		: <string> url to turn off the accessory
statusUrl	: <string> returns the status of the accessory (return 1 as body if ON and 0 if OFF)
setBrightnessUrl : <string> url, to whose end brightness will be appended
getBrightnessURl : <string> url which will return the value of brightness in the body
```

I'm using this project along with `nodemcu`, so this is the response for `statusUrl` :  `server.send(200, "text/plain", "1");`. For brightness also, this will be similar.
