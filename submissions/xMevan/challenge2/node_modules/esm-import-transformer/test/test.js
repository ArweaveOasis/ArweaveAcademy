import test from "ava";
import * as acorn from "acorn";
import { ImportTransformer } from "../import-transformer.js";

test("No import maps", t => {
  let before = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(before);

  t.is(tf.transformWithImportMap(), before);
});

test("Simple substitution", t => {
  let before = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `import {html, css, LitElement} from "other-lit-url";`;

  t.is(tf.transformWithImportMap({
    imports: {
      lit: "other-lit-url"
    }
  }), after);
});

test("Simple substitution (backwards compat method)", t => {
  let before = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `import {html, css, LitElement} from "other-lit-url";`;

  t.is(tf.transform({
    imports: {
      lit: "other-lit-url"
    }
  }), after);
});

test("Simple substitution (manual supply of ast)", t => {
  let before = `import {html, css, LitElement} from "lit";`;
  let ast = acorn.parse(before, {
    sourceType: "module",
    ecmaVersion: "latest"
  });
  let tf = new ImportTransformer(before, ast);

  let after = `import {html, css, LitElement} from "other-lit-url";`;

  t.is(tf.transformWithImportMap({
    imports: {
      lit: "other-lit-url"
    }
  }), after);
});

test("Multiple substitutions", t => {
  let before = `
import all from "lit";
import all2 from "lit2";
import all3 from "lit";
`;
  let tf = new ImportTransformer(before);

  let after = `
import all from "other-lit-url";
import all2 from "other-lit-url2";
import all3 from "other-lit-url";
`;

  t.is(tf.transformWithImportMap({
    imports: {
      lit: "other-lit-url",
      lit2: "other-lit-url2"
    }
  }), after);
});

test("Full URL", t => {
  let before = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `import {html, css, LitElement} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";`;

  t.is(tf.transformWithImportMap({
    imports: {
      lit: "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js"
    }
  }), after);
});

test("Change to dynamic import (default)", t => {
  let before = `import noop from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const noop = await import("@zachleat/noop");`;

  t.is(tf.transformToDynamicImport(), after);
});

test("Change to dynamic import (destructured)", t => {
  let before = `import { html, css, LitElement } from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = await import("lit");`;

  t.is(tf.transformToDynamicImport(), after);
});

test("Change to dynamic import (multiple)", t => {
  let before = `import { html, css, LitElement } from "lit";
import noop from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = await import("lit");
const noop = await import("@zachleat/noop");`;

  t.is(tf.transformToDynamicImport(), after);
});

test("Change to dynamic import (multiple ×3)", t => {
  let before = `import { html, css, LitElement } from "lit";
import noop from "@zachleat/noop";
import noop2 from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = await import("lit");
const noop = await import("@zachleat/noop");
const noop2 = await import("@zachleat/noop");`;

  t.is(tf.transformToDynamicImport(), after);
});

// TODO
test.skip("Change to dynamic import, multiple types", t => {
  let before = `import myDefault, { myModule } from "/modules/my-module.js";`;
  let tf = new ImportTransformer(before);

  let after = `const myDefault = await import("my-module.js");const { myModule } = myDefault;`;

  t.is(tf.transformToDynamicImport(), after);
});

// TODO
test.skip("Change to dynamic import with alias", t => {
  let before = `import { reallyReallyLongModuleExportName as shortName } from "my-module.js";`;
  let tf = new ImportTransformer(before);

  let after = `const { reallyReallyLongModuleExportName: shortName } = await import("my-module.js");`;

  t.is(tf.transformToDynamicImport(), after);
});

// TODO
test.skip("Change to dynamic import with namespace", t => {
  let before = `import * as name from "my-module.js";`;
  let tf = new ImportTransformer(before);

  let after = `/* TODO */`;

  t.is(tf.transformToDynamicImport(), after);
});

test("Change to require (default)", t => {
  let before = `import noop from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const noop = require("@zachleat/noop");`;

  t.is(tf.transformToRequire(), after);
});


test("Change to require (destructured)", t => {
  let before = `import { html, css, LitElement } from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = require("lit");`;

  t.is(tf.transformToRequire(), after);
});

test("Change to require (multiple)", t => {
  let before = `import { html, css, LitElement } from "lit";
import noop from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = require("lit");
const noop = require("@zachleat/noop");`;

  t.is(tf.transformToRequire(), after);
});

test("Change to require (multiple ×3)", t => {
  let before = `import { html, css, LitElement } from "lit";
import noop from "@zachleat/noop";
import noop2 from "@zachleat/noop";`;
  let tf = new ImportTransformer(before);

  let after = `const { html, css, LitElement } = require("lit");
const noop = require("@zachleat/noop");
const noop2 = require("@zachleat/noop");`;

  t.is(tf.transformToRequire(), after);
});

test("Test if has imports (using import)", t => {
  let code = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(code);

  t.is(tf.hasImports(), true);
});

test("Test if has imports (using require)", t => {
  let code = `const {html, css, LitElement} = require("lit");`;
  let tf = new ImportTransformer(code);

  t.is(tf.hasImports(), false);
});
