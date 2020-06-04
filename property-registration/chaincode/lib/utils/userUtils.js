'use strict';

const User = require('../models/user.js');

class UserUtils {

	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.utils.user';
	}

	/**
	 * Returns the Student model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<Student>}
	 */
	async getUser(userKey) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userKey.split(':'));
		let userBuffer = await this.ctx.stub.getState(userCompositeKey);
		// console.log("Response from Blockchain: " + User.fromBuffer(userBuffer).name);
		return User.fromBuffer(userBuffer);
	}

	/**
	 * Adds a student model to the blockchain
	 * @param userRequest {Student}
	 * @returns {Promise<void>}
	 */
	async addUser(userRequest) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userRequest.getKeyArray());
		let userBuffer = userRequest.toBuffer();
		await this.ctx.stub.putState(userCompositeKey, userBuffer);
	}

}

module.exports = UserUtils;
