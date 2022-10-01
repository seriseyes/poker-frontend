import css from "./AppComp.module.css";
import {Link} from "react-router-dom";
import useCookie from "../../../hooks/useCookie";
import {useEffect} from "react";

export default function Navbar() {
    const role = useCookie("role");

    useEffect(() => {

    }, [role]);

    return <nav className={css.nav}>
        <ul>
            {role === 'admin' ? <li><Link to={"/app/admin"}>Админ</Link></li> : null}
            <li><Link to={"/app/home"}>Ранк харах</Link></li>
            <li><Link to={"/app/table"}>Ширээнд суух</Link></li>
            <li><Link to={"/app/account"}>Данс</Link></li>
            <li><Link to={"/"}>Гарах</Link></li>
        </ul>
    </nav>
}
