import React, { useState } from "react";
import { toast } from 'react-toastify';
import { Checkbox } from './Search'
import { numberFormatter } from "./Charity";

const AddCharity = () => {

    const [inputs, setInputs] = useState({
        reg_charity_num: "",
    })
    const [data, setData] = useState(null)
    const [show, setShow] = useState(null)
    const [val, setVal] = useState("")
    const [twitter, setTwitter] = useState("")


    const { reg_charity_num } = inputs



    const updateCheckStatus = index => {
        setShow(
            show.map((info, currentIndex) =>
                currentIndex === index
                    ? { ...info, checked: !info.checked }
                    : info
            )
        )
        console.log(show)
    }

    function setInitialTagBoxes(tags) {
        const res = []
        for (const tag of tags) {
            res.push({ name: tag["name"], checked: false, id: tag["id"] })
        }
        console.log(res)
        return res;
    }

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        console.log("Register charity Number: " + e.target.value)
    }

    function onChangeSetVal(e) {
        e.preventDefault()
        setVal(e.target.value)
        console.log(val)
    }

    function onChangeSetTwitter(e) {
        e.preventDefault()
        setTwitter(e.target.value)
        console.log("Twitter: " + twitter)
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        console.log("Register charity Number: " + reg_charity_num)
        console.log(inputs)
        try {
            const response = await fetch("/api/upstream/multi/:" + reg_charity_num, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const parseRes = await response.json()
            setData(parseRes[0])
            setShow(setInitialTagBoxes(parseRes[0]["tags"]))

            console.log(parseRes[0])

        } catch (error) {
            console.error(error.message)
        }
    }
    const onClickButton = async (e) => {
        e.preventDefault()
        const { charityOverview, details, tags } = data && data
        details[0]["twitter_link"] = twitter
        const body = { details: details, charityOverview: charityOverview, tags: show.filter((f) => f.checked === true), newTags: val }
        console.log(body)
        try {
            const response = await fetch("/api/upstream/addcharity/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const parseRes = await response.json()
            toast(parseRes)
            // console.log(parseRes)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div className="text-black px-5 align-middle justify-center mx-40">
            <div className=" py-10 text-black">
                <h1 className="text-3xl font-bold pb-5">Add a new Charity</h1>
                <form onSubmit={onSubmitForm}>
                    <div className="flex flex-col text-xl">
                        <div className="py-5">
                            <label className="pr-5" for="fname">Registered Charity Number</label>
                            <input onChange={e => onChange(e)} className="text-lg p-1 border-2 rounded-lg" type="text" id="reg_charity_num" name="reg_charity_num" />
                            <button type="submit" className="border mx-5 p-2 my-3 rounded-lg bg-blue-500 text-white">Fetch Charity</button>

                        </div>
                    </div>
                </form>
            </div>
            <div>
                <h1 className="text-3xl font-bold pb-5">API Data</h1>
                <p className="text-xl pb-5">Verify if this data is correct, if this is the case then proceed by clicking the "Add Charity" Button</p>
                {data && data ?
                    <APIResult
                        organisation_number={data && data["details"][0]["organisation_number"]}
                        charity_name={data && data["details"][0]["charity_name"]}
                        reg_charity_num={data && data["details"][0]["reg_charity_number"]}
                        group_subsid_suffix={data && data["details"][0]["group_subsid_suffix"]}
                        activities={data && data["charityOverview"][0]["activities"]}
                        latest_income={data && data["charityOverview"][0]["latest_income"]}
                        latest_expenditure={data && data["charityOverview"][0]["latest_expenditure"]}
                        volunteers={data && data["charityOverview"][0]["volunteers"]}
                        employees={data && data["charityOverview"][0]["employees"]}
                        trustees={data && data["charityOverview"][0]["trustees"]}
                        tags={show}
                        updateCheckStatus={updateCheckStatus}
                        val={val}
                        setVal={setVal}
                        onChangeSetVal={onChangeSetVal}
                        onChangeSetTwitter={onChangeSetTwitter}
                        onClickButton={onClickButton} /> :
                    <h2 className="text-2xl font-semibold pb-5">No Results</h2>
                }
            </div>
        </div>
    )
}

export default AddCharity;

const APIResult = (props) => {
    return (
        <div>
            <div className="text-xl py-5">
                <h2 className="text-2xl font-semibold pb-5">Charity Details Information</h2>
                <p>Charity Name: {props.charity_name}</p>
                <p>Organisation Number: {props.organisation_number}</p>
                <p>Registered Charity Number: {props.reg_charity_num}</p>
                <p>Group Subsidiary ID: {props.group_subsid_suffix}</p>
            </div>
            <div className="text-xl pb-5">
                <h2 className="text-2xl font-semibold pb-5">Charity Overview Information</h2>
                <p>How donations are spent: {props.activities}</p>
                <p>Latest Income: {numberFormatter.format(props.latest_income)}</p>
                <p>Latest Expenditure: {numberFormatter.format(props.latest_expenditure)}</p>
                <p>Volunteers: {props.volunteers ? props.volunteers : "N/A"}</p>
                <p>Employees: {props.employees ? props.employees : "N/A"}</p>
                <p>Trustees: {props.trustees ? props.trustees : "N/A"}</p>

            </div>
            <h2 className="text-2xl font-semibold">Additional Information</h2>
            <div className="text-xl py-2 flex flex-wrap">
                {props.tags.map((info, index) => (
                    <Checkbox
                        key={info.name}
                        isChecked={info.checked}
                        checkHandler={() => props.updateCheckStatus(index)}
                        label={info.name}
                        index={index}
                    />
                ))}
            </div>
            <div>
                <label
                    htmlFor="newTags"
                    className="block text-sm font-medium text-gray-700 undefined"
                >
                    Custom Tags:
                </label>
                <input
                    type="text"
                    placeholder="Tag1,Tag2"
                    className="w-1/2 py-1 px-5 my-2 text-gray-500 border rounded-full outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    name="newTags"
                    onChange={props.onChangeSetVal}
                />
                <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-700 undefined"
                >
                    Twitter Profile Link:
                </label>
                <input
                    type="text"
                    placeholder="https://twitter.com/accountname"
                    className="w-1/3 py-1 px-5 my-2 text-gray-500 border rounded-full outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    name="twitter"
                    onChange={props.onChangeSetTwitter}
                />
            </div>
            <button onClick={props.onClickButton} className="border p-2 my-3 rounded-lg bg-blue-500 text-white duration-300 hover:bg-white hover:text-blue-500">Add Charity</button>


        </div>)
}