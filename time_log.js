 /**
 * Time Log
 * Adaptation of Support Timer module
 **/

var time;
var seconds = 0;
var minutes = 0;
var hours = 0;
var enabled = 0;
var delayed = 1;

/**
 * Start the timer when the script is loaded.
 */

timer();

/**
 * Throw warning if user navigates away from page without saving timer
 * information
 */
$(document).ready(function() {
  if (Drupal.settings.time_log.unload_warning) {
    $('#node-form').bind("change", function() { confirm_unload(true); });
    $("#edit-submit").click(function() { window.confirm_unload(false); });
    $("#edit-preview").click(function() { window.confirm_unload(false); });
  }
});

/**
 * Allow user to start or stop the timer.
 */
function pause_timer() {
  if (enabled) {
    enabled = 0;
    window.setTimeout(function() {
      delay();
    }, 1000);
    // replace "Pause" with "Start"
    $("#edit-pause")[0].value = "Start";
  }
  else {
    if (delayed) {
      enabled = 1;
      delayed = 0;
      timer();
      // replace "Start with "Pause"
      $("#edit-pause")[0].value = "Pause";
    }
  }
}

/**
 * Prevent multiple timers from starting at once.
 */
function delay() {
  delayed++;
}

/**
 * Reset all counters, starting the timer over at 00:00:00.
 */
function reset_timer() {
  seconds = Drupal.settings.time_log.start_hours;
  minutes = Drupal.settings.time_log.start_mins;
  hours = Drupal.settings.time_log.start_hours;
  
  $(document).ready(function() {
    $("#edit-elapsed").val(Drupal.settings.time_log.start);
  });
  //display_time();
}

/**
 * Update the edit-elapsed textfield with the current elapsed time.
 */
function display_time() {
  if (hours < 10) {
    time = '0'+hours;
  }
  else {
    time = hours;
  }
  if (minutes < 10) {
    time += ':0'+minutes;
  }
  else {
    time += ':'+minutes;
  }
  if (seconds < 10) {
    time += ':0'+seconds;
  }
  else {
    time += ':'+seconds;
  }
  $(document).ready(function() {
    $("#edit-elapsed").val(time);
  });
}

/**
 * Get time from Time spent (elapsed) field.
 */
function get_time() {
/*  if ((Drupal.settings.time_log != undefined) &&
      (Drupal.settings.time_log.elapsed != undefined)) {
    // reloaded after a preview, use passed in value
    gettime = Drupal.settings.time_log.elapsed;
    Drupal.settings.time_log.elapsed = undefined;
  }
  else { */
    gettime = $("#edit-elapsed").val();
//  }
  if (gettime != undefined) {
    pieces = gettime.split(':');
    hours = parseInt(pieces[0], 10);
    minutes = parseInt(pieces[1], 10);
    seconds = parseInt(pieces[2], 10);
  }
}

/**
 * Count seconds.
 */
function timer() {
  if (!enabled) {
    return false;
  }
  get_time();
  seconds += 1;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }
  display_time();
  window.setTimeout(function() {
    timer();
  }, 1000);
}

/**
 * Determine whether or not we should display a message when a user navigates
 * away from the current page.
 */
function confirm_unload(on) {
  window.onbeforeunload = (on) ? unload_message : null;
}

/**
 * The message we display when a user navigates away from a changed ticket
 * without saving his/her changes.
 */
function unload_message() {
  return Drupal.t('Any timer information you have entered for this time log will be lost if you navigate away from this page without pressing the Save button.');
}
