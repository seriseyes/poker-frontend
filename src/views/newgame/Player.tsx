import {PlayerModel} from "./models/GameModels";
import css from "./Player.module.css";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {findMyCards} from "../table/service/RoomDAO";

export default function Player(model: PlayerModel) {
    const [action, setAction] = useState<string>(model.action);
    const [cards, setCards] = useState<string[]>([]);

    useEffect(() => {
        if (model.status === 'playing') {
            void async function () {
                const result = await findMyCards(model.roomId, model._id);
                if (result) setCards(result);
            }();
        } else {
            setCards([]);
        }

        let timeout = setTimeout(() => {
            setAction("");
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [model]);

    return <div className={`${css[`pos${model.order}`]} ${css.wrap}`}>
        <div style={{boxSizing: "border-box"}} className={`${model.turn ? css.toggle : ''}`}>
            <Row style={{position: "relative"}}>
                {cards.map((card, index) => {
                    return <img className={css.card} key={index} src={require(`../../assets/card/${card}.png`)}
                                alt={"Playing card " + card}/>
                })}

                {action && <div className={css.action}>
                    {action}
                </div>}
            </Row>
            <Column className={css.info}>
                <div>{model.username}</div>
                <div>{model.chips}₮</div>
            </Column>
            {model.big && <Row className={css.ind}>B</Row>}
            {model.small && <Row className={css.ind}>S</Row>}
        </div>
    </div>
}
