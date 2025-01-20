const test = require("ava");

test("Full URL", async t => {
  const { ImportTransformer } = await import("../import-transformer.js");

  let before = `import {html, css, LitElement} from "lit";`;
  let tf = new ImportTransformer(before);

  let after = `import {html, css, LitElement} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";`;

  t.is(tf.transformWithImportMap({
    imports: {
      lit: "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js"
    }
  }), after);
});