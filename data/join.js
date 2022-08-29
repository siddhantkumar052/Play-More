const mongoCollections = require('../config/mongoCollections');
const host = mongoCollections.host;
const hostData = mongoCollections.hostData;
const playground = mongoCollections.playground;
const { ObjectId } = require('mongodb');
const validation = require('./validation');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const hostD = require('./hostData');



let exportedMethods = {
    async updatePlayers(id, players) {

        const hostCollection = await hostData();

        let doc = await hostD.get(id);
        doc.players.push(players);
        const updateHost = {
            playgroundName: doc.playgroundName,
            players: doc.players,
            location: doc.location
        };

        const updatedInfo = await hostCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updateHost }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update hosted game successfully';
        }

        return await hostD.get(id);
    }


};

module.exports = exportedMethods;