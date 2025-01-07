const express = require('express')
const router = express.Router()
const {
    getCharities,
    getCharity,
    filterCharities
} = require('../controllers/CharityController')


router.get('/', getCharities)
// Search simply returns all charities at the moment
router.get('/search/:name', filterCharities)


module.exports = router