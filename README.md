# expire

## Description
Checks to see whether a page has expired or not. Checks current timestamp on load and at a specified interval (default 1 second) against specified start and end times. Can use client's local time or pull from atomic clock.  Can use local timezone's for each client, or specified absolute timezone.

## Usage
1. Include jQuery
2. Include jquery.expire.js
3. Call `$.expire();` with `startTime`, `endTime`, and `expireAction`

## Options
**startTime**  
date  
required  
Date when you want the page to become active. If `timeStamp` is before `startTime`, `expireAction` will be called.

**endTime**  
date  
required  
Date when you want the page to expire. If `timeStamp` is on or after `endTime`, `expireAction` will be called.

**expireAction**  
function  
required  
This function is called when `timeStamp` is outside range of `startTime` and `endTime`. A common usage would be to redirect the page with `window.location`.

**updateInterval**
integer  
optional  
default: `1000`  
Interval, in milliseconds, the script will check whether the page is expired or not. The script will automatically check on page load, then every `updateInterval`.

**useAtomicTime**  
boolean  
optional  
default: `false`  
If true, the `timeStamp` will be updated via AJAX to the atomic time in the timezone specified with the `timeZone` option.

**timeZone**  
string  
optional  
default: `'local'`  
Can be any timezone listed on http://json-time.appspot.com/timezones.json.  If set to `'local'` (default), the timezone will be checked via AJAX based on the client's IP address geolocation information. Keep in mind that the page will expire for different clients depending on what timezone they are in. Setting an absolute timezone will expire the page for everyone at the same time globally.
    
## Known & Possible Bugs
- `checkExpiration()` doesn't seem to see the update when the time is updated to atomic time via AJAX; probably because `setInterval` is called before the async action is completed.
- Not all timezones pulled from IPInfoDB have been checked to proved whether they convert correctly with the `convertTZ()` function.
