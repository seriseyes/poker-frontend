import css from "./Player.module.css";
import Row from "../../components/layout/Row";
import {useEffect} from "react";

interface PlayerProps {
    name: string;
    cards: string[];
    chips: number;
    order: number;
}

export default function Player(props: PlayerProps) {

    useEffect(() => {
        console.log(props.cards);
    }, []);

    return <Row className={`${css["pos" + props.order]} ${css.wrap}`}>
        {props.name}

        {props.cards.map((card, index) => {
            return <img key={index} src={require(`../../assets/cards/${card}.png`)} alt={"Playing card " + card}/>
        })}

    </Row>;
}
