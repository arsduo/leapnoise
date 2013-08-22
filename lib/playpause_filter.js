var AppleScriptInterface = require("./applescript_interface.js");

var PlayPauseFilter = {
  filterType: "swipe",

  filterParameters: {
    state: "stop",
    // set a higher window so that we don't pick up the hand going back to rest
    // as reverting a volume change
    duplicateWindow: 1000
  },

  filter: function(gesture) {
    var dominantMovement = gesture.dominantMovement;
    if (dominantMovement.direction == "z") {
      // we only want this in one direction or you'll switch it when you
      // bring your arm back to neutral
      // z is front-to-back, so < 0 == away from your body
      if (dominantMovement.distance < 0) {
        AppleScriptInterface.exec('tell application "iTunes" to playpause');
      }
    }
  }
}

module.exports = PlayPauseFilter;
