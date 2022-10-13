import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import css from "./Table.module.css";
import {io} from "socket.io-client";
import Action from "./Action";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";
import {RoomModel} from "./models/GameModels";
import {toast} from "react-toastify";
import Player from "./Player";
import {createRoom, findRoomById} from "../table/service/RoomDAO";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";

export default function Table() {
    const params = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState<any>();
    const [room, setRoom] = useState<RoomModel>();
    const [loading, setLoading] = useState(false);
    const token = useCookie("token");
    const username = useCookie("username");

    useEffect(() => {
        if (params && token && username) {
            const socket = io();
            setSocket(socket);
            socket.on("update", async (data: any) => {
                setLoading(true);
                const result = await findRoomById(params.roomId!);
                setLoading(false);
                if (result) {
                    setRoom(result);
                    console.log(data, result);
                    if (data.started && !result.started) {
                        toast.info("Тоглолт эхэлж байна...", {
                            autoClose: 3000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            toastId: "st"
                        });
                        setTimeout(() => {
                            if (data.started && result.players[0].player.username === username) {
                                socket.emit('start', {token, room: params.roomId, round: params.round});
                            }
                        }, 3000);
                    }
                }
            });
            socket.on("won", async (data: any) => {
                toast(data.winner + " ялсан байна!", {
                    autoClose: 4000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                });
                toast.info("Дараагийн тоглолт эхэлж байна...", {
                    autoClose: 4000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "bottom-center"
                });
                if (data.winner === username) {
                    const newRoom = await createRoom(params.tableId!);
                    socket.emit("move", {
                        room: params.roomId,
                        newRoom
                    });
                }
            });
            socket.on("move", (data: any) => {
                setTimeout(() => {
                    navigate(`/app/game/${params.tableId}/${data.room}/${params.roomId}`);
                }, 4000);
            });
            socket.emit("join", {token, room: params.roomId});

            return () => {
                if (token && socket && username) {
                    socket.emit("leave", {token, room: params.roomId});
                    socket.disconnect();
                }
            }
        }
    }, [params, token, username]);

    if (!params.roomId || !socket || !room || !token || !username) return <Loading isLoading={true} isFull={true}/>;

    return <div className={css.wrap}>
        <div className={css.grid}>
            {room.players.map((el) => <Player
                key={el.player._id}
                _id={el.player._id}
                order={el.order}
                username={el.player.username}
                chips={el.player.chips}
                fold={el.fold}
                action={el.action}
                roomId={params.roomId!}
                status={el.status}
                turn={el.player._id === room.current}
                big={el.big}
                small={el.small}
            />)}

            <Column className={css.cardPos}>
                <Column style={{alignItems: "center"}}>
                    <Row>
                        {room.cards.map((card, index) => {
                            return <img className={css.cards} key={index + "-card"}
                                        src={require(`../../assets/card/${card}.png`)}
                                        alt={"Playing card " + card}/>
                        })}
                    </Row>
                    Pot: {room.pot}
                </Column>
            </Column>
        </div>

        <Action player={room.players.filter(f => f.player.username === username)[0].player} token={token}
                room={room}
                socket={socket}/>
        <Loading isLoading={loading} isFull={true}/>
    </div>
}
