const express = require('express')
const { loginUser, signupUser } = require('../controllers/userController')
const validCredentials = require("../middleware/validCredentials")
const authorisation = require("../middleware/authorisation")
const { getUserFollowingCharity } = require("../database/queries")
const pool = require('../database/db-driver')
const router = express.Router()


router.post('/login', validCredentials, loginUser)

router.post('/signup', validCredentials, signupUser)

router.get('/is-verified', authorisation, async (req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Server Error")
    }
})

router.get('/profile', authorisation, async (req, res) => {
    const user = await pool.query("SELECT * FROM users WHERE userid = $1", [req.user])
    try {
        res.json({
            name: user.rows[0].user_name,
            email: user.rows[0].email
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Server Error")
    }
})

router.get('/get_following_charities', authorisation, async (req, res) => {
    const user = await pool.query(getUserFollowingCharity(req.user))
    try {
        res.json(user.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
})

router.post('/follow_charity', authorisation, async (req, res) => {
    const { charity_id } = req.body

    // Check whether user already follows a that charity
    const subcribed = await pool.query("SELECT * FROM user_follow_charity WHERE userid= $1 AND charity_id=$2", [req.user, charity_id])

    if (subcribed.rowCount > 0) {
        return res.json("You already follow this charity")
    }
    const user = await pool.query("INSERT INTO user_follow_charity (userid, charity_id) VALUES ($1,$2) RETURNING *", [req.user, charity_id])
    try {
        res.json("Followed")
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
})

router.post('/unfollow_charity', authorisation, async (req, res) => {
    try {
        const { charity_id } = req.body
        const unfollow = await pool.query("DELETE FROM user_follow_charity WHERE userid=$1 AND charity_id=$2;", [req.user, charity_id])
        res.json("Unfollowed")
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
})

router.post('/submit_review', authorisation, async (req, res) => {
    try {
        const { charity_id, review, star_rating } = req.body
        console.log(charity_id, review, star_rating)
        const submit = await pool.query("INSERT INTO public.charity_reviews (charity_id, user_id, star_rating, review) VALUES ($1, $2, $3, $4);", [charity_id, req.user, star_rating, review])
        res.json("Review Submitted")
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
})


module.exports = router