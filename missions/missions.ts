import * as fs from "fs";
import * as path from "path";

const modDir = `C://Games/Libraries/Steam/steamapps/workshop/content/236850/`;

var walk = function (dir: string, done: Function) {
	var results: Array<string> = [];
	fs.readdir(dir, function (err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach(function (file) {
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err: Error, res: Array<string>) {
						results = results.concat(res);
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					results.push(file);
					if (!--pending) {
						done(null, results);
					}
				}
			});
		});
	});
};

walk(modDir, function (err: Error, results: Array<string>) {
	if (err) {
		throw err;
	}
	results = results.filter(item => {
		return item.includes("\\missions\\") && !item.includes("\\gfx\\")
	})
	results.sort((a, b) => {
		const sizeA = fs.statSync(a).size
		const sizeB = fs.statSync(b).size
		return sizeA < sizeB ? 1 : -1
	})
	console.log(results);
});

export { };
