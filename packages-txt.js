require('shelljs/global');

var PackagesTxt = {
	
	getList: function() {
		if (this.content) {
			return this.content;
		}
		this.content = [];
		var content = cat('~/.atom/packages.txt').stdout.split("\n");
		var i, str;
		for ( i = 0; i < content.length; i++ ) {
			str = content[i];
			this.content.push(str.split('@')[0]);
		}
		return this.content;
	}
	
};

module.exports = PackagesTxt;
