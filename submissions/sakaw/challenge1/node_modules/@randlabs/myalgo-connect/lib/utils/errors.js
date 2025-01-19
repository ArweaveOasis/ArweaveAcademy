const ERRORS = {
	WINDOW_NOT_LOADED: "Window not loaded",
	WINDOW_IS_OPENED: "Windows is opened",
	WINDOW_NOT_OPENED: "Can not open popup window",
	INVALID_WINDOW: "Invalid window",
};

class SignTxnsError extends Error {
	constructor(message, code, data) {
		super(message);
		this.code = code;
		this.data = data;
	}
}

module.exports = {
	ERRORS,
	SignTxnsError
};
