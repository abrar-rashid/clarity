const pool = require("../database/db-driver")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../jwtGenerator")

const signupUser =  async function (req, res) {
    try {
        const {name, email, password} = req.body

        const user = await pool.query("SELECT * FROM users WHERE email= $1", [email])
    
        if (user.rowCount > 0) {
            return res.status(401).json("User Already Exists")
        }
    
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);
    
        const newUser = await pool.query("INSERT INTO users (user_name, email, password) VALUES ($1,$2,$3) RETURNING *", [name, email, bcryptPassword]);
    
        const token = jwtGenerator(newUser.rows[0].userid)
        res.json({token})
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }


}

const loginUser =  async function (req, res) {
    try {
        const {email, password} = req.body
        const users = await pool.query("SELECT * FROM users WHERE email= $1", [email])
    
        if (users.rowCount === 0) {
            res.status(401).json("Incorrect Credentials")
        }
        const user = users.rows[0]
    
        const valid = await bcrypt.compare(password, user.password);
    
        if (!valid) {
            return res.status(200).json("Incorrect Credentials")
        }
    
        const token = jwtGenerator(user.userid)
        res.json({token})
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }


}

module.exports = {
    signupUser,
    loginUser
}