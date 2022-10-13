import Row from "../../components/layout/Row";
import css from "./General.module.css";
import {useEffect, useState} from "react";
import {ActionModel} from "./models/GameModels";
import {toast} from "react-toastify";
import Column from "../../components/layout/Column";

export default function Action(model: ActionModel) {
    const [raise, setRaise] = useState("0");
    const [second, setSecond] = useState(15);

    useEffect(() => {
        setSecond(15);
        let interval: NodeJS.Timer;
        if (model.room.started && model.room.current === model.player._id) {
            interval = setInterval(() => {
                setSecond(second => {
                    if (second < 2) action("fold");
                    return second - 1
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [model]);

    const action = (name: string) => {
        if (name === 'raise') {
            if (model.player.chips < parseInt(raise)) {
                toast.error("Үлдэгдэл хүрэлцэхгүй байна");
                return;
            }
        } else if (name === 'call') {
            if (model.player.chips < model.room.call) {
                toast.error("Үлдэгдэл хүрэлцэхгүй байна");
                return;
            }
        }

        model.socket.emit('action', {
            room: model.room._id,
            action: name,
            raise: raise,
            token: model.token
        });
    }

    if (model.room.current !== model.player._id) return <div
        style={{
            background: "rgba(255, 255, 255, 0.5)",
            padding: "2px 10px",
            fontWeight: "bold",
            color: "white",
            borderRadius: "6px"
        }}>Таны ээлж ирээгүй
        байна</div>

    return <Column style={{alignItems: "center", gap: "5px"}}>
        <Row className={css.btnActionWrap}>
            <button onClick={() => action('check')} className={css.btnAction}>Check</button>
            <button onClick={() => action('call')} className={css.btnAction}>Call</button>
            <Row>
                <button style={{padding: "0 2px", borderRight: "1px solid black"}} onClick={() => action('raise')}
                        className={css.btnAction}>Raise
                </button>
                <input value={raise} onChange={(e: any) => setRaise(e.target.value)} type="number"/>
            </Row>
            <button style={{background: "rgba(140, 0,0)", color: "white"}} onClick={() => action('fold')}
                    className={css.btnAction}>Fold
            </button>
        </Row>
        {model.room.started && <div style={{
            color: "darkred",
            fontWeight: "bold",
            background: "rgba(255, 255, 255, 0.7)",
            padding: "2px 4px",
            borderRadius: "12px"
        }}>
            {second} секундын дотор үйлдэл хийнэ үү!
        </div>}
    </Column>
}
