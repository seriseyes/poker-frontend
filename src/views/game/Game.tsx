import {useParams} from "react-router-dom";
import css from "./Game.module.css";
import Column from "../../components/layout/Column";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {RoomProps} from "../table/Table";
import {findRoomById} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import useCookie from "../../hooks/useCookie";

export default function Game() {
    const params = useParams();
    const [room, setRoom] = useState<RoomProps>();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        const socket = io();
        setSocket(socket);

        void async function () {
            setLoading(true);
            const result = await findRoomById(params.roomId!);
            if (result) setRoom(result);
            setLoading(false);
        }();

    }, []);

    return <Column style={{marginTop: "10px"}}>
        <span style={{color: "white"}}>Тоглогчид:</span>
        <div className={css.table}>
            {socket && <Players socket={socket} room={params.roomId!} players={room?.players?.map((el, i) => ({
                id: el._id || i + "-player",
                name: el.username,
                position: i
            }))}/>}
        </div>

        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}

interface PlayersProps {
    players?: PlayerProps[];
    socket: any;
    room: string;
}

interface PlayerProps {
    id: string;
    name: string;
    position: number;
}

function Players(props: PlayersProps) {
    const me = useCookie("token");

    useEffect(() => {
        if (me) {
            props.socket.emit("create", {id: props.room});
            props.socket.emit("join", {id: me, room: props.room});
        }
    }, [me]);

    return <>
        {props.players?.map((player, i) => <Column key={player.id}
                                                   className={`${css["pos" + player.position]} ${css.player}`}>
            {player.name}
        </Column>)}
    </>
}
