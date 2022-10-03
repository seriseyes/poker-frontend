import css from "./Player.module.css";
import Row from "../../components/layout/Row";
import {useEffect} from "react";
import Column from "../../components/layout/Column";

interface PlayerProps {
    name: string;
    cards: string[];
    chips: number;
    order: number;
    current: boolean;
    big: boolean;
    small: boolean;
    status: string;
    bet: number;
}

export default function Player(props: PlayerProps) {

    useEffect(() => {

    }, []);

    return <Column style={{border: `2px solid ${props.status  ==='inactive' ? 'red' : props.current ? "yellow" : "white"}`}} className={`${css["pos" + props.order]} ${css.wrap}`}>
        <div>
            {props.name}
        </div>
        <Row>
            {props.cards.map((card, index) => {
                return <img key={index} src={require(`../../assets/cards/${card}.png`)} alt={"Playing card " + card}/>
            })}
        </Row>
        <Row style={{gap: "8px"}}>
            <Column>
                <span>{'Үлд: '+props.chips + "₮"}</span>
                <span>{'Bet: '+props.bet + "₮"}</span>
            </Column>
            {props.big ? <Row className={css.ind}>B</Row> : null}
            {props.small ? <Row className={css.ind}>S</Row> : null}
        </Row>
    </Column>;
}
