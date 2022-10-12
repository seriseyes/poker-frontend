import {useNavigate, useParams} from "react-router-dom";
import css from "./Game.module.css";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {RoomProps} from "../table/Table";
import {createRoom, findCalculatedRoomById} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";
import Row from "../../components/layout/Row";
import Player from "./Player";
import {toast} from "react-toastify";
import TextField from "../../components/form/TextField";
import Chat from "../chat/Chat";

export default function Game() {
    const navigate = useNavigate();
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
                    const result = await findCalculatedRoomById(data.newRoom ? data.newRoom : params.roomId!);
                    if (result) {
                        if (result.started && !result.players?.some(el => el.player.username === me)) {
                            toast.info("Тоглолт эхэлсэн байна. Та зөвхөн үзэх боломжтой.")
                        }
                        setRoom(result);
                        if (result.players && !result.started && result.players.length > 1) {
                            toast.info("Тоглолт эхэлж байна...", {autoClose: 5000, toastId: "st"});
                        }
                        if (result.players && !result.started && result.players.length > 1 && result.players[0].player.username === me) {
                            setTimeout(() => {
                                setLoading(true);
                                socket.emit("check_room", {user: me, room: params.roomId, started: true});
                                setLoading(false);
                            }, 5000);

                        }
                        if (result.winner && data.show !== 'no') {
                            toast.info(result.winner + " хожлоо. Pot: " + result.pot,
                                {autoClose: 5000});
                            toast.info("5 секундын дараа дараагийн тоглолт эхэлнэ.",
                                {
                                    position: "bottom-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: false,
                                    pauseOnHover: false,
                                    draggable: true,
                                    progress: undefined,
                                });

                            if (result.winner === me) {
                                setTimeout(async () => {
                                    const newRoom = await createRoom(params.tableId!);
                                    socket.emit("move", {oldRoom: params.roomId, room: newRoom});
                                }, 5000);
                            }
                        }
                    }
                }
                setLoading(false);
            });

            socket.on("move", async (data) => {
                navigate(`/app/game/${params.tableId}/${data.room}`);
            });

            socket.emit("join_room", {room: params.roomId});
            socket.emit("check_room", {user: me, room: params.roomId});

            return () => {
                if (me && socket) {
                    socket.emit("leave", {user: me, room: params.roomId});
                    socket.off("check_room");
                    socket.disconnect();
                }
            }
        }
    }, [me, params]);

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

    return <Column className={css.game}>
        <div className={css.grid}>
            <Column className={css.cardPos}>
                <Row>
                    {room?.cards?.map((card, index) => {
                        return <img className={css.cards} key={index} src={require(`../../assets/card/${card}.png`)}
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

        <Row style={{flexWrap: "wrap", alignItems: "center"}}>
            <Interval room={room} action={action}/>
            <button disabled={room?.current !== me} onClick={() => action("fold")} className={css.btn}>Fold</button>
            <button disabled={room?.current !== me} onClick={() => action("call")} className={css.btn}>Call</button>
            <button disabled={room?.current !== me} onClick={() => action("check")} className={css.btn}>Check</button>
            <Row>
                <TextField style={{width: "100px"}} onChange={(e: any) => setRaise(e.target.value)}
                           value={raise.toString()} type={"number"}/>
                <button disabled={room?.current !== me} onClick={() => action("raise")} className={css.btn}>Raise
                </button>
            </Row>
        </Row>

        {socket && me ? <Chat me={me} socket={socket} room={params.roomId!}/> : null}
        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}

function Interval({action, room}: { action: (name: string) => void, room?: RoomProps }) {
    const [second, setSecond] = useState(15);

    useEffect(() => {
        setSecond(15);
        let interval: NodeJS.Timer;
        interval = setInterval(() => {
            setSecond(second => {
                if (second < 2) action("fold");
                return second - 1
            });
        }, 1000);
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [room]);

    return <div style={{color: "white", marginRight: "5px"}}>{second}</div>
}
