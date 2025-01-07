import { Link } from 'react-router-dom'
import SearchBar from './SearchBar';
import Logo from '../clarity.svg'

const Navbar = (props) => {
    console.log("navbar");
    console.log(props);
    return (
        <div data-testid="navbar" className="flex flex-row py-5 pl-5 text-l shadow-md relative z-10 align-center text-[#4169e1] bg-white">
            <ul className="flex justify-between w-full">
                <div className='flex justify-start align-bottom'>
                    <img style={{ margin: "-6px 0px 0px 0px" }}
                        src={Logo}
                        className='w-20'
                        alt="website logo"
                    />
                    <NavItem
                        to="/"
                        text="Home"
                    />
                </div>
                <div className='flex justfiy-end w-3/4 align-bottom'>
                    <div className='w-4/6'>
                        <SearchBar tags={props.tags} setTags={props.setTags} />
                    </div>
                    <NavItem
                        to="/following"
                        text="Following"
                    />
                    <NavItem
                        to="/myaccount"
                        text="Account"
                    />
                    <NavItem
                        to="/addcharity"
                        text="Add new Charity"
                    />
                </div>
            </ul>
        </div >
    )
}






function NavItem({ text, to }) {
    return (
        <div className='px-2 ml-5 pt-1 inline-block align-bottom'>
            <span className="">
                <li>
                    <Link to={to} className="nav-links">
                        {text}
                    </Link>
                </li>
            </span>
        </div>

    );
}


export default Navbar;