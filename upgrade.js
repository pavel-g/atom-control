require('shelljs/global');
var Got = require('got');
var Lodash = require('lodash');
var Co = require('co');

var App = function() {
	this.init.apply( this, arguments );
};

App.prototype = {
	
	codes: {
		DONE: 0,
		HELP: 1
	},
	
	init: function(args) {
		this.args = args;
		var me = this;
		if ( !this.checkVersion() ) {
			this.printHelp();
		} else {
			Co(function*() {
				me.url = yield me.loadDebUrl();
				var currentVer = me.getCurrentVersion();
				if (me.selectedVersion && me.selectedVersion === currentVer) {
					console.log("Уже установлен atom версии " + me.selectedVersion);
					me.done();
				} else {
					me.download();
					me.install();
					me.rm();
					me.done();
				}
			});
		}
	},
	
	checkVersion: function() {
		return Boolean( typeof this.args.version === 'string' && this.args.version.length > 0 );
	},
	
	printHelp: function() {
		var output = this.helpMsg.join("\n");
		console.log(output);
		process.exit( this.codes.HELP );
	},
	
	loadDebUrl: function() {
		var me = this;
		var ver;
		if (me.args.version === 'latest') {
			ver = 'latest';
		} else {
			ver = 'tags/v' + me.args.version;
		}
		return Got('https://api.github.com/repos/atom/atom/releases/' + ver).then((resp) => {
			var data = JSON.parse(resp.body);
			var deb = Lodash.find(data.assets, {name: 'atom-amd64.deb'});
			me.selectedVersion = data.name;
			return deb.browser_download_url;
		});
	},
	
	getCurrentVersion: function() {
		var me = this;
		var version;
		var versions = exec('atom --version', {silent:true}).stdout;
		try {
			version = (versions.split("\n")[0]).split(':')[1].trim();
		} catch (ex) {
			return null;
		}
		return version;
	},
	
	getDebUrl: function() {
		return this.url || 'https://github.com/atom/atom/releases/download/v' + this.args.version + '/atom-amd64.deb';
	},
	
	getDebTmp: function() {
		return 'atom-amd64.deb';
	},
	
	download: function() {
		var url = this.getDebUrl();
		var tmp = this.getDebTmp();
		console.log( 'Download ' + url + ' to ' + tmp + ' ...' );
		exec( 'wget ' + url + ' -O ' + this.getDebTmp(), { silent: true } );
		return this;
	},
	
	install: function() {
		var deb = this.getDebTmp();
		console.log( 'Installation ' + deb + ' ...' );
		exec( 'sudo dpkg -i ' + deb );
		return this;
	},
	
	rm: function() {
		var deb = this.getDebTmp();
		console.log( 'Remove temp file: ' + deb );
		rm(deb);
		return this;
	},
	
	done: function() {
		process.exit( this.codes.DONE );
	},
	
};

module.exports = App;
