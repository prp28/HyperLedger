'use strict';

class User {

	/**
	 * Constructor function
	 * @param UserRequestObject {Object}
	 */
	constructor(UserRequestObject) {
		this.key = User.makeKey([UserRequestObject.name, UserRequestObject.aadharNo]);
		Object.assign(this, UserRequestObject);
	}

	/**
	 * Get class of this model
	 * @returns {string}
	 */
	static getClass() {
		return 'org.property-registration-network.regnet.models.user';
	}

	/**
	 * Convert the buffer stream received from blockchain into an object of this model
	 * @param buffer {Buffer}
	 */
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		return new User(json);
	}

	/**
	 * Convert the object of this model to a buffer stream
	 * @returns {Buffer}
	 */
	toBuffer() {
		return Buffer.from(JSON.stringify(this));
	}

	/**
	 * Create a key string joined from different key parts
	 * @param keyParts {Array}
	 * @returns {*}
	 */
	static makeKey(keyParts) {
		return keyParts.map(part => JSON.stringify(part)).join(":");
	}

	/**
	 * Create an array of key parts for this model instance
	 * @returns {Array}
	 */
	getKeyArray() {
		return this.key.split(":");
	}

	/**
	 * Create a new instance of this model
	 * @returns {User}
	 * @param userObject {Object}
	 */
	static createInstance(userObject) {
		return new User(userObject);
	}

}

module.exports = User;
