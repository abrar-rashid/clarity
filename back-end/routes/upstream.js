const express = require('express')
const { getMultiCharityAndOverview, addCharity, getCharityOverview, getCharityAofO } = require('../controllers/upstreamController')
const router = express.Router()
const pool = require("../database/db-driver")


//Returns an overview of information from a charity's most recently submitted Annual Return
router.get('/getCharityOverview/:id', getCharityOverview)
router.get('/getCharityAofO/:id', async (req, res) => {
    res.json("Successfull")
})



router.post('/addCharity/', addCharity)


// Getting details of multiple charities from API
router.get('/multi/:id', getMultiCharityAndOverview)




module.exports = router