'use strict';

const {Contract, Context} = require('fabric-contract-api');

const Request = require('./lib/models/request.js');
const RequestUtils = require('./lib/utils/requestUtils.js');
const User = require('./lib/models/user.js');
const UserUtils = require('./lib/utils/userUtils.js');
const PropertyRequest = require('./lib/models/propertyrequest.js');
const PropertyRequestUtils = require('./lib/utils/propertyRequestUtils.js');
const Property = require('./lib/models/property.js');
const PropertyUtils = require('./lib/utils/propertyUtils.js');


class RegnetContext extends Context {
	constructor() {
		super();
		// Add various model utils to the context class object
		// this : the context instance
		this.requestUtils = new RequestUtils(this);
		this.userUtils = new UserUtils(this);
    this.propertyRequestUtils = new PropertyRequestUtils(this);
    this.propertyUtils = new PropertyUtils(this);
		// this.certificateList = new CertificateList(this);
	}
}

class RegistrarContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.registrarcontract');
	}

	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new RegnetContext();
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('registrar Smart Contract Instantiated');
	}


	async approveNewUser(ctx, name, aadharNo) {
		// Create the composite key required to fetch record from blockchain
		const userRequestKey = Request.makeKey([name, aadharNo]);

		// Return value of user Request from blockchain
		let userRequestDetails = await ctx.requestUtils.getUserRequest(userRequestKey)
				.catch(err => console.log("Error: " + err));

		if (userRequestDetails !== undefined) {

			// Create a Request object for User to be stored in blockchain
			let newUserObject = {
				name: userRequestDetails.name,
				email: userRequestDetails.email,
				createdAt: userRequestDetails.createdAt,
				aadharNo: userRequestDetails.aadharNo,
				phone: userRequestDetails.phone,
				upgradCoins: 0
			};

			// Create a new instance of User model and save it to blockchain
			let newUser = User.createInstance(newUserObject);
			await ctx.userUtils.addUser(newUser);

			return newUser;

		}	else {
			throw new Error('Invalid User Request for: ' + name + '-' + aadharNo + '. A User Request with this ID does not exist.');
		}

	}

  async approvePropertyRegistration(ctx, propertyId) {

    // Create the composite key required to fetch record from blockchain
    const propertyRequestKey = Request.makeKey([propertyId]);

    // Return value of user Request from blockchain
    let propertyRequestDetails = await ctx.propertyRequestUtils.getPropertyRequest(propertyRequestKey)
        .catch(err => console.log("Error: " + err));

    if(propertyRequestDetails!==undefined){

      let newPropertyObject = {
        propertyId: propertyRequestDetails.propertyId,
        owner: propertyRequestDetails.owner,
        price: propertyRequestDetails.price,
        status: propertyRequestDetails.status
      }

      // Create a new instance of Property model and save it to blockchain
			let property = Property.createInstance(newPropertyObject);
			await ctx.propertyUtils.addProperty(property);

      return property;

    } else {
      throw new Error('Invalid Property Request Id ' + propertyId + '. A Property Request with this ID does not exist.');
    }

  }

  /**
   * Get a User details from the blockchain
   * @param ctx - The transaction context
   * @param name - name of the user for which to fetch details
   * @param aadharNo - aadhar No for which to fetch details
   * @returns
   */
  async viewUser(ctx, name, aadharNo) {
    // Create the composite key required to fetch record from blockchain
    const userRequestKey = User.makeKey([name, aadharNo]);

    // Return value of user Request from blockchain
    return await ctx.userUtils
        .getUser(userRequestKey)
        .catch(err => console.log(err));

  }


  /**
   * Get a Property details from the blockchain
   * @param ctx - The transaction context
   * @param name - name of the user for which to fetch details
   * @param aadharNo - aadhar No for which to fetch details
   * @returns
   */
  async viewProperty(ctx, propertyId) {
    // Create the composite key required to fetch record from blockchain
    const propertyKey = Property.makeKey([propertyId]);

    // Return value of user Request from blockchain
    return await ctx.propertyUtils
        .getProperty(propertyKey)
        .catch(err => console.log(err));

  }
}

module.exports = RegistrarContract;
