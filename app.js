var leap = require('leapjs');
var appleScript = require("applescript");

var lastStart = new Date();

leap.loop({enableGestures: true}, function(frame) {
  if (frame.gestures.length > 0) {
    // look for swipe gesture
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
      if (gesture.type == "swipe") {
        // look for stopping gestures
        if (gesture.state == "stop") {
          // not sure why, but for some reason the sensor sometimes fires
          // repeated "swipe stop" events.
          // we want to ignore anything that happens less than 400ms since the
          // prior swipe, since that's presumably not a real swipe event.
          if (new Date() - lastStart < 400) {
            continue;
          }
          else {
            lastStart = new Date();
          }

          // calculate the details of the movement
          var movements = [
            {direction: "x", distance: gesture.position[0] - gesture.startPosition[0]},
            {direction: "y", distance: gesture.position[1] - gesture.startPosition[1]},
            {direction: "z", distance: gesture.position[2] - gesture.startPosition[2]}
          ];

          var dominantMovement = movements.sort(function(a, b) {
            return Math.abs(a.distance) > Math.abs(b.distance) ? -1 : 1
          })[0];

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
            appleScript.execString(command, function(err) {
              if (err) { console.log("Error! %o", err) }
            });
          }
        }
      }
    }
  }
})
