import test from "ava";
import { RetrieveGlobals } from "../retrieveGlobals.js";
import { isSupported } from "../util/vmModules.js";
import { getWorkingDirectory } from "../util/getWorkingDirectory.js";

const IS_VM_MODULES_SUPPORTED = isSupported();

test("var", async t => {
	let vm = new RetrieveGlobals(`var a = 1;`);
	t.deepEqual(await vm.getGlobalContext(), { a: 1 });
});

test("isPlainObject", async t => {
	// from eleventy-utils
	function isPlainObject(value) {
		if (value === null || typeof value !== "object") {
			return false;
		}
		let proto = Object.getPrototypeOf(value);
		return !proto || proto === Object.prototype;
	};

	let vm = new RetrieveGlobals("var a = 1;");
	t.true(isPlainObject(await vm.getGlobalContext()));
});

test("isPlainObject deep", async t => {
	// from eleventy-utils
	function isPlainObject(value) {
		if (value === null || typeof value !== "object") {
			return false;
		}
		let proto = Object.getPrototypeOf(value);
		return !proto || proto === Object.prototype;
	};

	let vm = new RetrieveGlobals("var a = { b: 1, c: { d: {} } };");
	let obj = await vm.getGlobalContext();
	t.true(isPlainObject(obj.a.c));
	t.true(isPlainObject(obj.a.c.d));
});

test("isPlainObject deep circular", async t => {
	// from eleventy-utils
	function isPlainObject(value) {
		if (value === null || typeof value !== "object") {
			return false;
		}
		let proto = Object.getPrototypeOf(value);
		return !proto || proto === Object.prototype;
	};

	let vm = new RetrieveGlobals(`
var a = { a: 1 };
var b = { b: a };
a.b = b;
`);
	let obj = await vm.getGlobalContext();
	t.true(isPlainObject(obj.a.b));
	t.true(isPlainObject(obj.b.b));
});


test("var with data", async t => {
	let vm = new RetrieveGlobals("var a = b;");
	t.deepEqual(await vm.getGlobalContext({ b: 2 }), { a: 2 });
});

test("let with data", async t => {
	let vm = new RetrieveGlobals("let a = b;");
	t.deepEqual(await vm.getGlobalContext({ b: 2 }), { a: 2 });
});

test("const with data", async t => {
	let vm = new RetrieveGlobals("const a = b;");
	t.deepEqual(await vm.getGlobalContext({ b: 2 }), { a: 2 });
});

test("function", async t => {
	let vm = new RetrieveGlobals("function testFunction() {}");
	let ret = await vm.getGlobalContext();
	t.true(typeof ret.testFunction === "function");
});

test("async let", async t => {
	let vm = new RetrieveGlobals(`let b = await Promise.resolve(1);`);
	let ret = await vm.getGlobalContext();
	t.deepEqual(ret, { b: 1 });
});

test("destructured assignment via object", async t => {
	let vm = new RetrieveGlobals(`const { a } = { a: 1 };`);
	let ret = await vm.getGlobalContext();
	t.is(typeof ret.a, "number");
	t.is(ret.a, 1);
});

test("destructured assignment via Array", async t => {
	let vm = new RetrieveGlobals(`const [a, b] = [1, 2];`);
	let ret = await vm.getGlobalContext();
	t.is(typeof ret.a, "number");
	t.is(typeof ret.b, "number");
	t.is(ret.a, 1);
	t.is(ret.b, 2);
});

test("global: same console.log", async t => {
	let vm = new RetrieveGlobals(`const b = console.log`);
	let ret = await vm.getGlobalContext(undefined, {
		reuseGlobal: false
	});
	t.not(ret.b, console.log);

	let ret2 = await vm.getGlobalContext(undefined, {
		reuseGlobal: true
	});
	t.is(ret2.b, console.log);
});

test("global: Same URL", async t => {
	let vm = new RetrieveGlobals(`const b = URL;`);
	let ret = await vm.getGlobalContext(undefined, {
		reuseGlobal: true
	});
	t.is(ret.b, URL);
});

test("return array", async t => {
	let vm = new RetrieveGlobals("let b = [1,2,3];");
	let globals = await vm.getGlobalContext();
	t.true(Array.isArray(globals.b));
	t.deepEqual(globals.b, [1,2,3]);
});

test("`require` Compatibility", async t => {
	let vm = new RetrieveGlobals(`const { noop } = require("@zachleat/noop");
const b = 1;`);
	let ret = await vm.getGlobalContext(undefined, {
		addRequire: true,
	});
	t.is(typeof ret.noop, "function");
	t.is(ret.b, 1);
});

