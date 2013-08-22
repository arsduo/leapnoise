var Leap = require('leapjs');
var BlueGel = require("bluegel");

var filter = new BlueGel(new Leap.Controller({enableGestures: true}));

// import and set up our three filter types
var filterTypes = [
  require("./lib/playpause_filter.js"),
  require("./lib/volume_filter.js"),
  require("./lib/track_filter.js")
];

// control is by default deactivated to avoid accidental changes
// to activate, hold your hand over the sensor for a second
// you then have a second to make gestures and adjust
// (activation timer resets after each gesture)
var active = false, deactivateTimer, activate = function() {
  active = true;
  clearTimeout(deactivateTimer);
  deactivateTimer = setTimeout(function() {
    console.log("Control deactivated.");
    active = false;
  }, 2000);
}

var action;
for (var i = 0; i < filterTypes.length; i++) {
  action = filterTypes[i];
  filter.on(action.filterType, action.filterParameters, function() {
    // if (active) {
      action.filter.apply(action, arguments);
      // extend the activation time
      activate();
    // }
  })
}

filter.on("hold", {state: "start", minDuration: 500}, function(gesture) {
  // the update event will be fired once the hold reaches the minimum duration
  console.log("Activating control!");
  activate();
})
