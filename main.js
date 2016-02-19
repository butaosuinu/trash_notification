var app = require('app');
var Window = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new Window({width : 450, height : 250, 'node-integration': false});
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});
