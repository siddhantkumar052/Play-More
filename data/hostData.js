const mongoCollections = require('../config/mongoCollections');
const hostData = mongoCollections.hostData;
const { ObjectId } = require('mongodb');
const validation = require('./validation');

let exportedMethods = {
    async createHost(hostId, playgroundId, playgroundName, schedule, amenities, playgroundSize, location, imageData,time,sportsname) {

        hostId = validation.checkId(hostId)
        playgroundId = validation.checkId(playgroundId)
        playgroundName = validation.checkString(playgroundName, 'Playground Name');
        schedule = validation.checkString(schedule, 'Schedule');
        amenities = validation.checkArryString(amenities, 'Amenities')
        playgroundSize = validation.checkString(playgroundSize, 'Playground size');
        location = validation.checkString(location, 'location');
        time = validation.checkString(time, 'time');
        sportsname = validation.checkString(sportsname, 'sportsname');

        const hostDataCollection = await hostData();


        let newHostData = {
            hostId: hostId,
            playgroundId: playgroundId,
            playgroundName: playgroundName,
            schedule: schedule,
            amenities: amenities,
            playgroundSize: playgroundSize,
            location: location,
            image: imageData,
            time: time,
            sportsname: sportsname,
            players:[]
        };

        const insertInfo = await hostDataCollection.insertOne(newHostData);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw 'Could not add playground';

        const newId = insertInfo.insertedId.toString();


        return { userInserted: true };
    },
    async checksameplygroundCreate(id) {

        username = validation.checkId(id);

        const hostCollection = await hostData();

        const hostlist = await hostCollection.find({ playgroundId: id }).toArray();
        if (hostlist.length == 0) return true
        if (!hostlist) return true


        return false
    },
    async remove(pId) {
        pId = validation.checkId(pId)

        const hostCollection = await hostData();
        const deletionInfo = await hostCollection.deleteOne({ _id: ObjectId(pId) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete Host with id of ${pId}`;
        }
        const output = "Host data has been successfully deleted!";

        return output;

    }, async getAllHostData() {


        const hostCollection = await hostData();
        const hostlist = await hostCollection.find({}).toArray();
        if (!hostlist) throw 'Could not get all host';

        for (let i = 0; i < hostlist.length; i++) {

            hostlist[i]._id = hostlist[i]._id.toString();
        }
        return hostlist;
    },
    async getAll(hostid) {

        const hostCollection = await hostData();
        const hostlist = await hostCollection.find({ hostId: hostid }).toArray();
        if (!hostlist) throw 'Could not get all host';

        for (let i = 0; i < hostlist.length; i++) {

            hostlist[i]._id = hostlist[i]._id.toString();
        }

        return hostlist;
    },
    async get(id) {

        id = validation.checkId(id)

        const hostCollection = await hostData();
        const hostdata = await hostCollection.findOne({ _id: ObjectId(id) });
        if (hostdata === null) throw 'No host with that id';

        hostdata._id = hostdata._id.toString();
        return hostdata;
    },
    async update(id, playgroundName, schedule, amenities, playgroundSize, location) {
        const hostCollection = await hostData();

        id = validation.checkId(id)
        playgroundName = validation.checkString(playgroundName, 'Playground Name');
        schedule = validation.checkString(schedule, 'Schedule');
        amenities = validation.checkArryString(amenities, 'Amenities')
        playgroundSize = validation.checkString(playgroundSize, 'Playground size');
        location = validation.checkString(location, 'location');

        const updated = {
            playgroundName: playgroundName,
            schedule: schedule,
            amenities: amenities,
            playgroundSize: playgroundSize,
            location: location
        };
        let parsedId = ObjectId(id);
        const upPlay = await hostCollection.findOne({ _id: parsedId });
        if (upPlay == null) {
            throw "Error: No playground found with this id"
        }
        let updateInfo = await hostCollection.updateOne({ _id: parsedId }, { $set: updated });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Error: Update failed";
        }
        return true
    }

};

module.exports = exportedMethods;