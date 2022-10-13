import css from "./AppComp.module.css";
import {Link, useLocation} from "react-router-dom";
import useCookie from "../../../hooks/useCookie";
import {useEffect, useState} from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {AiOutlineMenu} from "react-icons/ai";
import {IoCloseSharp} from "react-icons/io5";

export default function Navbar() {
    const role = useCookie("role");
    const isDesktop = useMediaQuery("(min-width: 1095px)");
    const [state, setState] = useState(false);
    const location = useLocation();

    useEffect(() => {

    }, [role, location]);

    const toggle = () => {
        setState(!state);
    }

    return <nav className={css.nav}>
        {isDesktop || state ? <>
            <ul>

                {location.pathname.includes("game") ? <li><Link to={"/app/home"}>Өрөөнөөс гарах</Link></li>
                    :
                    <>
                        {role === 'admin' ? <li><Link to={"/app/admin"}>Админ</Link></li> : null}
                        <li><Link to={"/app/home"}>Ранк харах</Link></li>
                        <li><Link to={"/app/table"}>Ширээнд суух</Link></li>
                        <li><Link to={"/app/account"}>Данс</Link></li>
                        <li><Link to={"/"}>Гарах</Link></li>
                    </>
                }
            </ul>
        </> : null
        }
        {isDesktop || state ?
            <IoCloseSharp style={{fontSize: "1.8rem", color: "white", cursor: "pointer"}} onClick={toggle}/>
            : <AiOutlineMenu style={{fontSize: "1.8rem", color: "white", cursor: "pointer"}} onClick={toggle}/>
        }
    </nav>
}
