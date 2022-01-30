const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

module.exports = async () => {
	const pageDirectory = path.join(process.cwd(), "pages");
	const entries = await fsp.readdir(pageDirectory, { withFileTypes: true });

	const onlyDirs = entries.filter((de) => de.isDirectory()).map((de) => de.name);

	const paths = new Map();
	paths.set(
		"documentation",
		entries
			.filter((de) => de.isFile())
			.filter((de) => de.name.endsWith(".mdx"))
			.map((de) => de.name)
	);
	await Promise.all(
		onlyDirs.map(async (dirname) => {
			paths.set(dirname, await fsp.readdir(path.join(pageDirectory, dirname)));
		})
	);

	const names = {
		documentation: "Documentation",
		setup: "Setup",
		plugins: "Plugins",
	};

	let info = {};

	await asyncForEach(Array.from(paths.keys()), async (category) => {
		info[category] = {
			name: names[category] === undefined ? category : names[category],
			items: await Promise.all(
				paths.get(category).map(async (page) => {
					const filePath = path.join(pageDirectory, category === "documentation" ? "" : category, page);
					const content = (await fsp.readFile(filePath, "utf8")).split(/\r?\n/);
					const h1 = content.filter((line) => line.startsWith("# ")).map((line) => line.substr(2));
					const h2 = content.filter((line) => line.startsWith("## ")).map((line) => line.substr(3));
					const config = content
						.map((line) => line.match(/\[(\S+)]: (\S+)/))
						.filter((res) => res)
						.map((res) => res.slice(1, 3))
						.reduce((obj, pair) => {
							obj[pair[0]] = pair[1];
							return obj;
						}, {});
					return {
						name: page.slice(0, -4),
						title: config.title ? config.title : h1[0],
						sublinks: h2,
						priority: config.priority !== undefined ? parseInt(config.priority) : 0,
					};
				})
			),
		};
	});

	//console.log("ZZZ", info);
	//console.log("ZZZ", JSON.stringify(info));

	return {
		// cacheable: true,
		code: `module.exports = ${JSON.stringify(info)}`,
	};
};
