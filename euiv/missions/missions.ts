import * as fs from "fs";
import klaw from "klaw";

const modDir = `C://Games/Libraries/Steam/steamapps/workshop/content/236850/`;

const result: Array<{size: number; filename: string; modname: string; gameversion: string}> = [];

const filepath = "euiv/missions/result.csv";

if (fs.existsSync(filepath)) {
	fs.unlinkSync(filepath);
}

fs.appendFileSync(filepath, "modname,gameversion,filename,size\n");

(async () => {
	for await (const f of klaw(modDir)) {
		const file = f as {path: string; stats: fs.Stats};
		if (!file.path.includes("\\missions\\") || file.path.includes("\\gfx\\")) {
			continue;
		}

		let descriptor: string;
		let modname = "";
		let gameversion = "";
		const modFilePathMatch = file.path.match(/C:\\Games\\Libraries\\Steam\\steamapps\\workshop\\content\\236850\\\d+/);
		if (modFilePathMatch) {
			descriptor = fs.readFileSync(modFilePathMatch[0].concat("\\descriptor.mod")).toString();
			const versionMatch = descriptor.match(/supported_version="(.+)"/);
			if (versionMatch) {
				gameversion = versionMatch[1];
				if (!gameversion.startsWith("1.31")) {
					continue;
				}
			} else {
				console.error("Modname not found", file.path);
			}
			const modNameMatch = descriptor.match(/name="(.+)"/);
			if (modNameMatch) {
				modname = modNameMatch[1];
			} else {
				console.error("Modname not found", file.path);
			}
		} else {
			console.error("Mod files outside mod folder", file.path);
		}
		result.push({size: file.stats.size, filename: file.path.split("\\").reverse()[0], modname, gameversion});
	}
	result.sort((s1, s2) => {
		return s1.size > s2.size ? -1 : 1;
	});

	result.forEach((e) => {
		fs.appendFileSync(filepath, `"${e.modname}","${e.gameversion}","${e.filename}","${e.size}"\n`);
	});
})();
