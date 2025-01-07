const getAllCharities = "Select * FROM charity"

const getAllCharitiesWithTags = `SELECT
charity.*,
array_agg(DISTINCT tags.name) AS tags,
array_agg(charity_reviews.star_rating) AS star_ratings,
array_agg(DISTINCT charity_reviews.review) AS user_reviews
FROM
charity_tags
INNER JOIN tags ON charity_tags.tag_id = tags.id
INNER JOIN charity ON charity_tags.charity_id = charity.organisation_number
LEFT JOIN charity_reviews ON charity_reviews.charity_id = charity.organisation_number
GROUP BY
charity.organisation_number;`

const getAllRelevantCharities = ((id) => `SELECT c.*, COALESCE(cr.star_ratings, '{NULL}') AS star_ratings, ARRAY_AGG(DISTINCT tags.name) AS tags
FROM charity c
INNER JOIN charity_tags ct ON ct.charity_id = c.organisation_number
LEFT JOIN (
  SELECT charity_id, ARRAY_AGG(star_rating) AS star_ratings
  FROM charity_reviews
  GROUP BY charity_id
) cr ON cr.charity_id = c.organisation_number
INNER JOIN (
  SELECT DISTINCT ct.tag_id
  FROM user_follow_charity ufc
  INNER JOIN charity_tags ct ON ct.charity_id = ufc.charity_id
  WHERE ufc.userid = '`+ id + `'
) user_tags ON user_tags.tag_id = ct.tag_id
INNER JOIN charity_tags ct2 ON ct2.tag_id = ct.tag_id AND ct2.charity_id <> c.organisation_number
INNER JOIN tags ON tags.id = ct2.tag_id
WHERE c.organisation_number NOT IN (
  SELECT charity_id
  FROM user_follow_charity
  WHERE userid = '`+ id + `'
)
GROUP BY c.organisation_number, cr.star_ratings;`)

const filterSearch = ((filters) => `
SELECT *
FROM (${getAllCharitiesWithTags.slice(0, -1)}) AS subquery
WHERE subquery.tags @> ARRAY[${filters.map(filter => `'${filter}'`).join(', ')}];
`)

function filterSearch2(filters, locationFilters, tagFilters, otherFilters) {
  return `SELECT * FROM (${getAllCharityDetails.slice(0, -1)}) as subquery
  WHERE 
	CASE
		WHEN (ARRAY[${otherFilters.map(filter => `'%${filter}%'`).join(', ')}]::text[]) = ARRAY[]::text[] THEN
			((lower(subquery.tags::text)::text[]) @> (ARRAY[${tagFilters.map(filter => `'${filter}'`).join(', ')}]::text[])
    		AND (((lower(subquery.areas::text)::text[]) @> ARRAY[${locationFilters.map(filter => `'${filter}'`).join(', ')}]::text[]) OR ((lower(subquery.areas::text)::text[]) && ARRAY[${locationFilters.map(filter => `'${filter}'`).join(', ')}]::text[])))
		WHEN ((ARRAY[${tagFilters.map(filter => `'${filter}'`).join(', ')}]::text[]) = ARRAY[]::text[] AND (ARRAY[${locationFilters.map(filter => `'${filter}'`).join(', ')}]::text[]) = ARRAY[]::text[]) THEN
			LOWER(charity_name) LIKE ANY (ARRAY[${otherFilters.map(filter => `'%${filter}%'`).join(', ')}]::text[])
		ELSE ((lower(subquery.tags::text)::text[]) @> (ARRAY[${tagFilters.map(filter => `'${filter}'`).join(', ')}]::text[])
    	AND (((lower(subquery.areas::text)::text[]) @> ARRAY[${locationFilters.map(filter => `'${filter}'`).join(', ')}]::text[]::text[]) OR ((lower(subquery.areas::text)::text[]) && ARRAY[${locationFilters.map(filter => `'${filter}'`).join(', ')}]::text[]::text[]))
    	AND LOWER(charity_name) LIKE ANY (ARRAY[${otherFilters.map(filter => `'%${filter}%'`).join(', ')}]::text[]))
	END;`
}




const getAllCharityDetails = `SELECT
charity.organisation_number as org_id,
charity.reg_charity_number,
charity.group_subsid_suffix,
charity.charity_name,
charity.charity_type,
charity.phone,
charity.email,
charity.web,
charity.twitter_link,
charity_overview.*,	
(SELECT array_agg(tags.name) FROM charity_tags
INNER JOIN tags ON charity_tags.tag_id = tags.id
WHERE charity_tags.charity_id = charity.organisation_number
) AS tags,
(
  SELECT ARRAY_AGG(area_of_operation) FROM charity_area_of_operation
	INNER JOIN area_of_operation ON area_of_operation.id = charity_area_of_operation.area_id
	WHERE organisation_number =charity.organisation_number
	GROUP BY organisation_number
) AS areas,
(
  SELECT json_agg(json_build_object('star_rating', charity_reviews.star_rating, 'review', charity_reviews.review, 'reviewer_name', users.user_name))
  FROM charity_reviews
  JOIN users ON charity_reviews.user_id = users.userid
  WHERE charity_reviews.charity_id = charity.organisation_number
) AS reviews_data
FROM
charity
INNER JOIN charity_overview ON charity_overview.organisation_number = charity.organisation_number
GROUP BY
charity_overview.organisation_number,
charity.organisation_number;`


const getCharityDetails = ((id) => `SELECT * FROM (${getAllCharityDetails.slice(0, -1)}) as subquery
WHERE subquery.org_id = '`+ id + `';`)

const getUserFollowingCharity = ((id) => `SELECT userid, 
array_agg(charity_id) charity_ids ,
array_agg(charity_name) charity_names,
array_agg(web) websites,
array_agg(twitter_link) twitter_links
FROM public.user_follow_charity
INNER JOIN charity ON charity.organisation_number=charity_id
WHERE userid = '`+ id + `' 
GROUP BY userid;`)



module.exports = {
  getAllCharities,
  getAllCharitiesWithTags,
  getCharityDetails,
  getUserFollowingCharity,
  filterSearch,
  filterSearch2,
  getAllRelevantCharities
}


// (
//   SELECT array_agg(charity_reviews.star_rating)
//   FROM charity_reviews
//   WHERE charity_reviews.charity_id = charity.organisation_number
// ) AS star_ratings,
// (
//   SELECT array_agg(charity_reviews.review)
//   FROM charity_reviews
//   WHERE charity_reviews.charity_id = charity.organisation_number
// ) AS reviews,
// (
//   SELECT array_agg(users.user_name)
//   FROM users
//   JOIN charity_reviews ON charity_reviews.user_id = users.userid
//   WHERE charity_reviews.charity_id = charity.organisation_number
// ) AS reviewer_names