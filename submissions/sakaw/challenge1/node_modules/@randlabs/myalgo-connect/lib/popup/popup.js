const { WINDOW_NOT_OPENED } = require("../utils/errors");

/**
 * @description Popup configuration
 * @typedef {Object} PopupOptions
 * @property {string} [name]
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [top]
 * @property {number} [left]
 * @property {0|1} [status]
 * @property {0|1} [resizable]
 * @property {0|1} [toolbar]
 * @property {0|1} [menubar]
 * @property {0|1} [scrollbars]
 */

/**
 * @type {PopupOptions}
 */
const defaultOptions = {
	width: 400,
	height: 600,
};

/**
 * @description Open a new browser window
 * @param {string} url
 * @param {PopupOptions} options
 * @returns {Window}
 * @file Open new popup
 * @author The kraken.js team
 * @copyright This file is part of the project BelterJS which is released under Apache-2.0 License.
 * Go to https://github.com/krakenjs/belter for full license details.
 */

function openPopup(url, options = defaultOptions) {

	let { name = '', width, height, top = 0, left = 0 } = options;

	if (width) {
		if (window.outerWidth) {
			left = Math.round((window.outerWidth - width) / 2) + window.screenX;
		}
		else if (window.screen.width) {
			left = Math.round((window.screen.width - width) / 2);
		}
	}

	if (height) {
		if (window.outerHeight) {
			top = Math.round((window.outerHeight - height) / 2) + window.screenY;
		}
		else if (window.screen.height) {
			top = Math.round((window.screen.height - height) / 2);
		}
	}

	if (width && height) {
		options = {
			top,
			left,
			width,
			height,
			status: 1,
			toolbar: 0,
			menubar: 0,
			resizable: 1,
			scrollbars: 1,
		};
	}

	// eslint-disable-next-line array-callback-return
	const params = Object.keys(options).map((key) => {
		const param = options[key];
		if (param !== null && param !== undefined && typeof param.toString === 'function') {
			return `${key}=${param.toString()}`;
		}
	}).filter(Boolean).join(',');

	let win;

	try {
		win = window.open(url, name, params);
	}
	catch (err) {
		throw new Error(`${WINDOW_NOT_OPENED} - ${err.stack || err.message}`);
	}

	if (!win || window.closed) {
		throw new Error(`${WINDOW_NOT_OPENED} - blocked`);
	}

	return win;
}

module.exports = {
	openPopup,
};
