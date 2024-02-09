import * as sqlite3 from "sqlite3";
import * as fs from "fs-extra";

const sql = sqlite3.verbose();

const db = new sql.Database("C:\\Users\\Felix\\Documents\\Paradox Interactive\\Europa Universalis IV\\launcher-v2.sqlite");

fs.remove("./euiv/playset/root/")
	.then(() => {
		db.all(
			"SELECT dirPath, steamId from mods WHERE id IN (SELECT modId FROM playsets_mods WHERE playsetId IN (SELECT id FROM playsets WHERE isActive = 1));",
			(_err, result) => {
				result.forEach((line) => {
					console.log(line);

					fs.copy(line.dirPath, `./euiv/playset/root/${line.steamId}`);
				});

				db.close();
			}
		);
	})
	.catch()
	.finally();

db.on("trace", (...info) => {
	console.log(info);
});
