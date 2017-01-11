var args = require('shell-arguments');

// console.log(args);

var help = [
	'Аргументы:',
	'',
	'  --upgrade-to=0.0.1 - обновление текстового редактора',
	'  --save-pkg-list - сохранение списка плагинов',
	'  --install-pkg-list - установка списка плагинов',
	'  --clean-up - удаление пакетов не записанных в packages.txt'
].join("\n");

var Upgrade = require('./upgrade.js');
var PkgList = require('./pkg-list.js');

if (args['upgrade-to']) {
	new Upgrade({version: args['upgrade-to']});
} else if (args['save-pkg-list']) {
	PkgList.save();
} else if (args['install-pkg-list']) {
	PkgList.install();
} else if (args['clean-up']) {
	PkgList.cleanUp();
} else {
	console.log(help);
}
