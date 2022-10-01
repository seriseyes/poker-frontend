import {useParams} from "react-router-dom";
import css from "./Game.module.css";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {RoomProps} from "../table/Table";
import {findCalculatedRoomById, findRoomById, startRoom} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";
import Row from "../../components/layout/Row";
import Player from "./Player";
import {toast} from "react-toastify";

export default function Game() {
    const params = useParams();
    const me = useCookie("username");
    const [room, setRoom] = useState<RoomProps>();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        if (me) {
            const socket = io();
            setSocket(socket);

            socket.on("check_room", async (data) => {
                setLoading(true);
                if (data.message === "success") {
                    const result = await findCalculatedRoomById(params.roomId!);
                    if (result) {
                        if (result.started && !result.players?.some(el => el.player.username === me)) {
                            toast.info("Тоглолт эхэлсэн байна. Та зөвхөн үзэх боломжтой.")
                        }
                        setRoom(result);
                    }
                }
                setLoading(false);
            });
            socket.emit("join_room", {room: params.roomId});
            socket.emit("check_room", {user: me, room: params.roomId});

            return () => {
                if (me && socket) {
                    socket.off("check_room");
                    socket.emit("leave", {id: me, room: params.roomId});
                }
            }
        }
    }, [me]);

    const start = async () => {
        setLoading(true);
        if (socket && me) {
            socket.emit("check_room", {user: me, room: params.roomId, started: true});
        }
        setLoading(false);
    }

    return <Column style={{marginTop: "10px", gap: "10px", alignItems: "center", justifyContent: "center", height: "100vh"}}>

        <div style={{border: "8px solid #984C4C", width: "910px", height: "510px", borderRadius: "135px", boxSizing: "border-box"}}>
            <div className={css.grid}>
                <Row className={css.cardPos}>
                    {room?.cards?.map((card, index) => {
                        return <img key={index} src={require(`../../assets/cards/${card}.png`)} alt={"Playing card " + card}/>
                    })}
                </Row>

                {room?.players?.map((player, index) =>
                    <Player key={index}
                            cards={player.cards || []}
                            chips={player.player.chips || 0}
                            name={player.player.username}
                            order={index}
                    />)}
            </div>
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
