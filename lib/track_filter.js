var AppleScriptInterface = require("./applescript_interface.js");

var TrackFilter = {
  filterType: "gesture",

  filterParameters: {
    type: "swipe",
    state: "stop",
    // set a higher window so that we don't pick up the hand going back to rest
    // as reverting a volume change
    duplicateWindow: 1000
  },

  filter: function(gesture) {
    var dominantMovement = gesture.dominantMovement();
    if (dominantMovement.direction == "x") {
      var songDirection = dominantMovement.distance < 0 ? "previous" : "next";
      AppleScriptInterface.exec('tell application "iTunes" to ' + songDirection + ' track');
    }
  }
}

module.exports = TrackFilter;
