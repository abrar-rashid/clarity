import { useContext, useEffect, useState } from "react";
import { tagContext } from "../App";
import CharityResult from "../components/CharityResult";
import RecommendedResult from "../components/RecommendedResult";
import SmallCharityResult from "../components/SmallCharityResult";

const Home = () => {
    const { tags, setTags } = useContext(tagContext)
    const [top10Data, settop10Data] = useState(null)

    useEffect(() => {
        const fetchTrendingCharities = async () => {
            const response = await fetch('/api/charities/')
            const json = await response.json()

            if (response.ok) {
                console.log(json)
                settop10Data(json)
            }
        }
        fetchTrendingCharities()
        setTags([])
    }, [])

    return (
        <div className="bg-stone-100 text-black align-middle justify-center">
            <div className="px-5 py-10 text-black mx-40">
                <h1 className="text-3xl font-bold pb-5">Discover Small Charities</h1>
                <ol type="1" className="flex flex-wrap">
                    {top10Data && top10Data.map((d) => (
                        // Cycles through the array of returned charities using the organisation number as the key 
                        // and displays the charity name and registered charity number
                        <SmallCharityResult key={d.organisation_number} org_num={d.organisation_number} latest_income={d.latest_income} name={d.charity_name} tags={d.tags} reviews={d.reviews} star_rating={d.star_ratings} />
                    ))}
                </ol>
            </div>
            <div className="px-5 py-10 text-black mx-40">
                <h1 className="text-3xl font-bold pb-5">Trending Charities</h1>
                <ol type="1" className="flex flex-wrap">
                    {top10Data && top10Data.map((d) => (
                        // Cycles through the array of returned charities using the organisation number as the key 
                        // and displays the charity name and registered charity number
                        <CharityResult key={d.organisation_number} org_num={d.organisation_number} name={d.charity_name} tags={d.tags} reviews={d.reviews} star_rating={d.star_ratings} />
                    ))}
                </ol>
            </div>
        </div>

    )
}

export default Home;