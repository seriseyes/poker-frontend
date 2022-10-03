import {useParams} from "react-router-dom";
import css from "./Game.module.css";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {RoomProps} from "../table/Table";
import {findCalculatedRoomById} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";
import Row from "../../components/layout/Row";
import Player from "./Player";
import {toast} from "react-toastify";
import TextField from "../../components/form/TextField";
import Chat from "../chat/Chat";

export default function Game() {
    const params = useParams();
    const me = useCookie("username");
    const [room, setRoom] = useState<RoomProps>();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<any>();
    const [raise, setRaise] = useState(0);

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
                    socket.emit("leave", {user: me, room: params.roomId});
                    socket.disconnect();
                    socket.off("check_room");
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

    const action = async (name: string) => {
        if (name !== 'fold') {
            const toCheck = room?.players?.filter(f => f.player.username === me)[0];
            if (toCheck) {
                const chips = toCheck.player.chips || 0;
                if (chips < raise || chips < (room.call || 0)) {
                    toast.info("Үлдэгдэл хүрэлцэхгүй байна.");
                    return;
                }
            }
        }

        if (name === 'raise' && raise === 0) return;
        socket.emit("check_room",
            {
                user: me,
                room: params.roomId,
                action: name,
                raise: raise
            });
        if (name === "raise") setRaise(0);
    }

    if (!me) return <Loading isLoading={true} isFull={true}/>

    return <Column
        style={{marginTop: "10px", gap: "10px", alignItems: "center", justifyContent: "center", height: "100vh"}}>

        <div style={{
            border: "8px solid #984C4C",
            width: "910px",
            height: "510px",
            borderRadius: "135px",
            boxSizing: "border-box"
        }}>
            <div className={css.grid}>
                <Column className={css.cardPos}>
                    <Row>
                        {room?.cards?.map((card, index) => {
                            return <img key={index} src={require(`../../assets/cards/${card}.png`)}
                                        alt={"Playing card " + card}/>
                        })}
                    </Row>
                    {room?.pot ? <div style={{alignSelf: "center"}}>Pot: {room?.pot}</div> : null}
                </Column>

                {room?.players?.map((player, index) =>
                    <Player key={index}
                            cards={player.cards || []}
                            chips={player.player.chips || 0}
                            name={player.player.username}
                            order={index}
                            current={player.player.username === room?.current}
                            big={player.big}
                            small={player.small}
                            status={player.status}
                            bet={player.bet}
                    />)}
            </div>
        </div>

        <Row style={{gap: "15px"}}>
            <button disabled={room?.current !== me} onClick={() => action("fold")} className={css.btn}>Fold</button>
            <button disabled={room?.current !== me} onClick={() => action("call")} className={css.btn}>Call</button>
            <Row>
                <TextField onChange={(e: any) => setRaise(e.target.value)} value={raise.toString()} type={"number"}/>
                <button disabled={room?.current !== me} onClick={() => action("raise")} className={css.btn}>Raise
                </button>
            </Row>
            {room?.started || !me.includes(!room ? "" : !room.players ? "" : room.players[0].player.username) ? null :
                <button disabled={room?.started} onClick={start} className={`${css.btn} ${css.start}`}>Эхлэх</button>}
        </Row>

        {socket && me ? <Chat me={me} socket={socket} room={params.roomId!}/> : null}

        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}
