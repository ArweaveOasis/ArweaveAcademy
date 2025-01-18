import * as acorn from "acorn";

export class ImportTransformer {
  constructor(input, ast) {
    this.parse(input, ast);
  }

  parse(input, ast) {
    if(!input) {
      throw new Error("Missing input to ImportTransformer, received: " + input)
    }

    this.originalSource = input;

    if(ast) {
      this.ast = ast;
    } else {
      this.ast = acorn.parse(input, {
        sourceType: "module",
        ecmaVersion: "latest"
      });
    }
  }

  static transformImportSource(str, sourceNode, indexOffset = 0, importMap = {}) {
    let { start, end, value } = sourceNode;
    // Could be improved by https://www.npmjs.com/package/@import-maps/resolve
    let resolved = importMap?.imports && importMap?.imports[value];
    if(resolved) {
      return {
        code: str.slice(0, start + 1 + indexOffset) + resolved + str.slice(end - 1 + indexOffset),
        offset: resolved.length - value.length,
      };
    }
    return {
      code: str,
      offset: 0
    };
  }

  static transformImportCode(prefix, str, node, specifiers, sourceNode, indexOffset = 0) {
    let { start, end } = node;
    start += indexOffset;
    end += indexOffset;

    let { raw: rawSourceValue } = sourceNode;

    let importDeclaration = str.slice(start, end - 1);

    let specifierIndexes = [];
    if(importDeclaration.startsWith("import ")) {
      specifierIndexes[0] = "import ".length + start;
    } else {
      throw new Error(`Could not find \`import\` in import declaration: ${importDeclaration}`);
    }

    specifierIndexes[1] = specifiers[specifiers.length - 1].end + indexOffset;

    // normalize away trailing } on import { a, b, c } specifiers
    let split = str.slice(specifierIndexes[1]).split(" from ");
    if(split.length > 0) {
      specifierIndexes[1] += split[0].length;
    }

    let newImportString = `const ${str.slice(specifierIndexes[0], specifierIndexes[1])} = ${prefix}(${rawSourceValue})`;
    let returnedCode = str.slice(0, start) + newImportString + str.slice(end - 1);

    return {
      code: returnedCode,
      offset: returnedCode.length - str.length,
    };
  }

  _transform(prefix) {
    let input = this.originalSource;
    let indexOffset = 0;
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        let ret = ImportTransformer.transformImportCode(prefix, input, node, node.specifiers, node.source, indexOffset)
        input = ret.code;
        indexOffset += ret.offset;
      }
    }

    return input;
  }

  transformToDynamicImport() {
    return this._transform("await import");
  }

  transformToRequire() {
    return this._transform("require");
  }

  // alias for backwards compat
  transform(...args) {
    return this.transformWithImportMap(...args);
  }

  transformWithImportMap(importMap) {
    if(!importMap) {
      return this.originalSource;
    }

    let input = this.originalSource;
    let indexOffset = 0;
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        if(importMap?.imports) {
          let ret = ImportTransformer.transformImportSource(input, node.source, indexOffset, importMap);
          input = ret.code;
          indexOffset += ret.offset;
        }
      }
    }

    return input;
  }

  hasImports() {
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        return true;
      }
    }

    return false;
  }
}
