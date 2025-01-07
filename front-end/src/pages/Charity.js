import { createContext, useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import PieChartComponent from "../components/PieChartComponent";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabSelector.tsx";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { toast } from "react-toastify";
import './ReviewForm.css';
import './ReviewSection.css';
import './StarRating.css';
import io from "socket.io-client"
import { tagContext } from "../App";


const origin = process.env.NODE_ENV === 'production' ? 'https://drp47-project.herokuapp.com' : 'http://localhost:8000';
const socket = io.connect(origin)
const dataContext = createContext(null)

console.log(origin);
var id
const fetchCharities = async (id, setData) => {
    // Proxy attribute in package.json only fix for development - has to be changed in production
    await fetch(`/api/charities/:${id}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            setData(data[0])
        })
}

const Charity = () => {

    const [data, setData] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const charityID = params.get("id")
    const [username, setUsername] = useState(null)
    console.log(charityID)
    if (charityID) {
        id = charityID
    } else {
        id = 1105056
    }
    // [] - only runs this on the first time the page is rendered
    useEffect(() => {
        const getname = async () => {
            await fetch(`/api/user/profile`,
                { headers: { token: localStorage.getItem("token"), "Content-Type": "application/json" } })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    setUsername(data.name)
                })
        }
        fetchCharities(id, setData)
        getname()

        // console.log(data)
    }, [])

    useEffect(() => {
        console.log(data)
        console.log(username)
    }, [data, username])


    const onClickShowMore = (e) => {
        e.preventDefault()
        setShowMore(!showMore)
    }

    const onClickFollow = async (e) => {
        e.preventDefault()
        try {
            console.log(JSON.stringify({ charity_id: data && data["organisation_number"] }))
            const response = await fetch("/api/user/follow_charity", {
                method: "POST",
                headers: { token: localStorage.getItem("token"), "Content-Type": "application/json" },
                body: JSON.stringify({ charity_id: data && data["organisation_number"] })
            })

            const parseRes = await response.json()
            toast(parseRes)
        } catch (err) {
            console.error(err.message);
        }
    }

    const onClickUnfollow = async (e) => {
        e.preventDefault()
        try {
            console.log(JSON.stringify({ charity_id: data && data["organisation_number"] }))
            const response = await fetch("/api/user/unfollow_charity", {
                method: "POST",
                headers: { token: localStorage.getItem("token"), "Content-Type": "application/json" },
                body: JSON.stringify({ charity_id: data && data["organisation_number"] })
            })

            const parseRes = await response.json()
            toast(parseRes)
        } catch (err) {
            console.error(err.message);
        }
    }

    const [selectedTab, setSelectedTab] = useTabs([
        "logistics",
        "finance",
        "staff",
        "feed",
        "reviews"
    ]);

    return (
        <>
            <div className="my-10 mx-32 bg-white p-10 rounded-lg">
                <h1 className="text-3xl font-bold underline py-2 pb-5">{data && data["charity_name"]}</h1>
                <a href={"//" + (data && data["web"])}><button className="p-3 mx-5 mb-5 font-bold border bg-green-500 text-white rounded-lg hover:p-4 hover:shadow-xl duration-300">Donate</button></a>
                <button onClick={onClickFollow} className="p-3 mx-5 mb-5 font-bold border text-white rounded-lg bg-blue-500  hover:p-4 hover:shadow-xl duration-300">Follow</button>
                <button onClick={onClickUnfollow} className="p-3 mx-5 mb-5 font-bold border text-white rounded-lg bg-red-500  hover:p-4 hover:shadow-xl duration-300">Unfollow</button>
                <nav className="flex border-b border-gray-300">
                    <TabSelector
                        isActive={selectedTab === "logistics"}
                        onClick={() => setSelectedTab("logistics")}
                    >
                        Logistics
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "finance"}
                        onClick={() => setSelectedTab("finance")}
                    >
                        Financial Breakdown
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "staff"}
                        onClick={() => setSelectedTab("staff")}
                    >
                        Staff Breakdown
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "feed"}
                        onClick={() => setSelectedTab("feed")}
                    >
                        Feed
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "reviews"}
                        onClick={() => setSelectedTab("reviews")}
                    >
                        Reviews
                    </TabSelector>
                </nav>
                <div className="p-4">
                    <TabPanel hidden={selectedTab !== "logistics"}>
                        <div className="flex flex-col">
                            <LogisticsCard reg_charity_number={data && data["reg_charity_number"]} email={data && data["email"]} phone={data && data["phone"]} web={(data && data["web"])} desc={data && data["activities"]} />
                            <div className=" p-2 flex flex-wrap my-2">
                                <h2 className="text-2xl font-bold">Tags: </h2>
                                <ul className="my-2 flex flex-wrap w-full">
                                    {data && data["tags"].map((elem) =>
                                        <TagItem text={elem} />
                                    )}
                                </ul>
                            </div>
                            <div className=" p-2 flex flex-wrap my-2">
                                <h2 className="text-2xl font-bold">Areas of Operation:</h2>
                                <ul className="my-2 flex flex-wrap w-full">
                                    {data && data["areas"].length > 7 ?
                                        // if greater than 7 locations
                                        (showMore ? <>{(data && data["areas"].map((elem) =>
                                            <TagItem text={elem} className="w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#878787] align-middle content-center justify-center shadow-md hover:shadow-xl" />
                                        ))}
                                            <button onClick={onClickShowMore} className="w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#4169e1] align-middle content-center justify-center shadow-md hover:shadow-xl">Show Less</button>
                                        </> : <>{(data && data["areas"].slice(0, 7).map((elem) =>
                                            <TagItem text={elem} className="w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#878787] align-middle content-center justify-center shadow-md hover:shadow-xl" />
                                        ))}
                                            <button onClick={onClickShowMore} className="w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#4169e1] align-middle content-center justify-center shadow-md hover:shadow-xl">Show More...</button>
                                        </>
                                        )
                                        :
                                        // If less than 7 locations
                                        (data && data["areas"].map((elem) =>
                                            <TagItem text={elem} className="w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#878787] align-middle content-center justify-center shadow-md hover:shadow-xl" />
                                        ))
                                    }

                                </ul>
                            </div>
                        </div>

                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "finance"}>
                        <div className=" p-2 flex flex-row ml-2">
                            <FinancialBreakdownCard
                                latest_acc_fin_year_end_date={data && data["latest_acc_fin_year_end_date"]}
                                latest_income={data && data["latest_income"]}
                                latest_expenditure={data && data["latest_expenditure"]}
                                inc_donations_legacies={data && data["inc_donations_legacies"]}
                                inc_other_trading_activities={data && data["inc_other_trading_activities"]}
                                inc_investments={data && data["inc_investments"]}
                                inc_charitable_activities={data && data["inc_charitable_activities"]}
                                inc_other={data && data["inc_other"]}
                                investment_gains_losses={data && data["investment_gains_losses"]}
                                exp_raising_funds={data && data["exp_raising_funds"]}
                                exp_charitable_activities={data && data["exp_charitable_activities"]}
                                exp_other={data && data["exp_other"]}
                                fin_period_end_date={data && data["fin_period_end_date"]}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "staff"}>
                        <StaffBreakDownCard
                            volunteers={data && data["volunteers"]}
                            employees={data && data["employees"]}
                            trustees={data && data["trustees"]} />
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "feed"}>
                        <div className="mb-10 h-screen">
                            {data && data["twitter_link"] ? <TwitterTimelineEmbed
                                sourceType="profile"
                                screenName={data && data["twitter_link"].split(".com/")[1]}
                                // options={{ height: 400, width: 1000 }}
                                noHeader={true}
                            /> : <NoTwitterFound />}
                        </div>
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "reviews"}>
                        <div className="mb-10 h-screen">
                            <dataContext.Provider value={{ data, setData, username }}>
                                <ReviewsCard organisation_number={data && data["organisation_number"]} />
                            </dataContext.Provider>
                            <ReviewSectionCard
                                reviews={data && data["reviews_data"]} />
                        </div>
                    </TabPanel>
                </div>
            </div>
        </>
    )
}

function TagItem({ text, className }) {
    const { tags, setTags } = useContext(tagContext)
    const navigate = useNavigate()
    console.log("tagitem");
    console.log(tags);
    if (!className) {
        className = "w-40 border-1 rounded-lg my-1 text-center mx-1 py-1 text-white font-bold bg-[#4169e1] align-middle content-center justify-center shadow-md hover:shadow-xl"
    }
    console.log(className)
    const onButtonClick = () => {
        console.log("lmao")
        setTags([...tags, text])
    }
    useEffect(() => {
        if (tags.length > 0) {
            navigate("/search")
        }
    }, [tags])
    return (
        <li className={className}>
            {/* <Link to={"/search?query=" + text} className="nav-links">
                {text}
            </Link> */}
            <button onClick={onButtonClick}>{text}</button>
        </li>
    );
}

const NoTwitterFound = (props) => {
    return (
        <div className="w-[1000px] font-bold text-3xl">
            <h1>No Twitter Link available</h1>
        </div>
    )
}

// Create our number formatter.
const numberFormatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const dateFormatter = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return year
}



function StaffBreakDownCard(props) {
    return (
        <div className="p-2 flex flex-wrap my-2">
            <h2 className="text-2xl font-bold">Staff Breakdown</h2>
            <ul className="my-2 text-xl flex flex-col w-full">
                <li><p>volunteers: {props.volunteers}</p></li>
                <li><p>employees: {props.employees}</p></li>
                <li><p>trustees: {props.trustees}</p></li>
            </ul>
        </div>
    )
}

function FinancialBreakdownCard(props) {
    const incomeData = [
        { name: "Donations & Legacies", value: parseInt(props.inc_donations_legacies, 10) },
        { name: "Other trading activities", value: parseInt(props.inc_other_trading_activities, 10) },
        { name: "Investments", value: parseInt(props.inc_investments, 10) },
        { name: "Fees or grants", value: parseInt(props.inc_charitable_activities, 10) },
        { name: "Other", value: parseInt(props.inc_other, 10) }
    ];
    const expenditureData = [
        { name: "Raising funds", value: parseInt(props.exp_raising_funds, 10) },
        { name: "Charitable activities", value: parseInt(props.exp_charitable_activities, 10) },
        { name: "Other", value: parseInt(props.exp_other, 10) },
    ];
    return (
        <div>
            <h3 className="text-2xl pb-2 w-full font-bold">Financial Breakdown for {dateFormatter(props.latest_acc_fin_year_end_date) - 1} to {dateFormatter(props.latest_acc_fin_year_end_date)}: </h3>
            <h3 className="text-xl font-bold">Net Profit/Loss: {numberFormatter.format(props.latest_income - props.latest_expenditure)}</h3>
            <div className=" justify-center content-center flex flex-row">
                <ul className="flex flex-col mr-5">
                    <div>
                    </div>
                    <h2 className="text-l font-bold">Income Breakdown</h2>
                    <PieChartComponent plotdata={incomeData} fill={"#4169e1"} />
                    <li><p>Latest submitted income: {numberFormatter.format(props.latest_income)}</p></li>
                    <li><p>Income from donations and legacies: {numberFormatter.format(props.inc_donations_legacies)}</p></li>
                    <li><p>Income from other trading activity: {numberFormatter.format(props.inc_other_trading_activities)}</p></li>
                    <li><p>Income from investments including dividends, interest and rents: {numberFormatter.format(props.inc_investments)}</p></li>
                    <li><p>Income received as fees or grants: {numberFormatter.format(props.inc_charitable_activities)}</p></li>
                    <li><p>Other income - this category includes gains on the disposal of own use assets: {numberFormatter.format(props.inc_other)}</p></li>
                    <li><p>investment gains/losses: {numberFormatter.format(props.investment_gains_losses)}</p></li>
                </ul>
                <ul className="flex flex-col">
                    <h2 className="text-l font-bold">Expenditure Breakdown</h2>
                    <PieChartComponent plotdata={expenditureData} fill={"#990033"} />
                    <li><p>Latest Expenditure: {numberFormatter.format(props.latest_expenditure)}</p></li>
                    <li><p>Expenditure on raising funds: {numberFormatter.format(props.exp_raising_funds)}</p></li>
                    <li><p>Expenditure on charitable activities: {numberFormatter.format(props.exp_charitable_activities)}</p></li>
                    <li><p>Expenditure on other: {numberFormatter.format(props.exp_other)}</p></li>
                </ul>
            </div>
        </div>

    );
}

function LogisticsCard(props) {
    return (
        <div className="mt-2 p-2 text-xl">
            <div className="pb-5">
                <h3 className="text-2xl font-bold pb-2">Basic Details</h3>
                <p><span className="font-bold">Registered Charity Number: </span>{props.reg_charity_number}</p>
                <p><span className="font-bold">Email: </span>{props.email}</p>
                <p><span className="font-bold">Phone: </span> {props.phone}</p>
                <a href={"//" + props.web}><p><span className="font-bold">Website: </span><span className="hover:underline">{props.web}</span></p></a>
            </div>
            <div>
                <h2 className="text-2xl font-bold py-2">How are donations spent?</h2>
                <p>{props.desc}</p>
            </div>

        </div>
    );
}

function ReviewsCard(props) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const { data, setData, username } = useContext(dataContext)

    socket.emit("view_charity", props.organisation_number)

    const handleInputChange = (event) => {
        setReview(event.target.value);
    };

    const sendMessage = (newData) => {
        // broadcast to any other clients on this page to update their charity info with `newData`
        socket.emit("send_message", { message: newData, room: props.organisation_number })
        console.log("LMAOOOODAFOSDS")
    }

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            // when new review submitted by another client, re-render with new updated charity info (add new review)
            setData(data.message)
        })
    }, [])

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (rating === 0) {
            toast.error("You must select a star rating")
        }
        else {
            try {
                console.log(JSON.stringify({ charity_id: props.organisation_number, star_rating: rating, review: review }))
                // save data to the database
                const response = await fetch("/api/user/submit_review", {
                    method: "POST",
                    headers: { token: localStorage.getItem("token"), "Content-Type": "application/json" },
                    body: JSON.stringify({ charity_id: props.organisation_number, star_rating: rating, review: review })
                })

                const parseRes = await response.json()

                // edit client side charity data info to include new review
                let newData
                if (data.reviews_data) {
                    newData = { ...data, reviews_data: [{ star_rating: rating, review: review, reviewer_name: username }, ...data.reviews_data] }
                } else {
                    newData = { ...data, reviews_data: [{ star_rating: rating, review: review, reviewer_name: username }] }
                }
                console.log(newData)
                // broadcast new charity data to any other clients on this charity page
                sendMessage(newData)
                // re-render page to include new review
                setData(newData)

                toast(parseRes)
            } catch (err) {
                console.error(err.message);
            }
            // Reset the review input field
            setReview('');
            setRating(0);
        }

    };

    return (
        <div className="container">
            <strong><h2>Write Your Review</h2></strong>
            <form className="review-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={review}
                    onChange={handleInputChange}
                    placeholder="Write your review here"
                    className="review-input"
                />
                {/* <button onClick={sendMessage}>Send Message</button> */}
                <StarRating maxStars={5} onChange={setRating} />
                <button type="submit" className="review-btn">Submit</button>
            </form>
        </div>
    );
};


function ReviewSectionCard(props) {

    // const reviewArray = props.star_ratings.map((rating, index) => {
    //     return { rating, review: props.reviews[index] };
    //   });
    console.log(props)
    console.log(props.reviews == null)
    console.log("LMAOOO")

    if (!props.reviews) {
        return (
            <div className="review-section">
                <h3><b>No Reviews</b></h3>
            </div>
        );
    }



    //   const reviews = [
    //     { name: 'John Doe', rating: 4, review: 'Great product! Highly recommended.' },
    //     { name: 'Jane Smith', rating: 5, review: 'Excellent service and quality.' },
    //     { name: 'Michael Johnson', rating: 3, review: 'Average experience. Could be better.' },
    //   ];

    //   const reviews = props.star_ratings.map((rating, index) => {
    //     return { rating, review: props.reviews[index] };
    //   });

    let acc = 0;
    for (let i = 0; i < props.reviews.length; i++) {
        acc = acc + parseInt(props.reviews[i].star_rating)
    }
    const avg = Math.round(((acc / props.reviews.length) || 0) * 10) / 10


    return (
        <div className="review-section">
            <h3><b>Average Rating: {avg}</b></h3>
            <br></br>
            {props.reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="review-details">
                        <span className="review-name">{review.reviewer_name}</span>
                        <span className="review-rating">
                            {Array.from({ length: review.star_rating }, (_, index) => (
                                <span key={index} className="star">&#9733;</span>
                            ))}
                        </span>
                    </div>
                    <p className="review-text">{review.review}</p>
                </div>
            ))}
        </div>
    );
};


const StarRating = ({ maxStars, onChange }) => {
    const [selectedStars, setSelectedStars] = useState(0);

    const handleStarClick = (starCount) => {
        if (starCount === selectedStars) {
            // If the clicked star is already selected, reset the rating
            setSelectedStars(0);
            onChange(0);
        } else {
            setSelectedStars(starCount);
            onChange(starCount);
        }
    };

    return (
        <div className="star-rating">
            {[...Array(maxStars)].map((_, index) => (
                <span
                    key={index}
                    className={`star ${index < selectedStars ? 'active' : ''}`}
                    onClick={() => handleStarClick(index + 1)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default Charity;

export {
    TagItem,
    numberFormatter
}

