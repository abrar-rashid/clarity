const Pool = require("pg").Pool

// Reminder to deal with connection more safely
const pool = new Pool({
    host: "drp47-gp-db.cux6b0hitbqo.eu-west-2.rds.amazonaws.com",
    user: "drp47",
    port: "5432",
    password: "Drp47-ProjectDB",
    database: "drp47_db"
}) 

module.exports = pool