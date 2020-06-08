'use strict';

const User = require('../models/company.js');

class CompanyUtils {

	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.pharma-network.pharmanet.utils.company';
	}

	/**
	 * Returns the Company model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<Company>}
	 */
	async getCompanyDetails(key) {
		let companyKey = this.ctx.stub.createCompositeKey(this.name, key.split(':'));
		let userBuffer = await this.ctx.stub.getState(companyKey);
		// console.log("Response from Blockchain: " + User.fromBuffer(userBuffer).name);
		return User.fromBuffer(userBuffer);
	}

	/**
	 * Adds a Company model to the blockchain
	 * @param companyRequest {Company}
	 * @returns {Promise<void>}
	 */
	async addCompanyDetails(companyRequest) {
		let companyKey = this.ctx.stub.createCompositeKey(this.name, companyRequest.getKeyArray());
		let userBuffer = companyRequest.toBuffer();
		await this.ctx.stub.putState(companyKey, userBuffer);
	}

}

module.exports = CompanyUtils;
