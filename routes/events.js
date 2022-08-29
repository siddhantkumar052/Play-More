const { createHostedGame, getAllHostedGames } = require("../data/host");
const { Router } = require("express");

const router = Router();

router.post("/event", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/user/login");
        }
        await createHostedGame({ ...req.body, players: req.body.players.map(player => ({ namme: player })) });
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/create-sport-event", async (req, res) => {
    try {
        res.render("sport-event", { title: "Sport Event", user: req.session.user, userLoggedIn: req.session.user ? true : false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/sport-event", async (req, res) => {
    try {
        const events = await getAllHostedGames();

        res.render("sportevents", { title: "Sport Events", user: req.session.user, userLoggedIn: req.session.user ? true : false, events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;