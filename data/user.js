const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');
const validation = require('./validation');
const bcrypt = require('bcrypt');
const saltRounds = 16;


let exportedMethods = {

    async createUser(firstname, lastname, username, email, password, confirm_password) {

        firstname = validation.checkString(firstname, 'First Name');
        lastname = validation.checkString(lastname, 'Last Name');
        username = validation.checkString(username, 'Username');
        email = validation.checkString(email, 'Email');
        var reWhiteSpace = new RegExp(/\s+/g);
        if (reWhiteSpace.test(username))
            throw `Space not valid in username`
        password = validation.checkPassword(password, 'Password');
        confirm_password = validation.checkPassword(confirm_password, 'Confirm Password');

        if (password !== confirm_password) {
            throw "Your password not match!"
        }

        const usersCollection = await user();

        const hash = await bcrypt.hash(password, saltRounds);
        var usernameLowerCase = username.toLowerCase();

        let newUserdata = {
            firatname: firstname,
            lastname: lastname,
            email: email,
            username: usernameLowerCase,
            password: hash
        };

        const userExists = await usersCollection.findOne({ username: usernameLowerCase });
        if (userExists) throw "There is already a user with that username";

        const insertInfo = await usersCollection.insertOne(newUserdata);
        
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw 'Could not create user';

        const newId = insertInfo.insertedId.toString();
        // const data = await this.get(newId);

        return { userInserted: true };
    },
    async checkUser(username, password) {

        username = validation.checkString(username, 'Username');
        password = validation.checkPassword(password, 'Password');

        var usernameLowerCase = username.toLowerCase();


        const usersCollection = await user();

        const userExists = await usersCollection.findOne({ username: usernameLowerCase });
        if (!userExists) throw "Either the username or password is invalid";

        comparePassword = await bcrypt.compare(password, userExists.password);
        if (!comparePassword) throw "Either the username or password is invalid";

        return { authenticated: true ,userId: userExists._id.toString()};
    },
    async getAll() {
        const usersCollection = await user();
        const Userslist = await usersCollection.find({}).toArray();
        if (!Userslist) throw 'Could not get all Users';

        for (let i = 0; i < Userslist.length; i++) {

            Userslist[i]._id = Userslist[i]._id.toString();
        }

        return Userslist;
    },
    async get(userId) {

        userId = validation.checkId(userId)
        const usersCollection = await user();
        const user = await usersCollection.findOne({ _id: ObjectId(userId) });
        if (user === null) throw 'No User with that id';

        user._id = user._id.toString();
        return user;
    }

};

module.exports = exportedMethods;