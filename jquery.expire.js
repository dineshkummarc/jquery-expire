(function ($) {
  jQuery.expire = function (options) {
    // Set defaults
    // Supported timeZones are 'local' or any on this page: http://json-time.appspot.com/timezones.json
    var defaults = {
      updateInterval: 1000
      , useAtomicTime: false
      , timeZone: 'local'
    }
    
    // Replace defaults with specified values if necessary
    var o = defaults
    if (options) { var o = $.extend(defaults, options); };
    
    // First, set timeStamp to local time
    var timeStamp = new Date();
    
    // Then, if useAtomicTime is true, grab timezone and atomic time
    if (o.useAtomicTime && o.timeZone == 'local') {
      // Grab timezone based on IP address
      $.getJSON('http://api.ipinfodb.com/v3/ip-city/?key=d2b115734b088bd78f20e4ff07c980853cfbc8fca723282d4ed5fdf17b104d31&format=json&callback=?', function(geoInfo) {
        var tz = convertTZ(geoInfo.timeZone);
        
        // Grab atomic time
        $.getJSON('http://json-time.appspot.com/time.json?tz='+ tz +'&callback=?', function (remoteTime) {
          // If returned time is valid, upgrade timestamp to atomic time
          if (isValidDate(remoteTime.datetime)) {
            timeStamp = new Date(remoteTime.datetime);
          }
        });
      });
    }
    
    // If timezone is explicitly set, grab atomic time for that timezone
    // POSSIBLE FEATURE: convert local time to timezone specified.
    if (o.timeZone != 'local') {
      
      // Even if useAtomicTime is false, we need to grab time for set timezone
      // This would be unneeded if script could convert timezone itself.
      if (!o.useAtomicTime) {
        o.useAtomicTime = true;
        console.warn('Non-local timezone has been set, but useAtomicTime is false. Ignoring useAtomicTime.');
      }
      
      $.getJSON('http://json-time.appspot.com/time.json?tz='+ o.timeZone +'&callback=?', function (remoteTime) {
        // If returned time is valid, upgrade timestamp to atomic time
        if (isValidDate(remoteTime.datetime)) {
          timeStamp = new Date(remoteTime.datetime);
        }
      });
    }
    
    // Check expiration when script loads, then every second (or specified update interval)
    checkExpiration({ increment: false });
    setInterval(function () {checkExpiration({ increment: true });}, o.updateInterval);
    
    function checkExpiration (options) {
      // BUG: timeStamp may be updated with atomic time at any moment;
      // It seems that checkExpiration doesn't see the update, though.
      
      // If incrementing timestamp, add 1000 milliseconds (or specified update interval) to time
      if (options.increment) {
        timeStamp.setMilliseconds(timeStamp.getMilliseconds() + o.updateInterval);
      }
      
      // If timestamp is outside start and end times, call expire action
      if (isExpired(timeStamp, o.startTime, o.endTime)) {
        o.expireAction();
      } else {
        console.log('Checking... %j', timeStamp);
      }
    }
    
    // Return true if timestamp is outside start and end times
    function isExpired (timeStamp, startTime, endTime) {
      if (timeStamp < startTime || timeStamp >= endTime) {
        return true;
      }
      return false;
    }
    
    // Test whether a string can become a date or not
    function isValidDate (date) {
      var tryDate = new Date(date);
      if (tryDate.toString() == 'NaN' || tryDate.toString() == 'Invalid Date') {
        return false;
      }
      return true;
    }
    
    // Convert timezone from IPInfoDB format to json-time format
    function convertTZ (tz) {
      if (tz.substr(1, 1) = '0') {
        return buildTZ = 'Etc\/GMT' + 
             tz.substr(0, 1) +
             tz.substr(2, 1);
      } else {
        return buildTZ = 'Etc\/GMT' + 
             tz.substr(0, 1) +
             tz.substr(1, 1) +
             tz.substr(2, 1);
      }
    }
  };
})( jQuery );
