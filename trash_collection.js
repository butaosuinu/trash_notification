var $ = require('jquery');
var moment = require('./node_modules/moment/min/moment-with-locales.js');

trashCollection();

function trashCollection() {
	moment.locale('ja');
	var m = moment();

	updateTime();
	setInterval(updateTime, 1000);

	$('#today-day').html("今日は" + m.format('dddd') + "ですよー！！");
	todayTrash(m);
}

function updateTime() {
	var m = moment();
	$('#today').html(m.format('YYYY年MM月DD日 HH:mm:ss dddd'));
}

// ゴミの日を外部から読み込み
function todayTrash(m) {
	var AA = m.day();
	$.getJSON("data/my_trash_collection.json", function(data){
		var trash = data[AA];
		renderTrashText(trash);
	});
}

function renderTrashText(trash) {
	if ("" === trash.name || undefined === trash.name) {
		$('#today-trash').html("今日のゴミ回収はありません");
	} else {
		$('#trash-icon').html('<img src="' + trash.icon + '"/>');
		$('#today-trash').html(trash.name);
	}
}