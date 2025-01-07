const pool = require("../database/db-driver")
const format = require('pg-format');


const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

// get all charities
const getMultiCharity =  async function (req, res) {
    const charityNumber = req.params.id.slice(1)
    console.log(charityNumber)
    const url = 'https://api.charitycommission.gov.uk/register/api/charitydetailsmulti/'+charityNumber;
    const options = {method: 'GET',
    // Request headers
    headers: {
        'Ocp-Apim-Subscription-Key': 'a884f77512c3416681041fa4c308f700',}
    }

    fetch(url, options)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
    try {
        let response = await fetch(url, options);
        response = await response.json();
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: `Internal Server Error.`});
    }
}


const getMultiCharityAndOverview = async function (req, res) {
    const charityNumber = req.params.id.slice(1)
    console.log(charityNumber)
    const url = 'https://api.charitycommission.gov.uk/register/api/charitydetailsmulti/'+charityNumber;
    const options = {method: 'GET',
    // Request headers
    headers: {
        'Ocp-Apim-Subscription-Key': 'a884f77512c3416681041fa4c308f700',}
    }

    fetch(url, options)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
    try {
        let response = await fetch(url, options);
        response = await response.json();
        // Extract charityNumbers and subids from each returned element and pass it to getCharityOverview
        const detailsAndOverviews = []
        for (const element of response) {
            console.log(element["group_subsid_suffix"] + " and "+ element["reg_charity_number"])
            const newRes = {}
            newRes["details"] = []
            newRes["details"].push(element)
            const overviewInfo = await getCharityOverview(element["reg_charity_number"],element["group_subsid_suffix"] )
            newRes["charityOverview"] = []
            overviewInfo["organisation_number"] = element["organisation_number"]
            newRes["charityOverview"].push(overviewInfo)
            const queryTags = "SELECT * FROM tags"
            const tags = await pool.query(queryTags)
            newRes["tags"] = tags.rows
            console.log(newRes)
            detailsAndOverviews.push(newRes)
        }
        console.log(detailsAndOverviews)
        res.status(200).json(detailsAndOverviews);
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: `Internal Server Error.`});
    }
}


const addCharity = async function (req, res) {
    const body = req.body
    console.log(body)
    const details = body["details"][0]
    const overview = body["charityOverview"][0]
    const newTags = body["newTags"]
    const regularTags = body["tags"].map((t) => t.id)
    const charity_tag_pairs = regularTags.map((t)=> [details["organisation_number"], t])
    console.log(regularTags)
    console.log(charity_tag_pairs)
    const detailFields = Object.keys(details)
    const detailValues = Object.values(details)
    const overviewFields = Object.keys(overview)
    const overviewValues = Object.values(overview)
    const queryDetails = "INSERT INTO charity ("+detailFields.map(df =>df).join(', ')+") VALUES ("+[...Array.from({length:detailValues.length}, (_, i) => i + 1)].map(dv => '$'+dv).join(',')+")  RETURNING *";
    const queryOverview = "INSERT INTO charity_overview ("+overviewFields.map(df =>df).join(', ')+") VALUES ("+[...Array.from({length:overviewValues.length}, (_, i) => i + 1)].map(dv => '$'+dv).join(',')+")  RETURNING *";
    // Add newTag ids to the list of tag ids
    console.log(newTags.length)
    try{
        const newCharityDetails = await pool.query(queryDetails, detailValues)
        const newCharityOverview = await pool.query(queryOverview, overviewValues)
        let queryTags = ""
        if (newTags.length > 0) {
            const queryNewTags =  format("INSERT INTO tags(name) VALUES %L RETURNING id", newTags.split(",").map((a) => [a]));
            const newTags2 = await pool.query(queryNewTags)
            console.log(newTags2.rows.map((t) => t.id))
            const new_charity_tag_pairs = charity_tag_pairs.concat(newTags2.rows.map((t) => [details["organisation_number"], t.id]))
            console.log(new_charity_tag_pairs)
            queryTags =  format("INSERT INTO charity_tags(charity_id,tag_id) VALUES %L RETURNING *", new_charity_tag_pairs);            
        } else {
            queryTags =  format("INSERT INTO charity_tags(charity_id,tag_id) VALUES %L RETURNING *", charity_tag_pairs);
        }
        const addedTags = await pool.query(queryTags)
        console.log(addedTags.rows)
        console.log(newCharityDetails.rows)
        console.log(newCharityOverview.rows)
        // Add area of operation info
        await addCharityAreaOfOp(details["organisation_number"], details["reg_charity_number"])

        if (newCharityDetails.rowCount > 0 && newCharityOverview.rowCount > 0) {
            res.status(200).json("Sucessfully added charity")
        }
    } catch(e){
        console.log(e)
        res.status(500).json("Failed to add charity")
    } 
}

async function addCharityAreaOfOp(organisation_number, reg_charity_number) {
    const response = await getCharityAofO(reg_charity_number, 0);
    const charity_areas = []
    console.log("Registered Charity Number: "+reg_charity_number)
    console.log(response)
    for (area of response) {
        // const query = "INSERT INTO area_of_operation (area_of_operation, geographic_area_type) VALUES ($1) RETURNING *";
        // const newCharityDetails = await pool.query(query, [(area["area_of_operation"], area["geographic_area_type"])])
        const selectQuery = "SELECT id FROM area_of_operation WHERE area_of_operation = ($1)"
        const area_id = await pool.query(selectQuery, [area["area_of_operation"]])
        console.log(area_id.rows)
        charity_areas.push([organisation_number, area_id.rows[0]["id"]])
    }
    const insertQuery = format("INSERT INTO charity_area_of_operation(organisation_number, area_id) VALUES %L RETURNING *", charity_areas);
    const newCharityDetails = await pool.query(insertQuery)
    console.log(newCharityDetails.rows)
}

const getCharityOverview = async function (charityNumber, subid) {
    const url = 'https://api.charitycommission.gov.uk/register/api/charityoverview/'+charityNumber+'/'+subid;
    const options = {method: 'GET',
    // Request headers
    headers: {
        'Ocp-Apim-Subscription-Key': 'a884f77512c3416681041fa4c308f700',}
    }
    fetch(url, options)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
    try {
        let response = await fetch(url, options);
        response = await response.json();
        return response
    } catch (err) {
        console.log(err);
        return "Server Error"
    }
}

const getCharityAofO = async function (charityNumber, subid) {
    const url = 'https://api.charitycommission.gov.uk/register/api/charityareaofoperation/'+charityNumber+'/'+subid;
    const options = {method: 'GET',
    // Request headers
    headers: {
        'Ocp-Apim-Subscription-Key': 'a884f77512c3416681041fa4c308f700',}
    }
    fetch(url, options)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
    try {
        let response = await fetch(url, options);
        response = await response.json();
        return response
    } catch (err) {
        console.log(err);
        return "Server Error"
    }
}


module.exports = {
    getMultiCharity,
    getCharityOverview,
    getMultiCharityAndOverview,
    addCharity,
    getCharityAofO
}