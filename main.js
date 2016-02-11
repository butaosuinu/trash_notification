var app = require('app');
var Window = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new Window({width : 400, height : 220});
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});
