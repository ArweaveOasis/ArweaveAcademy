const test = require("ava");
const { find } = require("../main.js");

test("Empty", async t => {
	t.deepEqual(await find("./test/stubs/empty.js"), []);
});

test("Doesn’t exist", async t => {
	t.deepEqual(await find("./test/stubs/THIS_FILE_DOES_NOT_EXIST.js"), []);
});

test("Simple", async t => {
	t.deepEqual(await find("./test/stubs/file.js"), ["./test/stubs/imported-secondary.js"]);
});

test("Nested two deep", async t => {
	t.deepEqual(await find("./test/stubs/nested.js"), ["./test/stubs/imported.js", "./test/stubs/imported-secondary.js"]);
});

test("Nested three deep", async t => {
	t.deepEqual(await find("./test/stubs/nested-grandchild.js"), ["./test/stubs/nested.js", "./test/stubs/imported.js", "./test/stubs/imported-secondary.js"]);
});

test("Circular", async t => {
	t.deepEqual(await find("./test/stubs/circular-parent.js"), ["./test/stubs/circular-child.js"]);
});

test("Circular Self Reference", async t => {
	t.deepEqual(await find("./test/stubs/circular-self.js"), ["./test/stubs/empty.js"]);
});

// https://github.com/11ty/eleventy-dependency-tree-esm/issues/2
test("Import Attributes, issue #2", async t => {
	t.deepEqual(await find("./test/stubs/import-attributes.js"), ["./test/stubs/imported.json"]);
});
