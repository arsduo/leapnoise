var Leap = require('leapjs');
var AppleScript = require("applescript");
var BlueGel = require("bluegel");

var filter = new BlueGel.Filter();
filter.on("gesture", {
    type: "swipe",
    state: "stop",
    // set a higher window so that we don't pick up the hand going back to rest
    // as reverting a volume change
    duplicateWindow: 1000
  }, function(analyzedGesture) {
  var dominantMovement = analyzedGesture.dominantMovement();
  var command;
  switch(dominantMovement.direction) {
  case "x":
      var songDirection = dominantMovement.distance < 0 ? "previous" : "next";
      command = 'tell application "iTunes" to ' + songDirection + ' track';
      break;
  case "y":
      var volumeAmount = dominantMovement.distance / 15;
      command = 'tell application "iTunes" to set sound volume to (sound volume + ' + volumeAmount + ')';
      break;
    case "z":
      // we only want this in one direction or you'll switch it when you
      // bring your arm back to neutral
      if (dominantMovement.distance < 0) {
        command = 'tell application "iTunes" to playpause';
      }
      break;
    default:
      // short gestures seem to cause problems?
      // to investigate!
      console.log("WTF?!");
  }

  if (command) {
    console.log(command);
    AppleScript.execString(command, function(err) {
      if (err) { console.log("Error! %o", err) }
    });
  }
})

// need to bind the function properly to avoid needing the extra closure
filter.drinkFromFirehose(new Leap.Controller({enableGestures: true}));
