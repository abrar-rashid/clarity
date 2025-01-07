import {
    Card,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { numberFormatter } from "../pages/Charity";
import { useContext } from "react";
import { tagContext } from "../App";

function capitalizeFirstLetterOfEachWord(string) {
    return string.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}



const CharitySearchResult = (props) => {
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

    const url = "/charities?id=" + props.org_num
    const this_tags = props.tags
    return (
        <Card className="mt-6 w-[45%] border-2 p-2 mb-5 rounded-md">
            <CardBody className="">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    <li>{props.rank} {capitalizeFirstLetterOfEachWord(props.name)}</li>
                </Typography>
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
                    {/* <a href={"/search?query="+t}>{t} </a> */}
                </ul>
                {props.show_latest_income ?
                    <div className="pt-1 text-l font-bold">
                        <p>Latest Income: {numberFormatter.format(props.latest_income)}</p>
                    </div>
                    : null}
                {props.show_latest_expenditure ?
                    <div className="pt-1 text-l font-bold">
                        <p>Latest Expenditure: {numberFormatter.format(props.latest_expenditure)}</p>
                    </div>
                    : null}
                {props.show_volunteers ?
                    <div className="pt-1 text-l font-bold">
                        <p>Volunteers: {props.volunteers}</p>
                    </div>
                    : null}
                {props.show_employees ?
                    <div className="pt-1 text-l font-bold">
                        <p>Employees: {props.employees} </p>
                    </div>
                    : null}
                {props.show_star_ratings ?
                    <div className="pt-1 text-l font-bold">
                        <p className="">Avg Rating: {props.star_ratings != null ? Math.round((props.star_ratings.map(i => parseInt(i)).reduce((acc, n) => acc + n, 0) / props.star_ratings.length) * 10) / 10 + "/5" : "N/A"} <strong style={{ color: '#FEBF0F' }}>&#x2605;</strong> </p>
                    </div>
                    : null}
                {props.show_activities ?
                    <div className="pt-1 text-l">
                        <p><span className="font-bold">How are donations spent:</span> {props.activities} </p>
                    </div>
                    : null}

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


export default CharitySearchResult;