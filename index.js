
/**
 * nfc-door dependencies
 */

var irc     = require('irc');
var nfc     = require('nfc').nfc;
var n       = new nfc();
var request = require('request');

/**
 * irc config
 */

var client = new irc.Client('irc.freenode.net', 'tmk_door', {
  userName: 'nfc-door',
  realName: 'nfc-door',
  channels: ['#crumpspace'],
});

/**
 * nfc settings
 */

var active = undefined;
var nfcid = new Buffer('00000000000000', 'hex'); //nfc id to allow
                        
/**
 * nfc uid event handler
 */

n.on('uid', function(uid) {
  if (active) {
    return;
  }

  active = true;

  if (uid.toString() == nfcid.toString()) {
    request.get('http://url/', 
      function optionalCallback (err, httpResponse, body) {
        if (err) {
          return console.error('request failed:', err);
        }
        console.log('request successful, opening door');
      }
    );
  } else {
    var msg = 'access denied for uid ' + uid.toString('hex');    
    console.log(msg);
    client.say('#ircchanel/name', msg);
  }

  // reset state after 2000ms
  setTimeout(function resetNfcActive() {
      active = false;
    }, 2000);
});

n.start();