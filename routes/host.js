
const express = require('express');
const router = express.Router();
const data = require('../data');
const hostData = data.host;
const createHostData = data.hostData;


router.get('/', async (req, res) => {

    try {

       
        const playgrounds = await hostData.getallplayground();
      
        res.render('host', {
            title: "Host", playgrounds: playgrounds,
            userLoggedIn: true
        })

    } catch (e) {
        res.status(500);
    }
});

router.get('/allhostlist', async (req, res) => {

    try {

       
        const hostingData = await createHostData.getAllHostData();
       
        res.render('allHostList', {
            title: "Hostlist", Host: hostingData,
            userLoggedIn: true
        })

    } catch (e) {
        res.status(500);
    }
});


router.get('/allhostlist/:id', async (req, res) => {

    try {
       
        const hostData = await createHostData.get(req.params.id);
        console.log(hostData)
        
        res.render("joinHostData", {
            hostData, title: hostData.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/hostlist', async (req, res) => {

    try {
       
        const userid = req.session.userID;
        const hostingData = await createHostData.getAll(userid.userId);
       
        res.render('hostlist', {
            title: "Hostlist", Host: hostingData,
            userLoggedIn: true
        })

    } catch (e) {
        res.status(500);
    }
});

router.get("/playground/:id", async (req, res) => {
    try {
        
        const playgrounds = await hostData.getPlaygroundById(req.params.id);
        
        
        res.render("create_host", {
            playgrounds, title: playgrounds.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/hostlist/:id", async (req, res) => {
    try {
       
        const hostData = await createHostData.get(req.params.id);
       
        res.render("hostView", {
            hostData, title: hostData.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/hostlist/:id/edit", async (req, res) => {
    try {
       
        const hostData = await createHostData.get(req.params.id);
     
        res.render("hostEdit", {
            hostData, title: hostData.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/hostlist/:id/edit", async (req, res) => {


    const playgroundName = req.body.playgroundName;
    const schedule = req.body.schedule;
    const playgroundSize = req.body.playgroundSize;
    const location = req.body.location;
    const amenities = req.body.amenities.split(" ");

    try {
        const updatePlayground = await createHostData.update(req.params.id, playgroundName, schedule, amenities, playgroundSize, location);
      
        res.redirect('/host/hostlist')
    
    } catch (e) {
        res.status(400);
        res.redirect(`/host/hostlist/${req.params.id}/edit`)


    }
});
router.post('/hostlist/:id/delete', async (req, res) => {

    try {

        const deletedAlbum = await createHostData.remove(req.params.id);

      
        res.redirect('/host/hostlist')

    } catch (e) {

        res.status(400);
        res.redirect('/host/hostlist')
    }
});

router.post('/createHost/:id', async (req, res) => {
    try {


        const userid = req.session.userID;


        const check = await createHostData.checksameplygroundCreate(req.params.id);

        if (!check) throw "You already hosted this plyground!"

        const playgrounds = await hostData.getPlaygroundById(req.params.id);

        
        const time = req.body['time'];
        const sportsname = req.body['sportsname'];

        const respData = await createHostData.createHost(userid.userId, req.params.id, playgrounds.playgroundName, playgrounds.schedule, playgrounds.amenities, playgrounds.playgroundSize, playgrounds.location, playgrounds.imageData,time,sportsname);

       
        res.render('create_host', {
            success: true, playgrounds, title: playgrounds.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });

    } catch (e) {

        const playgrounds = await hostData.getPlaygroundById(req.params.id);
        res.status(400);
        res.render('create_host', {
            error: e, playgrounds, title: playgrounds.playgroundName, user: req.session.user,
            userLoggedIn: req.session.user ? true : false
        });
    }

});

module.exports = router;