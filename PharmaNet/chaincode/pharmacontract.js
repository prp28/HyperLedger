'use strict';

const {Contract, Context} = require('fabric-contract-api');

const Company = require('./lib/models/company.js');
const CompanyUtils = require('./lib/utils/companyUtils.js');
// const User = require('./lib/models/user.js');
// const UserUtils = require('./lib/utils/userUtils.js');
// const PropertyRequest = require('./lib/models/propertyrequest.js');
// const PropertyRequestUtils = require('./lib/utils/propertyRequestUtils.js');
// const Property = require('./lib/models/property.js');
// const PropertyUtils = require('./lib/utils/propertyUtils.js');


class PharmanetContext extends Context {
	constructor() {
		super();
		// Add various model utils to the context class object
		// this : the context instance
		this.companyUtils = new CompanyUtils(this);
		// this.userUtils = new UserUtils(this);
		// this.propertyRequestUtils = new PropertyRequestUtils(this);
		// this.propertyUtils = new PropertyUtils(this);
	}
}

class Pharmacontract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.pharmanet');
	}

	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new PharmanetContext();
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Pharmanet Smart Contract Instantiated');
	}

	/**
	 * Create a Request for new User on network
	 * @param ctx - The transaction context object
	 * @param studentId - ID to be used for creating a new student account
	 * @param name - Name of the student
	 * @param email - Email ID of the student
	 * @returns
	 */


	async registerCompany(ctx, companyCRN, companyName, location, organisationRole) {

		// Create a new composite key for the new user Request
		const companyKey = Company.makeKey([companyCRN, companyName]);
		console.log(ctx.clientIdentity.getMSPID());

		// Fetch UserRequest with given ID from blockchain
		let existingUserRequest = await ctx.companyUtils
				.getCompanyDetails(companyKey)
				.catch(err => console.log('Provided user id is unique!'));

		if (existingUserRequest !== undefined) {
			throw new Error('Invalid Company Id: ' + companyCEN + '-' + companyName + '. A company with this ID already exists.');
		} else {
			
			let hierarchyKey = 0;
			if(organisationRole  == 'Manufacturer'){
				hierarchyKey = 1
			} else if (organisationRole == 'Distributor'){
				hierarchyKey = 2
			} else if (organisationRole == 'Retailer'){
				hierarchyKey = 3
			}
			
			// Create a Request object for User to be stored in blockchain
			let companyObj = {
				crn: companyCRN,
				companyId: companyCRN + "-" + companyName,
				name: companyName,
				location: location,
				organisationRole:organisationRole,
				hierarchyKey: hierarchyKey
			};

			// Create a new instance of Request User model and save it to blockchain
			let newUserRequest = Company.createInstance(companyObj);
			await ctx.companyUtils.addCompanyDetails(newUserRequest);
			// Return value of new Request account created to user
			return newUserRequest;
		}
	}

	/**
	 * Get a User details from the blockchain
	 * @param ctx - The transaction context
	 * @param name - name of the user for which to fetch details
	 * @param aadharNo - aadhar No for which to fetch details
	 * @returns
	 */
	async addDrug (ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {


		if(ctx.clientIdentity.getMSPID() !== 'manufacturerMSP'){
			throw new Error("Only Manufactuer can add drug")
		}
		// Create the composite key required to fetch record from blockchain
		const userRequestKey = User.makeKey([name, aadharNo]);

		// Return value of user Request from blockchain
		return await ctx.userUtils
				.getUser(userRequestKey)
				.catch(err => console.log(err));

	}


	// async rechargeAccount(ctx, name, aadharNo, bankTxnId) {

	// 	if(bankTxnId ==  'upg100' || bankTxnId == 'upg500' || bankTxnId == 'upg1000'){

	// 		let upgradCoins = 0;

	// 		if (bankTxnId == 'upg100'){
	// 			upgradCoins = 100;
	// 		} else if(bankTxnId == 'upg500'){
	// 			upgradCoins = 500;
	// 		} else{
	// 			upgradCoins = 1000;
	// 		}

	// 		// Create the composite key required to fetch record from blockchain
	// 		const userKey = User.makeKey([name, aadharNo]);

	// 		// Return value of user from blockchain
	// 		let userDetails = await ctx.userUtils.getUser(userKey)
	// 				.catch(err => console.log("Error: " + err));

	// 		if(userDetails !== undefined){

	// 			upgradCoins = userDetails.upgradCoins + upgradCoins;

	// 			let updateUser = {

	// 				name: userDetails.name,
	// 				email: userDetails.email,
	// 				createdAt: userDetails.createdAt,
	// 				aadharNo: userDetails.aadharNo,
	// 				phone: userDetails.phone,
	// 				upgradCoins: upgradCoins

	// 			}

	// 			let newUser = User.createInstance(updateUser);
	// 			await ctx.userUtils.addUser(newUser);

	// 			return newUser;

	// 		} else {
	// 			throw new Error("User with given " + name + '-' + aadharNo + 'does not exist!');
	// 		}

	// 	} else {
	// 		throw new Error('Invalid Bank Transaction Id: ')
	// 	}
	// }


	// async propertyRegistrationRequest(ctx, name, aadharNo, propertyId, price, status){

	// 	// Create the composite key required to fetch record from blockchain
	// 	const userKey = User.makeKey([name, aadharNo]);

	// 	// Return value of user from blockchain
	// 	let userDetails = await ctx.userUtils.getUser(userKey)
	// 			.catch(err => console.log("Error: " + err));

	// 	if(userDetails !== undefined){

	// 		let owner = name + ":" + aadharNo;
	// 		let propertyRequest = {
	// 			propertyId: propertyId,
	// 			owner: owner,
	// 			price: parseInt(price),
	// 			status: status,

	// 		};

	// 		let newPropertyRequest = PropertyRequest.createInstance(propertyRequest);
	// 		console.log("hereee");
	// 		await ctx.propertyRequestUtils.addPropertyRequest(newPropertyRequest);
	// 		return newPropertyRequest;

	// 	} else {
	// 		throw new Error("Property cannot be registered." + "User with given " + name + ':' + aadharNo + "does not exist!");
	// 	}
	// }


	// async updateProperty(ctx, propertyId, name, aadharNo, status){

	// 	// Create the composite key required to fetch record from blockchain
	// 	const userKey = User.makeKey([name, aadharNo]);

	// 	// Return value of user from blockchain
	// 	let userDetails = await ctx.userUtils.getUser(userKey)
	// 			.catch(err => console.log("Error: " + "User does not exist for given Id " + name + ":" +  aadharNo));

	// 	if (userDetails!==undefined) {

	// 		// Create the composite key required to fetch record from blockchain
	// 		const propertyKey = Property.makeKey([propertyId]);

	// 		// Return value of property from blockchain
	// 		let propertyDetails = await ctx.propertyUtils
	// 				.getProperty(propertyKey)
	// 				.catch(err => console.log("Error: " + "Property Id + "+ propertyId + " Does not exist"));

	// 		if (propertyDetails !== undefined) {

	// 			if(propertyDetails.owner === (name + ":" + aadharNo)) {

	// 				let propertyObject = {
	// 					propertyId: propertyDetails.propertyId,
	// 					owner: propertyDetails.owner,
	// 					price: propertyDetails.price,
	// 					status: status,
	// 				};

	// 				// Create a new instance of Property model and save it to blockchain
	// 				let updatedProperty = Property.createInstance(propertyObject);
	// 				// console.log("here11");
	// 				await ctx.propertyUtils.addProperty(updatedProperty);

	// 				return updatedProperty;
	// 			}
	// 			else {

	// 				throw new Error("Property status cannot be updated. It does not belong to Owner  " + name +":" + aadharNo);

	// 			}
	// 		}
	// 	}

	// }

	// async purchaseProperty(ctx, propertyId, name, aadharNo){

	// 	const propertyKey = Property.makeKey([propertyId]);

	// 	// Return value of property from blockchain
	// 	let propertyDetails = await ctx.propertyUtils
	// 			.getProperty(propertyKey)
	// 			.catch( err=>{
	// 				console.log(err);
	// 				throw new Error("Error: " + "Property Id + "+ propertyId + " Does not exist");
	// 			});

	// 	// Create the composite key required to fetch record from blockchain
	// 	const userKey = User.makeKey([name, aadharNo]);

	// 	// Return value of user from blockchain
	// 	let userDetails = await ctx.userUtils.getUser(userKey)
	// 					.catch(err => {
	// 						console.log(err);
	// 						throw new Error("Error: " + "User does not exist for given Id " + name + ":" +  aadharNo);
	// 					});

	// 	if(propertyDetails !== undefined && userDetails !== undefined ){

	// 		if(propertyDetails.status === 'onSale'){

	// 			if(propertyDetails.price < userDetails.upgradCoins){

	// 				let updatedUserDetails = {
	// 					name: userDetails.name,
	// 					email: userDetails.email,
	// 					createdAt: userDetails.createdAt,
	// 					aadharNo: userDetails.aadharNo,
	// 					phone: userDetails.phone,
	// 					upgradCoins: userDetails.upgradCoins - propertyDetails.price
	// 				}

	// 				let newUser = User.createInstance(updatedUserDetails);
	// 				await ctx.userUtils.addUser(newUser);

	// 				let updatedPropertyObject = {
	// 					propertyId: propertyDetails.propertyId,
	// 					owner: name + ":" + aadharNo,
	// 					price: propertyDetails.price,
	// 					status: 'registered',
	// 				}

	// 				// Create a new instance of Property model and save it to blockchain
	// 				let updatedProperty = Property.createInstance(updatedPropertyObject);
	// 				await ctx.propertyUtils.addProperty(updatedProperty);

	// 				return updatedProperty

	// 			} else{

	// 				throw new Error("Insufficient Balance. Please recharge Account");
	// 			}

	// 		} else {
	// 			throw new Error("Property: " + propertyId + "is not out for Sale");
	// 		}

	// 	}

	// }

}



module.exports = Pharmacontract;
