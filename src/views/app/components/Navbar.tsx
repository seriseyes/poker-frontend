import css from "./AppComp.module.css";
import {Link} from "react-router-dom";

export default function Navbar() {
    return <nav className={css.nav}>
        <ul>
            <li><Link to={"/app/home"}>Ранк харах</Link></li>
            <li><Link to={"/app/table"}>Ширээнд суух</Link></li>
            <li><Link to={"/app/account"}>Данс цэнэглэх</Link></li>
            <li><Link to={"/app/remain"}>Дансны үлдэгдэл</Link></li>
            <li><Link to={"/"}>Гарах</Link></li>
        </ul>
    </nav>
}
