const { ObjectId } = require("mongodb")
const { comment: Comments } = require('../config/mongoCollections');
const validation = require('./validation');

const getCommentsByPlaygroundId = async (playgroundId) => {
    const commentsCollection = await Comments();
    const comments = await commentsCollection.find({ playgroundId: playgroundId }).sort({ likes: -1 }).toArray();
    return comments;
}

const addComment = async (userId, playgroundId, comment) => {
    const commentsCollection = await Comments();
    const newComment = await commentsCollection.insertOne({
        comment,
        playgroundId,
        userId,
        likes: 0,
        dislikes:0,
        createdAt: new Date(),
    });
    if (newComment.insertedCount === 0) throw "Could not add comment";
    const comments = await commentsCollection.find({ playgroundId: playgroundId }).sort({ likes: -1 }).toArray();
    return comments;
}

const likeComment = async (commentId) => {
    const commentsCollection = await Comments();
    const updatedComment = await commentsCollection.updateOne({
        _id: ObjectId(commentId)
    }, {
        $inc: {
            likes: 1
        }
    });
    if (updatedComment.modifiedCount === 0) throw "Could not like comment";
    return updatedComment;
}

const dislikeComment = async (commentId) => {
    const commentsCollection = await Comments();
    const updatedComment = await commentsCollection.updateOne({
        _id: ObjectId(commentId)
    }, {
        $inc: {
            dislikes: 1
        }
    });
    if (updatedComment.modifiedCount === 0) throw "Could not dislike comment";
    return updatedComment;
}

module.exports = {
    getCommentsByPlaygroundId,
    addComment,
    likeComment,
    dislikeComment
}