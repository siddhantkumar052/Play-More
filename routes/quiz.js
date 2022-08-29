
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        res.render('quizMain', { title: "Quiz" })
    } catch (e) {
        res.sendStatus(500).redirect('/quiz');
    }
});
router.get('/game1', async (req, res) => {
    try {
        res.render('quiz', { title: "Quiz" })
    } catch (e) {
        res.sendStatus(500).redirect('/quiz');
    }
});
router.get('/game2', async (req, res) => {
    try {
        res.render('quiz2', { title: "Quiz" })
    } catch (e) {
        res.sendStatus(500).redirect('/quiz');
    }
});
router.get('/game3', async (req, res) => {
    try {
        res.render('quiz3', { title: "Quiz" })
    } catch (e) {
        res.sendStatus(500).redirect('/quiz');
    }
});
router.get('/game4', async (req, res) => {
    try {
        res.render('quiz4', { title: "Quiz" })
    } catch (e) {
        res.sendStatus(500).redirect('/quiz');
    }
});

module.exports = router;
