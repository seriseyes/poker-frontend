import {useParams} from "react-router-dom";
import css from "./Game.module.css";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {RoomProps} from "../table/Table";
import {findRoomById, startRoom} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";
import Row from "../../components/layout/Row";
import Player from "./Player";

export default function Game() {
    const params = useParams();
    const me = useCookie("username");
    const [room, setRoom] = useState<RoomProps>();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        const socket = io();
        setSocket(socket);

        socket.on("join", (data: RoomProps) => setRoom(data));
        socket.on("leave", (data: RoomProps) => setRoom(data));
        socket.on("started", (data: RoomProps) => setRoom(data));

        if (me) {
            socket.emit("create", {id: params.roomId});
            socket.emit("join", {id: me, room: params.roomId});
        }

        void async function () {
            setLoading(true);
            const result = await findRoomById(params.roomId!);
            if (result && me) {
                if (result.started) socket.emit("started", {id: me, room: params.roomId});
            }
            if (result) setRoom(result);
            setLoading(false);
        }();

        return () => {
            socket.off("join");
            if (me) socket.emit("leave", {id: me, room: params.roomId});
        }

    }, [me]);

    const start = async () => {
        setLoading(true);
        const result = await startRoom(params.roomId!);
        if (result === "success" && socket && me) {
            socket.emit("started", {id: me, room: params.roomId});
        }
        setLoading(false);
    }

    return <Column style={{marginTop: "10px", gap: "10px"}}>
        <span style={{color: "white"}}>Тоглогчид:</span>
        {room?.players?.map((player, index) =>
            <Player key={index}
                    cards={player.cards || []}
                    chips={player.player.chips || 0}
                    name={player.player.username}
                    order={index}
            />)}

        <div className={css.table}>
            {room?.cards?.map((card, index) => {
                return <img key={index} src={require(`../../assets/cards/${card}.png`)} alt={"Playing card " + card}/>
            })}
        </div>

        <Row style={{gap: "10px"}}>
            <button className={css.btn}>Fold</button>
            <button className={css.btn}>Call</button>
            <button className={css.btn}>Raise</button>
            {room?.started || me == null || !me.includes(!room ? "" : !room.players ? "" : room.players[0].player.username) ? null :
                <button disabled={room?.started} onClick={start} className={`${css.btn} ${css.start}`}>Эхлэх</button>}
        </Row>

        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}
