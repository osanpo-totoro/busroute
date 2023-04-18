let day_of_week = 0;	// 0:平日、1:土曜、2:休日
let current_index1 = -1;
let current_index2 = -1;
let list1 = [];
let list2 = [];

window.onload = () => {
	initDayOfWeek();

	initialize();
};

function initDayOfWeek() {
	let now = new Date();
	let day = now.getDay();
	if (day === 0) {
		day_of_week = 2;
	}
	else if (day === 6) {
		day_of_week = 1;
	}
	else {
		day_of_week = 0;
	}
	document.forms.formDay.day.value = day_of_week;
}

function initialize() {
	list1 = loadList1();
	list2 = loadList2();

	list1.sort((a, b) => a.time1 - b.time1);
	list2.sort((a, b) => a.time1 - b.time1);

	current_index1 = searchNextList1(new Date());
	refreshSector1();
	if (current_index1 != -1) {
		current_index2 = searchNextList2(getCurrentItem1().time2);
	}
	refreshSector2();
	refreshWaitTime();
}

function handleDayRadioChanged(e) {
	day_of_week = parseInt(e.target.value);
	initialize();
}

function searchNextList1(time) {
	for (let i = 0; i < list1.length; i++) {
		if (time < list1[i].time1) {
			return i;
		}
	}
	return -1;
}

function searchNextList2(time) {
	for (let i = 0; i < list2.length; i++) {
		if (time < list2[i].time1) {
			return i;
		}
	}
	return -1;
}

function refreshSector1() {
	let route = document.getElementById('sector1_route');
	let time1 = document.getElementById('sector1_time1');
	let time2 = document.getElementById('sector1_time2');
	let item = getCurrentItem1();
	if (item != null) {
		route.innerHTML = item.type + '（' + item.route + '）';
		time1.innerHTML = getTimeString(item.time1) + ' 発 （' + item.bs1 + '）';
		time2.innerHTML = getTimeString(item.time2) + ' 着 （' + item.bs2 + '）';
	}
	else {
		route.innerHTML = '';
		time1.innerHTML = '';
		time2.innerHTML = '';
	}
}

function refreshSector2() {
	let route = document.getElementById('sector2_route');
	let time1 = document.getElementById('sector2_time1');
	let time2 = document.getElementById('sector2_time2');
	let item = getCurrentItem2();
	if (item != null) {
		route.innerHTML = item.type + '（' + item.route + '）';
		time1.innerHTML = getTimeString(item.time1) + ' 発 （' + item.bs1 + '）';
		time2.innerHTML = getTimeString(item.time2) + ' 着 （' + item.bs2 + '）';
	}
	else {
		route.innerHTML = '';
		time1.innerHTML = '';
		time2.innerHTML = '';
	}
}

function refreshWaitTime() {
	let elmWaitTable = document.getElementById('wait_time_table');
	let elmWait = document.getElementById('wait_time');

	let item1 = getCurrentItem1();
	let item2 = getCurrentItem2();
	if (item1 != null && item2 != null) {
		let waitMillisecounds = item2.time1 - item1.time2;
		elmWait.innerHTML = '乗り継ぎ時間：' + millisecondsToTimeString(waitMillisecounds);

		elmWaitTable.style.backgroundColor = '';
		elmWaitTable.style.color = '';

		if (waitMillisecounds < 0) {
			elmWaitTable.style.backgroundColor = 'crimson';
			elmWaitTable.style.color = 'white';
		}
	}
	else {
		elmWait.innerHTML = '乗り継げません';
		elmWaitTable.style.backgroundColor = 'crimson';
		elmWaitTable.style.color = 'white';
	}
}

function movePrevList1() {
	if (current_index1 > 0) {
		current_index1--;
		refreshSector1();
		if (current_index1 != -1) {
			current_index2 = searchNextList2(list1[current_index1].time2);
			refreshSector2();
		}
		else {
			current_index2 = -1;
			refreshSector2();
		}
		refreshWaitTime();
	}
}

function moveNextList1() {
	if (current_index1 < list1.length - 1) {
		current_index1++;
		refreshSector1();
		current_index2 = searchNextList2(list1[current_index1].time2);
		refreshSector2();
		refreshWaitTime();
	}
}

function movePrevList2() {
	if (current_index2 >= 0) {
		current_index2--;
		refreshSector2();
		refreshWaitTime();
	}
}

function moveNextList2() {
	if (current_index2 < list2.length - 1) {
		current_index2++;
		refreshSector2();
		refreshWaitTime();
	}
}

function createDate(time) {
	let d = new Date()
	return new Date(`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ` + time);
}

function getTimeString(time) {
	let m = time.getMinutes().toString().padStart(2, '0');
	return `${time.getHours()}:${m}`;
}

function millisecondsToTimeString(time) {
	let minus = false;
	if (time < 0) {
		time = Math.abs(time);
		minus = true;
	}

	let hours = Math.floor(time / 3600000);
	let minutes = Math.floor((time % 3600000) / 60000);

	let str = '';
	if (hours > 0) {
		str = hours + '時間 ';
	}
	str += minutes + '分';

	if (minus) {
		str = '- ' + str;
	}

	return str;
}

function getCurrentItem1() {
	if (current_index1 === -1 || current_index1 >= list1.length) {
		return null;
	}
	else {
		return list1[current_index1];
	}
}

function getCurrentItem2() {
	if (current_index2 === -1 || current_index2 >= list2.length) {
		return null;
	}
	else {
		return list2[current_index2];
	}
}

function loadList1() {
	if (day_of_week === 1) {
		return loadList1Saturday();
	}
	else if (day_of_week === 2) {
		return loadList1Sunday();
	}
	else {
		return loadList1Weekday();
	}
}

function loadList2() {
	if (day_of_week === 1) {
		return loadList2Saturday();
	}
	else if (day_of_week === 2) {
		return loadList2Sunday();
	}
	else {
		return loadList2Weekday();
	}
}

/* ダブルタップによる拡大を禁止 */
var ttt = 0;
document.documentElement.addEventListener('touchend', function (e) {
var now = new Date().getTime();
if ((now - ttt) < 350) {
  e.preventDefault();
}
  ttt = now;
}, false);

