require('shelljs/global');
var _ = require('lodash');
var FS = require('fs');
var AtomPackage = require('./atom-package.js');
var PackagesTxt = require('./packages-txt.js');

module.exports = {
	
	path: '~/.atom',
	
	packagePrefix: '~/.atom/packages',
	
	getAllPkgInfo: function() {
		var list = ls(this.packagePrefix);
		var i, name;
		var res = {};
		for ( i = 0; i < list.length; i++ ) {
			name = list[i];
			res[name] = new AtomPackage(name);
		}
		return res;
	},
	
	save: function() {
		var packages = this.getAllPkgInfo();
		var output = '';
		var i, pkg;
		for ( i in packages ) { if ( packages.hasOwnProperty(i) ) {
			pkg = packages[i];
			if (pkg.fromGithub()) {
				if (output.length > 0) output += "\n";
				output += pkg.toPackagesTxtString();
			}
		} }
		// exec('apm list --installed --bare > ' + this.path + '/packages.txt');
		if (output.length > 0) {
			output += "\n";
			echo(output).to(this.path + '/packages.txt');
		}
	},
	
	install: function() {
		// exec('apm install --packages-file ' + this.path + '/packages.txt');
		var installedPackages = this.getAllPkgInfo();
		var requiredPackages = PackagesTxt.getList();
		var list = [];
		_.each(requiredPackages, (rpkg) => {
			if (typeof rpkg === 'string' && rpkg.length > 0 && !installedPackages.hasOwnProperty(rpkg)) {
				list.push(rpkg);
			}
		});
		if (list.length > 0) exec('apm install ' + list.join(' '));
	},
	
	cleanUp: function() {
		var all = this.getAllPkgInfo();
		var i, pkg;
		for ( i in all ) { if ( all.hasOwnProperty(i) ) {
			pkg = all[i];
			if (pkg.fromGithub() && !pkg.inPackagesTxt()) {
				pkg.uninstall()
			}
		} }
	}
	
};
