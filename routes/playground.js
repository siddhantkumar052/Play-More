const playground = require("../data/playground");
const search = require("../data/search");
const HostedGame = require("../data/host");
const Comments = require("../data/comment");
const { Router } = require("express");
const validation = require("../data/validation");
var fs = require("fs");
var path = require("path");
const router = Router();


router.post("/search", async (req, res) => {
  try {

    const searchdata = req.body['search'];
    const playgrounds = await playground.searchdata(searchdata);

    res.render("playground", {
      playgrounds: playgrounds,
      title: "Play More",
      user: req.session.user,
      userLoggedIn: true
    });
  } catch (error) {
    res.status(500).render("playground", { error: error.message });
  }
});
//route on click or select of playground
router.post("/playground", async (req, res) => {
  try {
    const playgrounds = await search.filterPlaygrounds();

    const username = req.body['username'];
    const password = req.body['password'];
    
    if (username == "admin" && password == "Admin123") {
      res.render("playground", {
        playgrounds: playgrounds,
        title: "Play More",
        user: req.session.user,
        userLoggedIn: true
      });
    } else {
      res.render('admin', { error: "AdminId and Password is wrong!" })
    }


  } catch (error) {
    res.status(500).render("admin", { error: error.message });
  }
});

router.get("/playground", async (req, res) => {
  try {
    const playgrounds = await search.filterPlaygrounds();

    res.render("playground", {
      playgrounds: playgrounds,
      title: "Play More",
      user: req.session.user,
      userLoggedIn: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/playground/add", async (req, res) => {
  try {
    res.render("addplayground", { title: "ADD PLAYGROUND", userLoggedIn: true });
  } catch (e) {
    status(500).json({ error: error.message });
  }
});


var multer = require('multer');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});

var upload = multer({ storage: storage });

router.post('/playground/add', upload.single('image'), async (req, res) => {
  try {
    console.log("hhhh")
    const playgroundName = validation.checkString(req.body.playgroundName, "Playground name");
    const schedule = validation.checkString(req.body.schedule, "Schedule");
    const playgroundSize = validation.checkString(req.body.playgroundSize, "Playground size");
    const location = validation.checkString(req.body.location, "Location");
    const amenities = req.body.amenities;//validation.checkArray(req.body.amenities, "Amenities");

    
    // if (req.file.filename.includes('.jpg')) {
      const imageData = 'http://localhost:3000/public/images/' + req.file.filename;
    // } else {
    //   const imageData = 'http://localhost:3000/public/images/' + req.file.filename + ".jpg";
    // }
   
    const respData = await playground.createPlayground(playgroundName, schedule, amenities, playgroundSize, location, imageData);
    console.log(respData)
    res.redirect('/playground');

  } catch (error) {
    res.status(500).render("addplayground", { title: "ADD PLAYGROUND", userLoggedIn: true, error: error });
  }
});

router.get("/playground/:id/edit", async (req, res) => {
  try {
    const playgrounds = await playground.getPlaygroundById(req.params.id);

    res.render("editplayground", {
      playgrounds,
      title: playgrounds.playgroundName,
      user: req.session.user,
      userLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/playground/:id/edit", async (req, res) => {
  try {
    const playgroundName = req.body.playgroundName;
    const schedule = req.body.schedule;
    const playgroundSize = req.body.playgroundSize;
    const location = req.body.location;
    const amenities = req.body.amenities.split(" ");

    const updatePlayground = await playground.update(
      req.params.id,
      playgroundName,
      schedule,
      amenities,
      playgroundSize,
      location
    );
    res.redirect('/playground');
  } catch (e) {
    if (e == "Error: No playground with this ID was found") {
      res.status(404).json({ error: e });
      return;
    }

    res.status(400).json({ error: e });
  }
});

router.get("/playground/:id", async (req, res) => {
  try {
    const playgrounds = await playground.getPlaygroundById(req.params.id);
    const comments = await Comments.getCommentsByPlaygroundId(req.params.id);
    res.render("viewplayground", {
      playgrounds, title: playgrounds.playgroundName, user: req.session.user, userId: req.session.userId,
      userLoggedIn: req.session.user ? true : false, admin: true,
      comments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/playground/:id/delete", async (req, res) => {
  try {
    const playgrounds = await playground.getPlaygroundById(req.params.id);

    res.render("deleteplayground", {
      playgrounds,
      title: playgrounds.playgroundName,
      user: req.session.user,
      userLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/playground/:id/delete", async (req, res) => {
  try {
    const deletedAlbum = await playground.remove(req.params.id);
    res.redirect("/playground");
  } catch (e) {
    res.status(400).redirect("/playground", { message: e });
  }
});

var multer = require("multer");
const { getUserByUsername } = require("../data/user");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

router.post("/playground/:id/comment", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }

    const comment = req.body.comment;
    const playgroundId = req.params.id;

    const user = await getUserByUsername(req.session.user.username);

    await Comments.addComment(user._id, playgroundId, comment);

    res.redirect(`/playground/${playgroundId}`);
  } catch (error) {

    res.status(500).redirect(`/playground/${playgroundId}`);
  }
});

router.get("/playground/:id/comment/:commentId/like", async (req, res) => {
  try {

    const playgroundId = req.params.id;
    const commentId = req.params.commentId;

    await Comments.likeComment(commentId);

    res.redirect(`/playground/${playgroundId}`);
  } catch (error) {
    res.status(500).redirect(`/playground/${playgroundId}`);
  }
});

router.get("/playground/:id/comment/:commentId/dislike", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }


    const playgroundId = req.params.id;
    const commentId = req.params.commentId;

    await Comments.dislikeComment(commentId);

    res.redirect(`/playground/${playgroundId}`);
  } catch (error) {
    res.status(500).redirect(`/playground/${playgroundId}`);
  }
});

module.exports = router;
