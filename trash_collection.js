var $ = require('jquery');
var moment = require('moment');

trashCollection();

function trashCollection() {
	var today = new Date();
	var m = moment();


	var interval = setInterval(function() {
		var m = moment();
		$('#today').html(m.format('YYYY年MM月DD日 HH:mm:ss dddd'));
	},1000);

	$('#today-day').html("今日は" + m.format('dddd') + "ですよー！！");
	todayTrash(today);
}

function todayDay(today) {
	var AAStrJa = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
	var AA = today.getDay();

	var text = AAStrJa[AA];
	return text;
}

// ゴミの日を外部から読み込み
function todayTrash(today) {
	var AA = today.getDay();
	$.getJSON("data/my_trash_collection.json", function(data){
		var trash = data[AA];
		renderTrashText(trash);
	});
}

function renderTrashText(trash) {
	var trashIcon;
	switch (trash) {
		case "燃えるゴミ" :
			trashIcon = "burn.png";
			break;
		case "資源ゴミ":
			trashIcon = "re.png";
			break;
		case "ペットボトル":
			trashIcon = "pet.png";
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