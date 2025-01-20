const path = require("path");
const { TemplatePath } = require("@11ty/eleventy-utils");

function getAbsolutePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let hasDotSlash = filename.startsWith("./");
  return hasDotSlash ? path.join(path.resolve("."), normalizedFilename) : normalizedFilename;
}

function getRelativePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let workingDirectory = path.resolve(".");
  let result = "./" + (normalizedFilename.startsWith(workingDirectory) ? normalizedFilename.substr(workingDirectory.length + 1) : normalizedFilename);
  return result;
}

function getNodeModuleName(filename) {
  let foundNodeModules = false;
  let moduleName = [];

  let s = filename.split(path.sep);
  for(let entry of s) {
    if(entry === '.pnpm') {
      foundNodeModules = false;
    }
    
    if(foundNodeModules) {
      moduleName.push(entry);
      if(!entry.startsWith("@")) {
        return moduleName.join("/");
      }
    }

    if(entry === "node_modules") {
      foundNodeModules = true;
    }
  }

  return false;
}

/* unordered */
function getDependenciesFor(filename, avoidCircular, optionsArg = {}) {
  // backwards compatibility with `nodeModuleNamesOnly` boolean option
  // Using `nodeModuleNames` property moving forward
  if(("nodeModuleNamesOnly" in optionsArg) && !("nodeModuleNames" in optionsArg)) {
    if(optionsArg.nodeModuleNamesOnly === true) {
      optionsArg.nodeModuleNames = "only";
    }
    if(optionsArg.nodeModuleNamesOnly === false) {
      optionsArg.nodeModuleNames = "exclude";
    }
  }

  let options = Object.assign({
    allowNotFound: false,
    nodeModuleNames: "exclude", // also "include" or "only"
  }, optionsArg);
  let absoluteFilename = getAbsolutePath(filename)

  try {
    require(absoluteFilename);
  } catch(e) {
    if(e.code === "MODULE_NOT_FOUND" && options.allowNotFound) {
      // do nothing
    } else {
      throw e;
    }
  }


  let mod;
  for(let entry in require.cache) {
    if(entry === absoluteFilename) {
      mod = require.cache[entry];
      break;
    }
  }

  let dependencies = new Set();

  if(!mod) {
    if(!options.allowNotFound) {
      throw new Error(`Could not find ${filename} in @11ty/dependency-tree`);
    }
  } else {
    let relativeFilename = getRelativePath(mod.filename);
    if(!avoidCircular) {
      avoidCircular = {};
    } else if(options.nodeModuleNames !== "only") {
      dependencies.add(relativeFilename);
    }

    avoidCircular[relativeFilename] = true;

    if(mod.children) {
      for(let child of mod.children) {
        let relativeChildFilename = getRelativePath(child.filename);
        let nodeModuleName = getNodeModuleName(child.filename);

        if(options.nodeModuleNames !== "exclude" && nodeModuleName) {
          dependencies.add(nodeModuleName);
        }
        // Add dependencies of this dependency (not top level node_modules)
        if(nodeModuleName === false) {
          if(!dependencies.has(relativeChildFilename) && // avoid infinite looping with circular deps
            !avoidCircular[relativeChildFilename] ) {
            for(let dependency of getDependenciesFor(relativeChildFilename, avoidCircular, options)) {
              dependencies.add(dependency);
            }
          }
        }
      }
    }
  }

  return dependencies;
}

function getCleanDependencyListFor(filename, options = {}) {
  let deps = Array.from( getDependenciesFor(filename, null, options) );

  return deps.map(filePath => {
    if(filePath.startsWith("./")) {
      return TemplatePath.standardizeFilePath(filePath);
    }
    return filePath; // node_module name
  });
}

module.exports = getCleanDependencyListFor;
module.exports.getNodeModuleName = getNodeModuleName;