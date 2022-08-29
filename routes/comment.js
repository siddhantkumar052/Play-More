const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;

router.get("/:id", async (req, res) => {
    try {
      const comment = await comments.getComment(req.params.id);
      res.status(200).render("comment", {commentText: comment.commentText})
    } catch (e) {
      res.status(404).json({ message: "Comment not found!" });
    }
});

router.get("/", async (req, res) => {
    try {
      const commentList = await comments.getAllComments();
      res.status(200).json(commentList)
    } catch (e) {
 
      res.status(404).send();
    }
});


router.post('/:commentId/like', async (req, res) => {

  try {
    await comments.likeComment(req.params.commentId);
    return res.redirect("/playground/" + req.body.playgroundId);
  } catch (error) {
    res.status(500).json({ error });
  }
})

router.post('/:commentId/dislike', async (req, res) => {
  try {
    await comments.dislikeComment(req.params.commentId);
    return res.redirect("/playground/" + req.body.playgroundId);
  } catch (error) {
    res.status(500).json({ error });
  }
})


router.post('/:playgroundId/add', async (req, res) => {
 	const commentVal = req.body.comment;
    try {
      addCommentOnReview = await comments.addComment(req.session.userID.userId, req.params.playgroundId, commentVal)
      if(addCommentOnReview){
        return res.redirect("/playground/" + req.params.playgroundId);
      } else {
        return res.status(404).send();
      }
    } catch (e) {
      res.status(500).redirect("/playground/" + req.params.playgroundId,{ error: e });
    }
});

router.get('/:playgroundId/:commentId/delete', async (req, res) => {
	if (!req.params.commentId) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
	try {
		await comments.getComment(req.params.commentId);
	} catch (e) {
		res.status(404).json({ error: 'Comment not found!' });
		return;
	}
	try {
    deleteCommentsFromReview = await comments.removeComment(req.params.commentId);
    if(deleteCommentsFromReview){
      return res.redirect("/playground/" + req.params.playgroundId);
    } else {
      return res.status(404).send();
    }
	} catch (e) {
		res.status(500).json({ error: e });
	}
});


module.exports = router;