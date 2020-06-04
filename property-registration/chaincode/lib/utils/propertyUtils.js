'use strict';

const Request = require('../models/property.js');

class PropertyUtils {

	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.utils.property';
	}

	/**
	 * Returns the Student model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<Student>}
	 */
	async getProperty(propertyKey) {
		let propertyCompositeKey = this.ctx.stub.createCompositeKey(this.name, propertyKey.split(':'));
		let propertyBuffer = await this.ctx.stub.getState(propertyCompositeKey);
		return Request.fromBuffer(propertyBuffer);
	}

	/**
	 * Adds a student model to the blockchain
	 * @param studentObject {Student}
	 * @returns {Promise<void>}
	 */
	async addProperty(property) {
		console.log("KeyArray: " + property.getKeyArray());
		let propertyCompositeKey = this.ctx.stub.createCompositeKey(this.name, property.getKeyArray());
		let propertyBuffer = property.toBuffer();
		await this.ctx.stub.putState(propertyCompositeKey, propertyBuffer);
	}

}

module.exports = PropertyUtils;
