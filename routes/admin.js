
const express = require('express');
const router = express.Router();
const data = require('../data');
const adminData = data.admin;

router.get('/', async (req, res) => {
    try {
        res.render('admin', { title: "Admin" })
    } catch (e) {
        res.sendStatus(500).redirect('/admin',{error: e});
    }
});

router.post('/logout', function (req, res) {
    try {
        req.session.destroy();
        res.redirect('/')

    } catch (e) {
        res.status(400);
    }

});

module.exports = router;
