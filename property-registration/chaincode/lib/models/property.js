'use strict';

class Property {

	/**
	 * Constructor function
	 * @param UserRequestObject {Object}
	 */
	constructor(propertyRequest) {
		this.key = Property.makeKey([propertyRequest.propertyId]);
		Object.assign(this, propertyRequest);
	}

	/**
	 * Get class of this model
	 * @returns {string}
	 */
	static getClass() {
		return 'org.property-registration-network.regnet.models.property';
	}

	/**
	 * Convert the buffer stream received from blockchain into an object of this model
	 * @param buffer {Buffer}
	 */
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		console.log("JSON: " + json);
		return new Property(json);
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
	 * @returns {Student}
	 * @param requestObject {Object}
	 */
	static createInstance(requestObject) {
		return new Property(requestObject);
	}

}

module.exports = Property;
