const pool = require("../database/db-driver")
const queries = require("../database/queries")


const local_auths_in_london = ["Barking And Dagenham",
        "Barnet",
        "Bexley",
        "Brent",
        "Bromley",
        "Camden",
        "City Of London",
        "City Of Westminster",
        "Croydon",
        "Ealing",
        "Enfield",
        "Greenwich",
        "Hackney",
        "Hammersmith And Fulham",
        "Haringey",
        "Harrow",
        "Havering",
        "Hillingdon",
        "Hounslow",
        "Islington",
        "Kensington And Chelsea",
        "Kingston Upon Thames",
        "Lambeth",
        "Lewisham",
        "Merton",
        "Newham",
        "Redbridge",
        "Richmond Upon Thames",
        "Southwark",
        "Sutton",
        "Tower Hamlets",
        "Waltham Forest",
        "Wandsworth",
        "Throughout London"]


// get all charities
const getCharities = (req, res) => {
    pool.query(queries.getAllCharitiesWithTags, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    })

}

// get a single charity
const getCharity = async (req, res) => {
    console.log(req.params);
    const id = req.params.id.slice(1)
    pool.query(queries.getCharityDetails(id), (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    })
}

const filterCharities = async (req, res) => {
    const filters = req.params.name.slice(1).split("!!").map((f)=> f.toLowerCase())
    let newFilters = filters
    if (filters.includes("london")) {
        console.log("present")
        newFilters = newFilters.concat(local_auths_in_london.map((a)=> a.toLowerCase()))
        console.log(newFilters)
    }
    const locations = (await pool.query("SELECT area_of_operation FROM area_of_operation")).rows.map((l)=> l.area_of_operation.toLowerCase())
    const tags = (await pool.query("SELECT name FROM tags")).rows.map((t)=> t.name.toLowerCase())
    const locationFilters = newFilters.filter(value => locations.includes(value))
    const tagFilters = newFilters.filter(value => tags.includes(value))
    const otherFilters = newFilters.filter(value => !tagFilters.includes(value) && !locationFilters.includes(value))
    // console.log(locationFilters)
    // console.log(tagFilters)
    // console.log(otherFilters)
    pool.query(queries.filterSearch2(newFilters, locationFilters, tagFilters, otherFilters), (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    })
    // pool.query(queries.getAllCharitiesWithTags, (error, results) => {
    //     if (error) throw error;
    //     res.status(200).json(results.rows)
    // })
}



module.exports = {
    getCharities,
    getCharity,
    filterCharities
}