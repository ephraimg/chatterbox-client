// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader('X-Parse-Application-Id', 'PARSE_APP_ID');
  jqXHR.setRequestHeader('X-Parse-REST-API-Key', 'PARSE_API_KEY');
});

// Server: http://parse.sfs.hackreactor.com/
// App ID: 42c3ed7c94fed042291633945f78fc083d80d18a
// API Key: 890ad4e875072efc3ea94f238b1f19d96047e3e6

// Messages endpoint:
// /chatterbox/classes/messages