const { ObjectId } = require("mongodb");
const { playground: Playground, playground } = require('../config/mongoCollections');
const validation = require('./validation');

let exportedMethods = {
    async createPlayground(playgroundName, schedule, amenities, playgroundSize, location, imageData) {

        playgroundName = validation.checkString(playgroundName, 'Playground Name');
        schedule = validation.checkString(schedule, 'Schedule');
        // if (typeof amenities == "string") {
        //     amenities = amenities.split(" ")
        //     amenities = validation.checkArray(amenities, 'Amenities');
        // } else {
        //     amenities = validation.checkArray(amenities, 'Amenities');
        // }
        playgroundSize = validation.checkString(playgroundSize, 'Playground size');
        location = validation.checkString(location, 'location');

        const playgroundsCollection = await playground();


        let newPlaygrounddata = {
            playgroundName: playgroundName,
            schedule: schedule,
            amenities: amenities,
            playgroundSize: playgroundSize,
            location: location,
            image: imageData

        }
        const playGroundExists = await playgroundsCollection.findOne({ playgroundName: playgroundName });
        if (playGroundExists) throw "There is already a user with that username";

        const insertInfo = await playgroundsCollection.insertOne(newPlaygrounddata);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw 'Could not add playground';

        const newId = insertInfo.insertedId.toString();

        return { userInserted: true };
    },

    async getPlaygroundById(pId) {
        pId = validation.checkId(pId)
        const playgroundCollection = await playground();
        const play = await playgroundCollection.findOne({ _id: ObjectId(pId) });
        if (play === null) throw 'No playground with that id';
        play._id = play._id.toString();
        return play;
    },
    async searchdata(searchData) {
        searchData = validation.checkString(searchData)
        const playgroundCollection = await playground();
        const Userslist = await playgroundCollection.find({}).toArray();
        const data = Userslist.filter(u => u.playgroundName.toLowerCase().includes(searchData.toLowerCase()))
        if (data === null) throw 'No playground with that id';
      
        for (let i = 0; i < data.length; i++) {

            data[i]._id = data[i]._id.toString();
        }
        return data;
    },

    async remove(pId) {
        pId = validation.checkId(pId)
        const playgroundCollection = await playground();
        const deletionInfo = await playgroundCollection.deleteOne({ _id: ObjectId(pId) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete host with id of ${pId}`;
        }
        const output = " has been successfully deleted!";

        return output;

    },

    async update(id, playgroundName, schedule, amenities, playgroundSize, location) {
        
        
        id = validation.checkId(id)
        playgroundName = validation.checkString(playgroundName, 'Playground Name');
        schedule = validation.checkString(schedule, 'Schedule');
        amenities = validation.checkArray(amenities, 'Amenities');
        playgroundSize = validation.checkString(playgroundSize, 'Playground size');
        location = validation.checkString(location, 'location');

        const playgroundCollection = await Playground();
        
        let doc = await this.getPlaygroundById(id);
        const updated = {
            playgroundName: playgroundName,
            schedule: schedule,
            amenities: amenities,
            playgroundSize: playgroundSize,
            playgroundSize: playgroundSize,
            location: location
        };
        let parsedId = ObjectId(id);
        const upPlay = await playgroundCollection.findOne({ _id: parsedId });
        if (upPlay == null) {
            throw "Error: No playground found with this id"
        }

        let updateInfo = await playgroundCollection.updateOne({ _id: parsedId }, { $set: updated });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Error: Update failed";
        }
    },

}

module.exports = exportedMethods;