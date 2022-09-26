import React, {useState} from "react";
import Column from "../../components/layout/Column";
import TextField from "../../components/form/TextField";
import Loading from "../../components/ui/Loading";
import SelectField from "../../components/form/SelectField";
import {register} from "./service/AuthDAO";
import {toast} from "react-toastify";

export interface RegisterModel {
    username: string;
    password: string;
    verify: string;
    phone: string;
    bank: string;
    accountName: string;
    account: string;
}

export default function Register({onRegister: onRegister}: { onRegister?: () => void }) {

    const [state, setState] = useState({
        username: "",
        password: "",
        verify: "",
        phone: "",
        bank: {value: "", label: ""},
        accountName: "",
        account: ""
    });
    const [loading, setLoading] = useState(false);
    const banks = [
        {value: "Khan bank", label: "Khan bank"},
        {value: "TDB", label: "TDB"},
    ]

    const onChange = (e: any) => {
        setState({...state, [e.target.name]: e.target.value.replaceAll(" ", "")});
    }

    const handleRegister = async () => {
        setLoading(true);

        const newUser = await register({...state, bank: state.bank.value});
        if (newUser) {
            toast.success("Амжилттай бүртгэл үүслээ");
            onRegister && onRegister();
        }
        setLoading(false);
    };

    return <Column style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
        <Column style={{gap: "10px", width: "100%", maxWidth: "400px", padding: "0 15px", boxSizing: "border-box"}}>
            <h1 style={{alignSelf: "center"}}>Бүртгэл</h1>
            <TextField onSubmit={handleRegister} maxLength={20} onChange={onChange} value={state.username} name={"username"}
                       caption={"Нэвтрэх нэр"}/>
            <TextField onSubmit={handleRegister} onChange={onChange} value={state.password} name={"password"} caption={"Нууц үг"}
                       type={"password"}/>
            <TextField onSubmit={handleRegister} onChange={onChange} value={state.verify} name={"verify"} caption={"Нууц үг давтах"}
                       type={"password"}/>
            <TextField onSubmit={handleRegister} maxLength={8} onChange={onChange} value={state.phone} name={"phone"} caption={"Утас"}
                       type={"number"}/>
            <SelectField onChange={(e) => setState({...state, bank: e})} value={state.bank} name={"bank"}
                         caption={"Банк"} options={banks}/>
            <TextField onSubmit={handleRegister} maxLength={50} onChange={onChange} value={state.accountName} name={"accountName"}
                       caption={"Дансны нэр"}/>
            <TextField onSubmit={handleRegister} maxLength={20} onChange={onChange} value={state.account} name={"account"}
                       caption={"Дансны дугаар"}
                       type={"number"}/>
            <button style={{marginBottom: "10px"}} onClick={handleRegister} className={"button primaryBg"}>{
                <Loading isLoading={loading}/>} {loading || "Бүртгүүлэх"}
            </button>
        </Column>
    </Column>
}
