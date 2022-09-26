import {useNavigate} from "react-router-dom";
import Column from "../../components/layout/Column";
import TextField from "../../components/form/TextField";
import React, {useState} from "react";
import {toast} from "react-toastify";
import {login} from "./service/AuthDAO";
import Loading from "../../components/ui/Loading";

export default function Login() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const onChange = (e: any) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const onLogin = async () => {
        if (loading) return;

        setLoading(true);
        const token = await login(state);
        if (token) {
            toast.success("Амжилттай нэвтэрлээ");
            document.title = "GOT poker - " + state.username;
            navigate("/app/home");
        }
        setLoading(false);
    };

    return <Column style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
        <Column style={{gap: "10px", width: "100%", maxWidth: "400px", padding: "0 15px", boxSizing: "border-box"}}>
            <h1 style={{alignSelf: "center"}}>Нэвтрэх</h1>
            <TextField onSubmit={onLogin} onChange={onChange} value={state.username} name={"username"} caption={"Нэвтрэх нэр"}/>
            <TextField onSubmit={onLogin} onChange={onChange} value={state.password} name={"password"} caption={"Нууц үг"}
                       type={"password"}/>
            <button style={{marginBottom: "10px"}} onClick={onLogin} className={"button primaryBg"}>{
                <Loading isLoading={loading}/>} {loading || "Нэвтрэх"}</button>
        </Column>
    </Column>
}
