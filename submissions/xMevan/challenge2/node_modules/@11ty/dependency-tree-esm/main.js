const path = require("path");
const { existsSync } = require("fs");
const { readFile } = require("fs/promises");

const acorn = require("acorn");
const normalizePath = require("normalize-path");
const { TemplatePath } = require("@11ty/eleventy-utils");

// Is *not* a bare specifier (e.g. 'some-package')
// https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#terminology
function isNonBareSpecifier(importSource) {
	// Change \\ to / on Windows
	let normalized = normalizePath(importSource);
	// Relative specifier (e.g. './startup.js')
	if(normalized.startsWith("./") || normalized.startsWith("../")) {
		return true;
	}
	// Absolute specifier (e.g. 'file:///opt/nodejs/config.js')
	if(normalized.startsWith("file:")) {
		return true;
	}

	return false;
}

function normalizeFilePath(filePath) {
	return TemplatePath.standardizeFilePath(path.relative(".", filePath));
}

function normalizeImportSourceToFilePath(filePath, source) {
	let { dir } = path.parse(filePath);
	let normalized = path.join(dir, source);
	return normalizeFilePath(normalized);
}

async function findByContents(contents, filePath, alreadyParsedSet) {
	// Should we use dependency-graph for these relationships?
	let sources = new Set();

	let ast = acorn.parse(contents, {sourceType: "module", ecmaVersion: "latest"});
	for(let node of ast.body) {
		if(node.type === "ImportDeclaration" && isNonBareSpecifier(node.source.value)) {
			let normalized = normalizeImportSourceToFilePath(filePath, node.source.value);
			if(sources.has(normalized) || normalized === filePath) {
				continue;
			}

			sources.add(normalized);
		}
	}

	// Recurse for nested deps
	for(let source of sources) {
		let s = await find(source, alreadyParsedSet);
		for(let p of s) {
			if(sources.has(p) || p === filePath) {
				continue;
			}

			sources.add(p);
		}
	}

	return Array.from(sources);
}

async function find(filePath, alreadyParsedSet = new Set()) {
	// TODO add a cache here
	// Unfortunately we need to read the entire file, imports need to be at the top level but they can be anywhere 🫠
	let normalized = normalizeFilePath(filePath);
	if(alreadyParsedSet.has(normalized) || !existsSync(filePath)) {
		return [];
	}
	alreadyParsedSet.add(normalized);

	let contents = await readFile(normalized, { encoding: 'utf8' });
	let sources = await findByContents(contents, normalized, alreadyParsedSet);

	return sources;
}

module.exports = {
	find
};