import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const Following = () => {
    const [data, setData] = useState(null)

    async function fetchCharities() {
        try {
            const response = await fetch("/api/user/get_following_charities", {
                method: "GET",
                headers: { token: localStorage.getItem("token") }
            })

            const parseRes = await response.json()
            console.log(parseRes)
            setData(parseRes)
            console.log(extractData(parseRes))
        } catch (err) {
            console.error(err.message);
        }
    }


    // [] - only runs this on the first time the page is rendered
    useEffect(() => {
        fetchCharities()
    }, [])

    const extractData = (data) => {
        let n = data.charity_ids.length
        let charities = []
        for (let i = 0; i < n; i++) {
            let charity = { id: data.charity_ids[i], name: data.charity_names[i], website: data.websites[i], twitter_link: data.twitter_links[i] }
            charities.push(charity)
        }
        return charities;
    }


    return (
        <div className="px-5 bg-stone-100 min-h-screen text-black align-middle justify-center">
            <div className="py-10 mx-40">
                <h1 className="text-3xl font-bold pb-10">Charities You Follow</h1>
                {data && extractData(data).length > 0 ? <ol type="1" className="flex flex-col justify-start">
                    {data && extractData(data).map((d) => (
                        <FollowingResult key={d.id} id={d.id} name={d.name} website={d.website} twitter_link={d.twitter_link} function={fetchCharities} />
                    ))}
                </ol> : <NoFollowing/>}
            </div>

        </div>
    )
}

const NoTwitterFound = (props) => {
    return (
        <div className="w-[1000px] font-bold text-3xl">
            <h1>No Twitter Link available</h1>
        </div>
    )
}

const NoFollowing = (props) => {
    return (
        <div className="font-bold text-3xl">
            <h1>You don't follow any charities yet</h1>
        </div>
    )
}



const FollowingResult = (props) => {
    const onClickUnfollow = async (e) => {
        e.preventDefault()
        try {
            console.log(JSON.stringify({charity_id: props.id}))
            const response = await fetch("/api/user/unfollow_charity", {
                method: "POST",
                headers: { token: localStorage.getItem("token"), "Content-Type" : "application/json" },
                body: JSON.stringify({charity_id: props.id})
            })

            const parseRes = await response.json()
            toast(parseRes)
            props.function()
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <div className="bg-white p-10 my-5 shadow-lg rounded-xl">
        <h1 className="text-3xl">{props.name}</h1>
        <h1 className="text-xl py-5"><a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"//" + props.website}>{props.website}</a></h1>
        <button className="p-3 mb-5 font-bold border hover:text-white rounded-lg hover:bg-blue-500 duration-300"><a href={"/charities?id=" + props.id} className="py-3">Learn more</a></button>
        <button onClick={onClickUnfollow} className="p-3 mx-5 mb-5 font-bold border hover:text-white rounded-lg hover:bg-red-500 duration-300">Unfollow</button>
        <div className="mb-10">
            {props.twitter_link ? <TwitterTimelineEmbed
                sourceType="profile"
                screenName={props.twitter_link.split(".com/")[1]}
                options={{ height: 400, width: 1000 }}
                noHeader={true}
            /> : <NoTwitterFound />}
        </div>


    </div>
    );
}

export default Following;
