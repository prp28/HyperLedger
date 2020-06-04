'use strict';

const Request = require('../models/request.js');

class RequestUtils {

	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.utils.request';
	}

	/**
	 * Returns the Student model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<Student>}
	 */
	async getUserRequest(userKey) {
		let userRequestCompositeKey = this.ctx.stub.createCompositeKey(this.name, userKey.split(':'));
		let userRequestBuffer = await this.ctx.stub.getState(userRequestCompositeKey);
		return Request.fromBuffer(userRequestBuffer);
	}

	/**
	 * Adds a student model to the blockchain
	 * @param studentObject {Student}
	 * @returns {Promise<void>}
	 */
	async addUserRequest(userRequest) {
		let userRequestCompositeKey = this.ctx.stub.createCompositeKey(this.name, userRequest.getKeyArray());
		let userRequestBuffer = userRequest.toBuffer();
		await this.ctx.stub.putState(userRequestCompositeKey, userRequestBuffer);
	}

}

module.exports = RequestUtils;
