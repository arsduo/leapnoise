// control is by default deactivated to avoid accidental changes
// to activate, hold your hand over the sensor for a second
// you then have a second to make gestures and adjust
// (activation timer resets after each gesture)
var active = false, deactivateTimer;
var activate = function() {
  active = true;
  clearTimeout(deactivateTimer);
  deactivateTimer = setTimeout(deactivate, 2000);
}
var deactivate = function() {
  console.log("Control deactivated.");
  active = false;
}

var action;
var runIfActive = function(filteredAction) {
  return function() {
    if (active) {
      filteredAction.apply(filteredAction, arguments);
      // extend the activation time
      activate();
    }
  }
}

module.exports = {
  activate: activate,
  deactivate: deactivate,
  filter: runIfActive
}
