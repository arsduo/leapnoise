var Leap = require('leapjs');
var BlueGel = require("bluegel");

var filter = new BlueGel(new Leap.Controller({enableGestures: true}));

// import and set up our three filter types
var filterTypes = [
  require("./lib/playpause_filter.js"),
  require("./lib/volume_filter.js"),
  require("./lib/track_filter.js")
];

var activationFilter = require("./lib/activation_filter.js");

for (var i = 0; i < filterTypes.length; i++) {
  action = filterTypes[i];
  filter.on(action.filterType, action.filterParameters, activationFilter.filter(action.filter));
}

filter.on("hold", {state: "start", minDuration: 500}, function(gesture) {
  // the update event will be fired once the hold reaches the minimum duration
  console.log("Activating control!");
  activationFilter.activate();
})
