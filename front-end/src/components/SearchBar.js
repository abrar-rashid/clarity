import React, { useState, useRef, useLayoutEffect, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tagContext } from "../App";
// import Search from "../pages/Search"
import "./tag.css"

export default function SearchBar(props) {
    console.log("searchbar");
    console.log(props);
    const { tags, setTags } = useContext(tagContext)

    const removeTags = indexToRemove => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };

    const addTags = (tag) => {
        console.log(tag)
        console.log(tags)
        setTags([...tags, tag])
    }
    const [val, setVal] = useState("")

    let onSubmitHandler = e => {
        e.preventDefault();
        if (val === "" || tags.includes(val)) {
            return
        }
        addTags(val)
        e.target.reset()
        console.log(tags)
    }
    const navigate = useNavigate()

    useEffect(() => {
        console.log(tags)
        if (tags.length > 0) {
            navigate("/search")
        }
    }, [tags])

    return (
        <form className=" w-full px-4" onSubmit={onSubmitHandler}>
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Click tags to search or enter manually here, eg: Nature..."
                    className="w-full text-xl py-1 pl-12 pr-4 text-gray-500 border rounded-full outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    name="query"
                    onChange={(e) => setVal(e.target.value)}
                />
            </div>
            <div className="filter-tags">
                <ul id="tags">
                    {tags.map((tag, index) => (
                        <li key={index} className="tag">
                            <span className='tag-title'>{tag}</span>
                            <span className='tag-close-icon'
                                onClick={() => removeTags(index)}
                            >
                                x
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </form>
    );
}

