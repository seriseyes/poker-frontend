import React, {useEffect, useState} from "react";
import Column from "../../components/layout/Column";
import {Auth} from "../auth/model/Auth";
import Row from "../../components/layout/Row";
import Loading from "../../components/ui/Loading";
import {findMe} from "../auth/service/AuthDAO";
import Window from "../../components/ui/Window";
import TextField from "../../components/form/TextField";
import {createChipRequest} from "./service/ChipDAO";
import {toast} from "react-toastify";

export default function Account() {
    const [state, setState] = useState<Auth>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [showOut, setShowOut] = useState(false);
    const [outAmount, setOutAmount] = useState("0");

    useEffect(() => {
        setLoading(true);
        void async function () {
            const result = await findMe();
            if (result) setState(result);
            setLoading(false);
        }();
    }, []);

    const out = async () => {
        if (outAmount === "0") return;
        const result = await createChipRequest(outAmount, "out");
        if (result) {
            toast.success(result);
            setShowOut(false);
        }
    }

    return <Column style={{gap: "8px"}}>
        <h1 style={{color: "white"}}>Данс</h1>
        {loading ? null : <>
            <Row style={{gap: "4px", color: "white"}}>
                <div>Үлдэгдэл:</div>
                <div>{state?.chips}</div>

            </Row>
            <button onClick={() => setOpen(true)} style={{padding: "4px", width: "200px", cursor: "pointer"}}>Данс
                цэнэглэх
                хүсэлт илгээх
            </button>
            <button onClick={() => setShowOut(true)} style={{padding: "4px", width: "200px", cursor: "pointer"}}>
                Зарлага
            </button>
            {showOut && <Row style={{alignItems: "flex-end"}}>
                <TextField type={"number"} onSubmit={out} onChange={(e: any) => setOutAmount(e.target.value)}
                           style={{width: "200px"}} captionStyle={{color: "white"}} caption={"Зарлага гаргах дүн"}/>
                <button onClick={out} style={{height: "40px"}}>Хүсэлт илгээх</button>
            </Row>}
        </>}
        <Loading isLoading={loading}/>

        <Window open={open} onClose={() => setOpen(false)}>
            <ChipRequest onClose={() => setOpen(false)}/>
        </Window>
    </Column>
}

function ChipRequest({onClose}: { onClose?: () => void }) {
    const [amount, setAmount] = useState("0");
    const [loading, setLoading] = useState(false);

    const requestChips = async () => {
        setLoading(true);

        const result = await createChipRequest(amount, "in");
        if (result) {
            toast.success(result);
            if (onClose) onClose();
        }

        setLoading(false);
    }

    return <Column style={{gap: "10px"}}>
        <strong>Мөнгөө уг дансруу хийнэ үү</strong>
        <strong>Данс: 5026651505</strong>
        <strong>Нэр: Baasanchuluun</strong>
        <TextField onSubmit={requestChips} onChange={(e) => setAmount(e.target.value)} value={amount}
                   caption={"Авах chip-ны хэмжээ"} type={"number"}/>
        <button onClick={requestChips} style={{padding: "4px", cursor: "pointer"}}>{<Loading
            isLoading={loading}/>} {loading || "Хүсэлт илгээх"}</button>
    </Column>
}
