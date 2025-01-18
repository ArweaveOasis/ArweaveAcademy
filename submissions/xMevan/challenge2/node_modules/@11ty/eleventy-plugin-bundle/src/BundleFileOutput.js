import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");

const hashCache = {};
const directoryExistsCache = {};
const writingCache = new Set();

class BundleFileOutput {
	constructor(outputDirectory, bundleDirectory) {
		this.outputDirectory = outputDirectory;
		this.bundleDirectory = bundleDirectory || "";
		this.hashLength = 10;
		this.fileExtension = undefined;
	}

	setFileExtension(ext) {
		this.fileExtension = ext;
	}

	getFilenameHash(content) {
		if(hashCache[content]) {
			return hashCache[content];
		}

		let hash = createHash("sha256");
		hash.update(content);
		let base64hash = hash.digest('base64').replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
		let filenameHash = base64hash.substring(0, this.hashLength);
		hashCache[content] = filenameHash;
		return filenameHash;
	}

	getFilename(filename, extension) {
		return filename + (extension && !extension.startsWith(".") ? `.${extension}` : "");
	}

	modifyPathToUrl(dir, filename) {
		return "/" + path.join(dir, filename).split(path.sep).join("/");
	}

	writeBundle(content, type, writeToFileSystem) {
		// do not write a bundle, do not return a file name is content is empty
		if(!content) {
			return;
		}

		let dir = path.join(this.outputDirectory, this.bundleDirectory);
		let filenameHash = this.getFilenameHash(content);
		let filename = this.getFilename(filenameHash, this.fileExtension || type);

		if(writeToFileSystem) {
			let fullPath = path.join(dir, filename);

			// no duplicate writes, this may be improved with a fs exists check, but it would only save the first write
			if(!writingCache.has(fullPath)) {
				writingCache.add(fullPath);

				if(!directoryExistsCache[dir]) {
					fs.mkdirSync(dir, { recursive: true });
					directoryExistsCache[dir] = true;
				}

				debug("Writing bundle %o", fullPath);
				fs.writeFileSync(fullPath, content);
			}
		}

		return this.modifyPathToUrl(this.bundleDirectory, filename);
	}
}

export { BundleFileOutput };
