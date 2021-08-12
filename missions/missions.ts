import * as fs from "fs";
import klaw from "klaw";

const modDir = `C://Games/Libraries/Steam/steamapps/workshop/content/236850/`;

const result: Array<{size: number; filename: string; modname: string}> = [];

if (fs.existsSync("missions/result.csv")) {
	fs.unlinkSync("missions/result.csv");
}

fs.appendFileSync("missions/result.csv", "modname,filename,size\n");

(async () => {
	for await (const f of klaw(modDir)) {
		const file = f as {path: string; stats: fs.Stats};
		if (!file.path.includes("\\missions\\") || file.path.includes("\\gfx\\")) {
			continue;
		}

		const modFilePath = file.path.match(/C:\\Games\\Libraries\\Steam\\steamapps\\workshop\\content\\236850\\\d+/)![0].concat("\\descriptor.mod");

		const modname = fs
			.readFileSync(modFilePath)
			.toString()
			.match(/name="(.+)"/)![1];
		result.push({size: file.stats.size, filename: file.path.split("\\").reverse()[0], modname});
	}
	result.sort((s1, s2) => {
		return s1.size > s2.size ? -1 : 1;
	});

	result.forEach((e) => {
		fs.appendFileSync("missions/result.csv", `"${e.modname}","${e.filename}","${e.size}"\n`);
	});
})();