// Works with --experimental-vm-modules, remove this when modules are stable
if(IS_VM_MODULES_SUPPORTED) {
	test("dynamic import (no code transformation) (requires --experimental-vm-modules in Node v20.10)", async t => {
		let vm = new RetrieveGlobals(`const { noop } = await import("@zachleat/noop");`);
		let ret = await vm.getGlobalContext(undefined, {
			dynamicImport: true
		});
		t.is(typeof ret.noop, "function");
	});
}

test("dynamic import (no code transformation) (experimentalModuleApi explicit true)", async t => {
	let vm = new RetrieveGlobals(`const { noop } = await import("@zachleat/noop");`);
	let ret = await vm.getGlobalContext(undefined, {
		dynamicImport: true, // irrelevant for fallback case, important for --experimental-vm-modules support case
		experimentalModuleApi: true, // Needs to be true here because there are no top level `import`
	});
	t.is(typeof ret.noop, "function");
});

// This would require --experimental-vm-modules in Node v20.10, but instead falls back to `experimentalModuleApi` automatically
test("ESM import", async t => {
	let vm = new RetrieveGlobals(`import { noop } from "@zachleat/noop";
const b = 1;`, {
		transformEsmImports: true,
	});
	let ret = await vm.getGlobalContext(undefined, {
		// experimentalModuleApi: true, // implied
		dynamicImport: true,
	});
	t.is(typeof ret.noop, "function");
	t.is(ret.b, 1);
});

// This would require --experimental-vm-modules in Node v20.10, but instead falls back to `experimentalModuleApi` automatically
test("ESM import (experimentalModuleApi implied true)", async t => {
	let vm = new RetrieveGlobals(`import { noop } from "@zachleat/noop";
const b = 1;`, {
		transformEsmImports: true,
	});
	let ret = await vm.getGlobalContext(undefined, {
		// experimentalModuleApi: true,
	});
	t.is(typeof ret.noop, "function");
	t.is(ret.b, 1);
});

// This would require --experimental-vm-modules in Node v20.10, but instead falls back to `experimentalModuleApi` automatically
test("ESM import (experimentalModuleApi explicit true)", async t => {
	// let vm = new RetrieveGlobals(`import { noop } from "@zachleat/noop";
	let vm = new RetrieveGlobals(`import { noop } from "@zachleat/noop";
const b = 1;`, {
		transformEsmImports: true, // overridden to false when --experimental-vm-modules
	});
	let ret = await vm.getGlobalContext(undefined, {
		experimentalModuleApi: true, // overridden to false when --experimental-vm-modules
	});
	t.is(typeof ret.noop, "function");
	t.is(ret.b, 1);
});

// This does not require --experimental-vm-modules in Node v20.10+ as it has no imports
test("No imports, with data", async t => {
	let vm = new RetrieveGlobals(`const b = inputData;`, {
		transformEsmImports: true,
	});
	let ret = await vm.getGlobalContext({ inputData: "hi" }, {
		// experimentalModuleApi: true, // implied false
	});

	t.is(ret.b, "hi");
});

// This does not require --experimental-vm-modules in Node v20.10+ as it has no imports
test("No imports, with JSON unfriendly data", async t => {
	let vm = new RetrieveGlobals(`const b = fn;`, {
		transformEsmImports: true,
	});
	let ret = await vm.getGlobalContext({ fn: function() {} }, {
		// experimentalModuleApi: true, // implied false
	});
	t.is(typeof ret.b, "function");
});

// This requires --experimental-vm-modules in Node v20.10+ and uses the experimentalModuleApi because it has imports
test("With imports, with JSON unfriendly data", async t => {
	let vm = new RetrieveGlobals(`import { noop } from "@zachleat/noop";
const b = fn;`, {
		transformEsmImports: true,
	});

	if(IS_VM_MODULES_SUPPORTED) {
		// Works fine with --experimental-vm-modules
		let ret = await vm.getGlobalContext({ fn: function() {} }, {
			// experimentalModuleApi: true, // implied false
		});
		t.is(typeof ret.b, "function");
	} else {
		// This throws if --experimental-vm-modules not set
		await t.throwsAsync(async () => {
			let ret = await vm.getGlobalContext({ fn: function() {} }, {
				// experimentalModuleApi: true, // implied true
			});
		});
	}
});

if(IS_VM_MODULES_SUPPORTED) {
	test("import.meta.url works", async t => {
		let vm = new RetrieveGlobals(`const b = import.meta.url;`, {
			filePath: import.meta.url
		});

		let ret = await vm.getGlobalContext();
		t.is(ret.b, import.meta.url);
	});

	test("import.meta.url has the current working directory (if not passed via filePath)", async t => {
		let vm = new RetrieveGlobals(`const b = import.meta.url;`, {
			// filePath: import.meta.url
		});

		let ret = await vm.getGlobalContext();
		t.is(ret.b, getWorkingDirectory());
	});
}