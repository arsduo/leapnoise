var Leap = require('leapjs');
var BlueGel = require("bluegel");

var filter = new BlueGel.Filter();

// import and set up our three filter types
var filterTypes = [
  require("./lib/playpause_filter.js"),
  require("./lib/volume_filter.js"),
  require("./lib/track_filter.js")
];

var action;
for (var i = 0; i < filterTypes.length; i++) {
  action = filterTypes[i];
  filter.on(action.filterType, action.filterParameters, action.filter)
}

// need to bind the function properly to avoid needing the extra closure
filter.drinkFromFirehose(new Leap.Controller({enableGestures: true}));
