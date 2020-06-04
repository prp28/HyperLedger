'use strict';

const Request = require('../models/propertyrequest.js');

class PropertyRequestUtils {

	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.utils.propertyrequest';
	}

	/**
	 * Returns the Student model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<Student>}
	 */
	async getPropertyRequest(propertyRequestKey) {
		let propertyRequestCompositeKey = this.ctx.stub.createCompositeKey(this.name, propertyRequestKey.split(':'));
		let propertyRequestBuffer = await this.ctx.stub.getState(propertyRequestCompositeKey);
		return Request.fromBuffer(propertyRequestBuffer);
	}

	/**
	 * Adds a student model to the blockchain
	 * @param studentObject {Student}
	 * @returns {Promise<void>}
	 */
	async addPropertyRequest(propertyRequest) {
		let propertyRequestCompositeKey = this.ctx.stub.createCompositeKey(this.name, propertyRequest.getKeyArray());
		let propertyRequestBuffer = propertyRequest.toBuffer();
		await this.ctx.stub.putState(propertyRequestCompositeKey, propertyRequestBuffer);
	}

}

module.exports = PropertyRequestUtils;
