require('shelljs/global');
var _ = require('lodash');
var PackagesTxt = require('./packages-txt.js');

var AtomPackage = function(name) {
	this.init(name);
};

AtomPackage.prototype = {};

var p = AtomPackage.prototype;

p.prefixPackages = '~/.atom/packages';

p.prefixAtom = '~/.atom';

p.init = function(name) {
	var str, cfg;
	try {
		str = cat(this.prefixPackages + '/' + name + '/package.json');
		cfg = JSON.parse(str);
	} catch (ex) {
		console.error(ex.message);
		throw ex;
	}
	this.cfg = cfg;
	return this;
};

p.fromGithub = function() {
	var cfg = this.cfg;
	return Boolean(
		_.get(cfg, 'repository.type') === 'git' &&
		_.get(cfg, 'repository.url', '').match(/github\.com/)
	);
};

p.inPackagesTxt = function() {
	var packages = PackagesTxt.getList();
	var cfg = this.cfg;
	return Boolean(packages.indexOf(cfg.name) >= 0);
};

p.toPackagesTxtString = function() {
	return this.cfg.name + '@' + this.cfg.version;
};

p.uninstall = function() {
	exec('apm uninstall ' + this.cfg.name);
};

module.exports = AtomPackage;
