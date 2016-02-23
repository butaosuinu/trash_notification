var $ = require('jquery');
var moment = require('./node_modules/moment/min/moment-with-locales.js');

trashCollection();

function trashCollection() {
	var today = new Date();
	moment.locale('ja');
	var m = moment();

	var interval = setInterval(function() {
		var m = moment();
		$('#today').html(m.format('YYYY年MM月DD日 HH:mm:ss dddd'));
	},1000);

	$('#today-day').html("今日は" + m.format('dddd') + "ですよー！！");
	todayTrash(m);
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
	var trashIcon;
	switch (trash) {
		case "燃えるゴミ" :
			trashIcon = "image/burn.png";
			break;
		case "資源ゴミ":
			trashIcon = "image/re.png";
			break;
		case "ペットボトル":
			trashIcon = "image/pet.png";
			break;
		default:
			break;
	}

	if (trash === "") {
		$('#today-trash').html("今日のゴミ回収はありません");
	} else {
		$('#trash-icon').html('<img src="' + trashIcon + '"/>');
		$('#today-trash').html(trash);
	}
}