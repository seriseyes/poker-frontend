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
    const me = useCookie("token");
    const [room, setRoom] = useState<RoomProps>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = io();

        socket.on("join", (data: RoomProps) => setRoom(data));
        socket.on("leave", (data: RoomProps) => setRoom(data));

        if (me) {
            socket.emit("create", {id: params.roomId});
            socket.emit("join", {id: me, room: params.roomId});
        }

        void async function () {
            setLoading(true);
            const result = await findRoomById(params.roomId!);
            if (result) setRoom(result);
            setLoading(false);
        }();

        return () => {
            socket.off("join");
            socket.emit("leave", {id: me, room: params.roomId});
        }

    }, [me]);

    return <Column style={{marginTop: "10px"}}>
        <span style={{color: "white"}}>Тоглогчид:</span>
        <div className={css.table}>
            {room?.players?.map((player, index) => <div key={index} className={`${css["pos" + index]} ${css.player}`}>{player.username}</div>)}
        </div>

        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}
