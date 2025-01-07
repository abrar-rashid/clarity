import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CharitySearchResult from "../components/CharitySearchResult";
import { CartesianGrid, Bar, Tooltip, XAxis, YAxis, BarChart, Legend } from "recharts";
import { tagContext } from "../App";

export const Checkbox = ({ isChecked, label, checkHandler, index }) => {
    return (
        <div className="flex items-center p-2 rounded hover:bg-gray-100">
            <input
                type="checkbox"
                id={`checkbox-${index}`}
                checked={isChecked}
                onChange={checkHandler}
                className="mx-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
            />
            <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded" htmlFor={`checkbox-${index}`}>{label}</label>
        </div>
    )
}

const Search = (props) => {
    const { tags, setTags } = useContext(tagContext)
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    // const filterTags = params.get("query");

    const allShowBoxes = [
        { name: "Income", checked: true },
        { name: "Expenditure", checked: false },
        { name: "Volunteers", checked: false },
        { name: "Employees", checked: false },
        { name: "Donation spending", checked: false },
        { name: "Average Rating", checked: true },
    ]

    const allRegions = [
        { name: "Throughout England", checked: false },
        { name: "Throughout England And Wales", checked: false },
        { name: "Throughout London", checked: false },
        { name: "Throughout Wales", checked: false },
    ]

    const [show, setShow] = useState(allShowBoxes)
    const [regions, setRegions] = useState(allRegions)


    const [sort, setSort] = useState({
        sort: "alpha-asc"
    });
    const [data, setData] = useState(null)

    const [view, setView] = useState({
        view: "results",
    })


    function showRegularView() {
        setView({ view: "results" })
    }

    function showFinancialView() {
        setView({ view: "financial" })
    }
    function showStaffView() {
        setView({ view: "staff" })
    }

    const updateCheckStatusShow = index => {
        setShow(
            show.map((info, currentIndex) =>
                currentIndex === index
                    ? { ...info, checked: !info.checked }
                    : info
            )
        )
    }

    useEffect(() => {
        filterByRegion()
    }, [regions]
    )
    const updateCheckStatusRegions = index => {
        setRegions(
            regions.map((info, currentIndex) =>
                currentIndex === index
                    ? { ...info, checked: !info.checked }
                    : info
            )
        )

    }

    function filterByRegion() {
        console.log(data && data)
        const regionList = regions.filter(f => f.checked).map(f => f.name)
        if (regionList == 0) {
            return data && data
        }
        return data && data.filter(f => regionList.filter(v => f["areas"].includes(v)).length > 0)

    }

    const handleSortChange = (e) => {
        setSort(e.target.value);
        if (e.target.value === "income-asc") {
            data.sort(sortByIncomeAsc)
        }
        else if (e.target.value === "income-desc") {
            data.sort(sortByIncomeDesc)
        }
        else if (e.target.value === "alpha-asc") {
            data.sort(sortAlphaAsc)
        }
        else if (e.target.value === "alpha-desc") {
            data.sort(sortAlphaDesc)
        }
        else if (e.target.value === "rating-desc") {
            data.sort(sortByRatingDesc)
        }
        else if (e.target.value === "rating-asc") {
            data.sort(sortByRatingAsc)
        }
        else if (e.target.value === "exp-asc") {
            data.sort(sortByExpenditureAsc)
        }
        else if (e.target.value === "exp-desc") {
            data.sort(sortByExpenditureDesc)
        }
        else if (e.target.value === "volunteers-asc") {
            data.sort(sortByVolunteersAsc)
        }
        else if (e.target.value === "volunteers-desc") {
            data.sort(sortByVolunteersDesc)
        }
        else if (e.target.value === "employees-asc") {
            data.sort(sortByEmployeesAsc)
        }
        else if (e.target.value === "employees-desc") {
            data.sort(sortByEmployeesDesc)
        }
    };

    // Sort functions

    function sortAlphaAsc(a, b) {
        return a.charity_name.localeCompare(b.charity_name)
    }
    function sortAlphaDesc(a, b) {
        return b.charity_name.localeCompare(a.charity_name)
    }
    function sortByIncomeAsc(a, b) {
        return parseInt(a.latest_income) > parseInt(b.latest_income) ? 1 : -1
    }
    function sortByIncomeDesc(a, b) {
        return parseInt(a.latest_income) > parseInt(b.latest_income) ? -1 : 1
    }
    function sortByRatingDesc(a, b) {
        let avg_a;
        let avg_b;
        const star_ratings_a = a.reviews_data && a.reviews_data.map(r => r.star_rating)
        const star_ratings_b = b.reviews_data && b.reviews_data.map(r => r.star_rating)

        if (star_ratings_a != null) {
            avg_a = star_ratings_a.map(i => parseInt(i)).reduce((acc, n) => acc + n, 0) / star_ratings_a.length
        } else {
            avg_a = 0
        }
        if (star_ratings_b != null) {
            avg_b = star_ratings_b.map(i => parseInt(i)).reduce((acc, n) => acc + n, 0) / star_ratings_b.length
        } else {
            avg_b = 0
        }
        return avg_a > avg_b ? -1 : 1
    }
    function sortByRatingAsc(a, b) {
        return sortByRatingDesc(b, a)
    }
    function sortByExpenditureAsc(a, b) {
        return parseInt(a.latest_expenditure) > parseInt(b.latest_expenditure) ? 1 : -1
    }
    function sortByExpenditureDesc(a, b) {
        return parseInt(a.latest_expenditure) > parseInt(b.latest_expenditure) ? -1 : 1
    }
    function sortByVolunteersAsc(a, b) {
        return parseInt(a.volunteers) > parseInt(b.volunteers) ? 1 : -1
    }
    function sortByVolunteersDesc(a, b) {
        return parseInt(a.volunteers) > parseInt(b.volunteers) ? -1 : 1
    }
    function sortByEmployeesAsc(a, b) {
        return parseInt(a.employees) > parseInt(b.employees) ? 1 : -1
    }
    function sortByEmployeesDesc(a, b) {
        return parseInt(a.employees) > parseInt(b.employees) ? -1 : 1
    }


    function getPlotData() {
        const plotData = [];
        if (data) {
            for (const d of data) {
                plotData.push(
                    {
                        "name": d.charity_name,
                        "Income": d.latest_income,
                        "Expenditure": d.latest_expenditure
                    }
                )

            }
        }
        return plotData
    }

    function getCharitableActivitiesData() {
        const plotData = [];
        if (data) {
            for (const d of data) {
                plotData.push(
                    {
                        "name": d.charity_name,
                        "Percent": 100 - (d.exp_charitable_activities / d.latest_expenditure) * 100,
                    }
                )

            }
        }
        return plotData
    }

    function getStaffData() {
        const plotData = [];
        if (data) {
            for (const d of data) {
                plotData.push(
                    {
                        "name": d.charity_name,
                        "volunteers": d.volunteers,
                        "employees": d.employees,
                    }
                )

            }
        }
        return plotData
    }

    // console.log(filterTags)
    // search?query=tag1!!tag2!!tag3
    const navigate = useNavigate()
    // [] - only runs this on the first time the page is rendered
    useEffect(() => {
        const fetchCharities = async () => {
            const filterTags = tags.join("!!")
            await fetch(`/api/search/:${filterTags}`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setData(data)
                })
        }
        if (tags.length === 0) {
            navigate("/")
        }
        fetchCharities()
        console.log("inside useeffect in search");
        console.log(tags);
    }, [tags])


    // Find a better way of doing this
    function SideBar() {
        return (
            <div className="bg-white">
                <aside id="default-sidebar" class="sticky left-0 -z-1 w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div class="h-full px-3 py-4 overflow-y-auto border-r-2">
                        <ul class="space-y-2 py-2">
                            <li>
                                <span class="text-xl font-bold ml-3">Show</span>
                                <div className="pt-2">
                                    {show.map((info, index) => (
                                        <Checkbox
                                            key={info.name}
                                            isChecked={info.checked}
                                            checkHandler={() => updateCheckStatusShow(index)}
                                            label={info.name}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </li>
                        </ul>
                        <ul class="space-y-2 border-t-2 py-2">
                            <li>
                                <span class="text-xl font-bold ml-3">Filter By Region</span>
                                <div className="pt-2">
                                    {regions.map((info, index) => (
                                        <Checkbox
                                            key={info.name}
                                            isChecked={info.checked}
                                            checkHandler={() => updateCheckStatusRegions(index)}
                                            label={info.name}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

        )
    }

    const StaffView = () => {

        return (
            <div className="mt-3">
                <h1 className="text-3xl font-bold pb-10">Volunteers Summary</h1>
                {data ? <BarChart margin={{ left: 50 }} width={1200} height={500} data={getStaffData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volunteers" fill="#24aed6" />
                </BarChart> : null}
                <h1 className="text-3xl font-bold pb-10">Employees Summary</h1>
                {data ? <BarChart margin={{ left: 50 }} width={1200} height={500} data={getStaffData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" fill="#2E294E" />
                </BarChart> : null}
            </div>

        )
    }

    const FinancialView = () => {
        return (
            <div className="mt-3">
                <h1 className="text-3xl font-bold pb-10">Income vs Expenditure Summary</h1>
                {data ? <BarChart margin={{ left: 50 }} width={1200} height={500} data={getPlotData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Income" fill="#649ff0" />
                    <Bar dataKey="Expenditure" fill="#e75757" />
                </BarChart> : null}
                <h1 className="text-3xl font-bold py-10">Percentage of Expenditure Spent on Other than Charitable Activities</h1>
                {data ? <BarChart margin={{ left: 50 }} width={1200} height={500} data={getCharitableActivitiesData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Percent" fill="#e75757" />
                </BarChart> : null}
            </div>

        )
    }

    const ResultsView = () => {
        return (
            <div className="mt-3">
                <h1 className="text-3xl font-bold pb-5">Returned {data && filterByRegion().length} Results:</h1>
                <ol type="1" className="flex flex-wrap w-full justify-between">
                    {data && filterByRegion().map((d) => (
                        // Cycles through the array of returned charities using the organisation number as the key 
                        // and displays the charity name and registered charity number
                        <CharitySearchResult key={d.organisation_number}
                            org_num={d.organisation_number}
                            name={d.charity_name}
                            tags={d.tags}
                            volunteers={d.volunteers}
                            reg_charity_number={d.reg_charity_number}
                            latest_income={d.latest_income}
                            latest_expenditure={d.latest_expenditure}
                            activities={d.activities}
                            employees={d.employees}
                            star_ratings={d.reviews_data && d.reviews_data.map(r => r.star_rating)}

                            show_latest_income={show[0].checked}
                            show_latest_expenditure={show[1].checked}
                            show_volunteers={show[2].checked}
                            show_employees={show[3].checked}
                            show_activities={show[4].checked}
                            show_star_ratings={show[5].checked}
                        />
                    ))}
                </ol>
            </div>)
    }


    return (
        <div className="bg-stone-100 flex flex-row text-black align-middle">
            <SideBar />
            <div className="px-5 py-10 w-full">
                <label className="text-xl" for="cars">Sort By:</label>
                <div className="relative w-full flex flex-row  py-2">
                    <div>
                        <select name="sort" value={sort} onChange={handleSortChange} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                            <option value="alpha-asc">Alphabet (A-Z)</option>
                            <option value="alpha-desc">Alphabet (Z-A)</option>
                            <option value="income-asc">Income (Low to High)</option>
                            <option value="income-desc">Income (High to Low)</option>
                            <option value="exp-asc">Expenditure (Low to High)</option>
                            <option value="exp-desc">Expenditure (High to Low)</option>
                            <option value="rating-asc">Rating (Low to High)</option>
                            <option value="rating-desc">Rating (High to Low)</option>
                            <option value="volunteers-asc">Volunteers (Low to High)</option>
                            <option value="volunteers-desc">Volunteers (High to Low)</option>
                            <option value="employees-asc">Employees (Low to High)</option>
                            <option value="employees-desc">Employees (High to Low)</option>
                        </select>
                    </div>
                    <button onClick={showRegularView} className="border rounded-lg bg-white hover:bg-blue-500 hover:text-white mx-5 px-2">Results</button>
                    <button onClick={showFinancialView} className="border rounded-lg bg-white hover:bg-blue-500 hover:text-white mx-5 px-2">Financial Summary</button>
                    <button onClick={showStaffView} className="border rounded-lg bg-white hover:bg-blue-500 hover:text-white mx-5 px-2">Staff Summary View</button>
                </div>
                {view["view"] === "results" ? <ResultsView /> : view["view"] === "financial" ? <FinancialView /> : <StaffView />}

            </div>

        </div>
    )
}



export default Search;

