var AppleScriptInterface = require("./applescript_interface.js");

var VolumeFilter = {
  filterType: "gesture",

  filterParameters: {
    type: "swipe",
    state: "stop",
    // disable duplicate checking
    duplicateWindow: 0
  },

  // over what range to cover the full volume range of iTunes (0-100)
  // 300mm is approximately 1 ft, so there's a two-foot range of motion from
  // where you start -- 100 units upward, 100 downward
  range: 300,

  filter: function(gesture) {
    var dominantMovement = gesture.dominantMovement();
    var volumeAmount;
    if (dominantMovement.direction == "y") {
      if (this.tracking) {
        // the callback is getting bound elsewhere: TODO: bind it here
        volumeAmount = VolumeFilter.calculateVolumeAmount(gesture);
        AppleScriptInterface.exec('tell application "iTunes" to set sound volume to (sound volume + ' + volumeAmount + ')');

        // stop the motion if appropriate
        if (gesture.state == "stop") {
          this.tracking = false;
        }
      }
      else {
        // if we haven't started a volume motion yet, kick it off,
        // and wait for the next motion to determine where to go
        // WIP: this doesn't do much now, but will be useful when we implement
        // slow swiping
        this.tracking = true;
      }
    }
  },

  calculateVolumeAmount: function(gesture) {
    // WIP: I want to have smooth volume controls, but swiping is too fast
    // smoothness is on hold until I implement SlowSwipe recognition
    //
    // // we can tell iTunes to go up or down more than 100 without ill effect
    // // should movement over the range cause the start point to slide, so that
    // // if you move your hand up 1.5 feet and that's too loud, downward movement
    // // immediately reduces the volume?
    // console.log(gesture.position[1] - gesture.startPosition[1])
    // var newVolumePercentage = (gesture.position[1] - gesture.startPosition[1]) / this.range;
    // return newVolumePercentage * 100;
    return gesture.dominantMovement().distance / 15;
  }
}

module.exports = VolumeFilter;
