import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = [
	"src/routes",
	"src/lib/components"
];

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
	/** @type {string[]} */
	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walk(full));
			continue;
		}
		if (full.endsWith(".svelte") || full.endsWith(".js")) {
			files.push(full);
		}
	}
	return files;
}

const offenders = [];

for (const relRoot of scanRoots) {
	const absRoot = path.join(root, relRoot);
	if (!fs.existsSync(absRoot)) continue;

	for (const file of walk(absRoot)) {
		if (file.includes(path.join("src", "lib", "components", "ui"))) continue;
		const content = fs.readFileSync(file, "utf8");
		const lines = content.split("\n");
		lines.forEach((line, idx) => {
			const hasLeafImport = /ui\/[^"'`]+\.svelte['"]/.test(line);
			const hasIndexImport = /ui\/[^"'`]+\/index\.js['"]/.test(line);
			if (hasLeafImport || hasIndexImport) {
				offenders.push(`${path.relative(root, file)}:${idx + 1}: ${line.trim()}`);
			}
		});
	}
}

if (offenders.length > 0) {
	console.error("Found deep UI imports outside src/lib/components/ui:");
	for (const offender of offenders) {
		console.error(`- ${offender}`);
	}
	process.exit(1);
}

console.log("UI import contract check passed.");
