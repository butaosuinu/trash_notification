var app = require('app');
var Window = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
	mainWindow = new Window({width : 450, height : 250, 'node-integration': false});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	var Tray = require('tray');
	var Menu = require('menu');
	var appIcon = new Tray(__dirname + '/image/trash_icon.png');
	var contextMenu = Menu.buildFromTemplate([
		{label: '表示', type: 'radio'},
		{label: '設定'},
		{type: 'separator'},
		{label: '終了', accelerator: 'Command+Q', click: function() { app.quit(); }}
	]);
	appIcon.setContextMenu(contextMenu);
});
