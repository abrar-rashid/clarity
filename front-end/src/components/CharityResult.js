import {
    Card,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { numberFormatter } from "../pages/Charity";
import { useContext, useEffect } from "react";
import { tagContext } from "../App";
import { useNavigate } from "react-router-dom";

function capitalizeFirstLetterOfEachWord(string) {
    return string.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}



const CharityResult = (props) => {
    const { tags, setTags } = useContext(tagContext)

    const charity_id = props.org_num;

    const onClickFollow = async (e) => {
        e.preventDefault()
        try {
            console.log(JSON.stringify({ charity_id: charity_id }))
            const response = await fetch("/api/user/follow_charity", {
                method: "POST",
                headers: { token: localStorage.getItem("token"), "Content-Type": "application/json" },
                body: JSON.stringify({ charity_id: charity_id })
            })
            const parseRes = await response.json()
            toast(parseRes)
        } catch (err) {
            console.error(err.message);
        }
    }


    function addFilterSearch(filter) {
        if (!tags.includes(filter)) {
            setTags([...tags, filter])
        }
    }
    const navigate = useNavigate()
    useEffect(() => {
        if (tags.length > 0) {
            console.log(tags)
            // navigate("/search")
        }
    }, [tags])

    const url = "/charities?id=" + props.org_num
    const this_tags = props.tags
    let acc = 0;
    for (let i = 0; i < props.star_rating.length; i++) {
        acc = acc + parseInt(props.star_rating[i])
    }
    const avg = Math.round(((acc / props.star_rating.length) || 0) * 10) / 10
    if (avg < 4) {
        return false;
    }
    // if (!props.tags.includes("Children")) {
    //     return false;
    // }
    return (
        <Card className="mt-6 w-80 border-2 p-2 mx-2 mb-5 rounded-md">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    <li>{props.rank} {capitalizeFirstLetterOfEachWord(props.name)}</li>
                </Typography>
                <h1 className="font-bold text-l">Rating: {avg} <strong style={{ color: '#FEBF0F' }}>&#x2605;</strong> </h1>
                {this_tags ? <h1 className="font-bold text-l">Tags</h1> : ""}
                <ul className="flex flex-wrap pt-2">
                {this_tags?.map((t) =>
                        <li className="">
                            <div class="ml-0 m-2">
                                <span class="relative inline-block text-sm font-medium text-[#4169e1] rounded-lg group active:text-[#4169e1] focus:outline-none focus:ring">
                                    <span
                                        class="absolute inset-0 rounded-lg transition-transform translate-x-0.5 translate-y-0.5 bg-[#4169e1] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                                    <button className="relative block px-3 py-2 bg-[#ffffff] rounded-lg hover:bg-[#4169e1] hover:text-white ease-in-out duration-300 border border-current" onClick={() => addFilterSearch(t)}>{t}</button>
                                </span>
                            </div>
                        </li>)}
                </ul>
            </CardBody>
            <CardFooter className="py-3 flex flex-col font-bold text-blue-400 gap-2" >
                <div className="w-1/2 justify-start flex flex-row p-1">
                    <a href={url} className="inline-block pr-2">
                        Learn More
                    </a>
                    <ArrowLongRightIcon strokeWidth={2} className="w-5 h-5 pt-1" />
                </div>
                <div className="w-1/2 justify-end">
                    <button onClick={onClickFollow} className="p-1 px-2 border bg-[#4169e1] duration-300 text-white rounded-lg">Follow</button>
                </div>
            </CardFooter>
        </Card >
    )
}


export default CharityResult;