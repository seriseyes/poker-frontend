import css from "./Player.module.css";
import Row from "../../components/layout/Row";
import {useEffect} from "react";
import Column from "../../components/layout/Column";

interface PlayerProps {
    name: string;
    cards: string[];
    chips: number;
    order: number;
}

export default function Player(props: PlayerProps) {

    useEffect(() => {

    }, []);

    return <Column className={`${css["pos" + props.order]} ${css.wrap}`}>
        <div>
            {props.name}
        </div>
        <Row>
            {props.cards.map((card, index) => {
                return <img key={index} src={require(`../../assets/cards/${card}.png`)} alt={"Playing card " + card}/>
            })}
        </Row>
        <div>
            {props.chips + "₮"}
        </div>
    </Column>;
}
