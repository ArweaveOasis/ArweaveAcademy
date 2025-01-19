class Messenger {

	/**
	 * @callback onMessage
	 * @param {error} err
	 * @param {Object} result
	 */

	/**
	 * @description Callback function to send response to the window source of the message
	 * @callback sendResponse
	 * @param {Object} response Message response
	 * @returns {void}
	 */

	/**
	 * @description Callback function to manage message received from the channel
     * @callback onMessageCallback
     * @param {Object} json
	 * @param {Window} source
     * @param {sendResponse} cb
	 * @param {Messenger} bridge
	 * @returns {void}
     */

	/**
	 * @description Send message options
	 * @typedef {Object} sendMessageOptions
	 * @property {boolean} waitForReply Wait for a reply from the recipient
	 * @property {string} origin Override Window.origin
	 * @property {number} timeout Timeout to wait for reply message, default 4000 msec
	 */

	/**
     * @param {string} channelName  Channel Name
     * @param {onMessageCallback} [onMessageCallback] Callback function
     */

	constructor(channelName, onMessageCallback) {
		this.channelName = channelName;
		this.onMessage = onMessageCallback;

		this._installListener();

		/**
		 * @access private
		 * @typedef {Object.<string, onMessage>} RequestObject Request objects
		 * @type {RequestObject} _requests Mapping of request ids to callbacks
		 */
		this._requests = new Map();

		/**
		 * @access private
		 * @type {number} Next request id
		 */
		this._nextId = 0;

		/**
		 * @access private
		 * @type {number} Time to wait for the message response
		 */
		this._defaultTimeout = 4000;
	}

	/**
	 * @access private
	 */

	_installListener() {
		const that = this;

		/**
		 * @access private
		 * @param {Window} this
		 * @param {MessageEvent} event
		 */

		this._listener = function (event) {
			// Ignore invalid messages or those after the client has closed
			if (!event.data || typeof event.data !== 'string') {
				return;
			}

			let json;

			try {
				json = JSON.parse(event.data);
				if (!json.channel || json.channel !== that.channelName) {
					return;
				}
				if (typeof json.message !== 'object') {
					return;
				}
			}
			catch (err) {
				 // Ignore malformed messages or not targetting us
				return;
			}

			// Add request callback
			if (typeof json.replyId !== 'undefined') {

				if (typeof json.replyId !== 'number' || (json.replyId % 1) !== 0) {
					return;
				}

				// If we have a message waiting for a reply, process it, else ignore
				const req = that._requests.get(json.replyId);
				if (req) {
					// Ignore if the message comes from somewhere else
					if (event.origin !== req.targetOrigin) {
						return;
					}

					clearTimeout(req.timeout);

					that._requests.delete(json.replyId);

					req.resolve(json.message);
				}
			}
			else {
				if (typeof json.id !== 'number' || (json.id % 1) !== 0 || !that.onMessage) {
					return;
				}

				// We received a message
				const channel = that.channelName;
				const replyId = json.id;
				const origin = event.origin;

				const replyMessage = function (message) {
					const request = {
						channel,
						replyId,
						message: message,
					};

					event.source.postMessage(
						JSON.stringify(request),
						origin
					);
				};

				that.onMessage(json.message, event.origin, event.source, replyMessage, that);
			}
		};

		window.addEventListener("message", this._listener);
	}

	/**
	 * @access public
	 * @description Send a message to another window
	 * @param {Window} targetWindow Target Window
	 * @param {Object} message Object Message
	 * @param {string} origin Target origin
	 * @param {sendMessageOptions} [options] Object Message
	 * @returns {Promise<any>} Returns
	 */
	sendMessage(targetWindow, message, origin, options) {
		let targetOrigin;
		try {
			targetOrigin = new URL(origin).origin;
		}
		catch (e) {
			throw new Error('Invalid origin URL');
		}

		// Prepare message
		const request = {
			channel: this.channelName,
			id: this.getNextId(),
			message: message,
		};

		if (options && options.waitForReply) {
			const that = this;

			return new Promise(function (resolve, reject) {
				// Set a timeout if a response is not received
				const timeout = setTimeout(function() {
					const req = that._requests.get(request.id);
					if (req) {
						that._requests.delete(request.id);

						reject(new Error('Timeout expired for the message response'));
					}
				}, options && options.timeout ? options.timeout : that._defaultTimeout);

				that._requests.set(request.id, {
					timeout,
					resolve,
					targetOrigin,
				});

				targetWindow.postMessage(
					JSON.stringify(request),
					targetOrigin
				);
			});

		}
		targetWindow.postMessage(
			JSON.stringify(request),
			targetOrigin
		);
	}

	/**
	 * @access public
	 * @description Close client connection
	 */

	close() {
		window.removeEventListener('message', this._listener);
		this._listener = null;
		delete this._requests;
	}

	/**
	 * @access private
	 */

	getNextId() {
		this._nextId += 1;
		return this._nextId;
	}
}

module.exports = Messenger;
