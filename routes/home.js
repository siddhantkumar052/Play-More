const search = require("../data/search");
const Host = require("../data/host");
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const playgrounds = await search.filterPlaygrounds();

    res.render("home2", {
      playgrounds: playgrounds,
      title: "Play More",
      user: req.session.user,
      userLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.status(500).redirect('/',{ error: e });
  }
});

router.get("/home", async (req, res) => {
  try {
    const playgrounds = await search.filterPlaygrounds();

    res.render("home", {
      playgrounds: playgrounds,
      title: "Play More",
      user: req.session.user,
      userLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.status(500).redirect('/home',{ error: error });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const date = req.query.date;
    const searchTerm = req.query.search;
    const minPlaygroundSize = req.query.minPlaygroundSize;
    const maxPlaygroundSize = req.query.maxPlaygroundSize;
    const amenities = req.query.amenities;

    const playgrounds = await search.filterPlaygrounds({
      date,
      searchTerm,
      minPlaygroundSize,
      maxPlaygroundSize,
      amenities,
    });

    res.render("playground", {
      playgrounds: playgrounds,
      title: "Play More",
      user: req.session.user,
      userLoggedIn: req.session.user ? true : false,
      date,
      searchTerm,
      minPlaygroundSize,
      maxPlaygroundSize,
      amenities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
