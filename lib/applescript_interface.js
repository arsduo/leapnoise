var AppleScript = require("applescript");

var ApplescriptInterface = {
  exec: function(command) {
    if (command) {
      console.log(command);
      AppleScript.execString(command, function(err) {
        if (err) { console.log("Error! %o", err) }
      });
    }
  }
}

module.exports = ApplescriptInterface;
