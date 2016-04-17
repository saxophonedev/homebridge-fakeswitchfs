# Simulated switch plugin for Homebridge
## Turn on or off a simulated switch
### Created for testing homebridge

###### Installing

To install the plugin, head over to the machine with Homebridge set up and run
```
sudo npm install -g homebridge-sonytvpower
```

###### Configuration

To make Homebridge aware of the new plugin, you will have to add it to your configuration usually found in `.homebridge/config.json`. Somewhere inside that file you should see a key named `accessories`. You can just add this:

```
"accessories": [
    {
      "accessory": "FakeSwitch",
      "name": "Test Switch"
    } 
]
```

Accessory should **always** be FakeSwitch.
You can change the name whatever you want.
**YOU NEED TO MAKE A .TXT FILE CALLED thenameyouentered_conf.txt WITH THE NUMBER 0 IN IT IN YOUR USER'S .homebridge/persist FOLDER!!!!!!!!!!!**
*NOTE: The "state file" will be stored in the .homebridge/ folder. The filename is "name_conf.txt".*

###### What it does?
**WARNING: The text below containes description to beginners who want to write plugins for Homebridge. Professional programmers, GO AWAY!**
<br>
I import the fs(filesystem) package to write/read files:
```
var fs = require("fs");
```

I create variables for homebridge stuff:
```
var Service, Characteristic, HomebridgeAPI;
```

A function here for homebridge:
```
module.exports = function(homebridge){
```

Setting the Service variable to the HAP Service "module".<br>
Service tells the program I want a switch, or a lightbulb, or a door opener, etc.
```
    Service = homebridge.hap.Service;
```

Setting the Characteristic variable:<br>
Characteristic tells the Service what is the proper function to call if the user presses a button.
```
    Characteristic = homebridge.hap.Characteristic;
```

Setting the HomebridgeAPI variable:<br>
This is **REALLY** important. With this, we can tell Homebridge what accessory's plugin we are(more on that later).
```
    HomebridgeAPI = homebridge;
```

Registering our plugin into Homebridge:<br>
1st argument: Module original name ("homebridge-xy")<br>
2nd argument: Module name ("xy")<br>
3rd argument: Module function name ("Xy")
```
    HomebridgeAPI.registerAccessory("homebridge-fakeswitch", "FakeSwitch", FakeSwitch);
```

Close this function:
```
}
```

Create our Module function. The name should be the name you entered into registerAccessory.
```
function FakeSwitch(log, config){
```

Creating our own logger function that Homebridge gave to us.
```
    this.log = log;
```

Getting the "name" entry from the config file:
```
    this.name = config.name;
```

Defining our file path for fs:
```
    this.filePath = HomebridgeAPI.user.persistPath() + "/" + this.name + "_conf.txt";
```

Defining what service is our device use:<br>
In this case, it's a switch.
```
    this._service = new Service.Switch(this.name);
```

"Telling" our functions via Characteristic:<br>
Get is for getting the state of the device.<br>
Set is for setting the state of the device.
```
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._get.bind(this))
        .on('set', this._set.bind(this));
```

Close this function:
```
}
```

Create a getServices function in our prototype for Homebridge to(guess for what) get our services:
```
FakeSwitch.prototype.getServices = function(){
```

Return the _service variable from our module:
```
    return [this._service];
```

Close this function:
```
}
```

Create a _set function in our prototype:<br>
We said go to here when setting device states to Homebridge earlier.
```
FakeSwitch.prototype._set = function (state, callback){
```

We are going to write a file:<br>
Path: this.filePath(we defined this earlier)<br>
Content: state(this is a variable we get from Homebridge when it calls this function)+''(this is used for converting int to string)<br>
Encoding: UTF-8(I don't know why)<br>
Callback: Our function which throws an error if it exists, or executes the callback function
```
    fs.writeFile(this.filePath, state + '', "utf8", function(err){ if (err) throw err; callback(null); });
```

Close this function:
```
}
```

Create a _get function in our prototype:<br>
We said go to here when getting device states to Homebridge earlier.
```
FakeSwitch.prototype._get = function(callback){
```

We are going to read a file:<br>
Path: this.filePath(we defined this earlier)<br>
Callback: Our function which throws an error if it exists, or executes the callback function 
```
    fs.readFile(this.filePath, function(err, data){ if (err) throw err; callback(null, parseInt(data) ); });
```

Close this function:
```
}
```
