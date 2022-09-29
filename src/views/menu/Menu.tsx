import image from "../../assets/images/got.jpg";
import css from "./Menu.module.css";
import {useEffect, useState} from "react";
import Window from "../../components/ui/Window";
import Login from "../auth/Login";
import Register from "../auth/Register";

export default function Menu() {
    const [state, setState] = useState({
        register: false,
        login: false,
    });

    useEffect(() => {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }, []);

    return <div style={{width: "100%", height: "calc(100% - 4px)", boxSizing: "border-box"}}>
        <img className={css.image} src={image} alt="got"/>

        <button style={{position: "fixed", top: "0", left: "0"}} className={"button"}>G.O.T Покер</button>
        <button style={{position: "fixed", top: "0", right: "0", width: "150px"}}
                className={"button"}
                onClick={() => setState({register: false, login: true})}>
            Нэвтрэх
        </button>
        <button style={{position: "fixed", top: "50px", right: "0", width: "150px"}}
                className={"button"}
                onClick={() => setState({register: true, login: false})}>
            Бүртгүүлэх
        </button>

        <Window open={state.login} onClose={() => setState({...state, login: false})}>
            <Login/>
        </Window>
        <Window open={state.register} onClose={() => setState({...state, register: false})}>
            <Register onRegister={() => setState({...state, register: false})}/>
        </Window>
    </div>
}
