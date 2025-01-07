const express = require('express')
const pool = require("../database/db-driver")
const queries = require("../database/queries")
const validCredentials = require("../middleware/validCredentials")
const authorisation = require("../middleware/authorisation")
const {
    getCharities,
    getCharity,
    getRelevantCharities,
} = require('../controllers/CharityController')
const { getAllRelevantCharities } = require('../database/queries')

const router = express.Router()

// Fetches the charities in charities collection
router.get('/', getCharities)

// router.get('/user-home', getRelevantCharities)

router.get('/user-home', authorisation, async (req, res) => {
    try {
        const user = await pool.query(getAllRelevantCharities(req.user))
        console.log(user.rows)
        res.json(user.rows)
        
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
})

router.get('/:id', getCharity)

// router.get('/multi/:id', getMultiCharity)


module.exports = router