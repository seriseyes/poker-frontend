import React, {useEffect, useState} from 'react';
import css from './App.module.css';
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import Home from "../home/Home";
import Table from "../table/Table";
import Navbar from "./components/Navbar";
import sit from "../../assets/images/sit.jpg";
import Account from "../account/Account";
import Game from "../game/Game";
import Admin from "../admin/Admin";
import {createRoom, moveRoom} from "../table/service/RoomDAO";
import Loading from "../../components/ui/Loading";
import {io} from "socket.io-client";
import useCookie from "../../hooks/useCookie";

export default function App() {
    return <div style={{width: "100%", height: "100%"}}>
        <img className={css.image} src={sit} alt="GOT sit"/>
        <Navbar/>
        <div style={{position: "fixed", top: 0, left: "180px", right: 0}}>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/table" element={<Table/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/remain" element={<Account/>}/>
                <Route path="/game/:tableId/:roomId" element={<Game/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/moving/:winner/:tableId/:roomId" element={<Moving/>}/>
            </Routes>
        </div>
    </div>;
}

export function Moving() {
    const navigate = useNavigate();
    const params = useParams();
    const me = useCookie("username");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (me) {
            const socket = io();

            socket.emit("join_room", {room: params.roomId});

            socket.on("move", data => {
                if (data.message === 'success') {
                    navigate("/app/game/" + params.tableId + "/" + data.room);
                }
            });

            void async function () {
                if (params.winner === me) {
                    setLoading(true);
                    const result = await moveRoom(params.roomId!);
                    if (result) {
                        socket.emit("move", {newRoom: result, room: params.roomId});
                    }
                    setLoading(false);
                }
            }();

            return () => {
                if (me && socket) {
                    socket.off("move");
                    socket.disconnect();
                }
            }
        }
    }, [me]);

    return <h3 style={{color: "white"}}>
        Түр хүлээнэ үү. Дараагийн тоглолтын үүсгэж байна...
        <Loading isLoading={loading} isFull={true}/>
    </h3>
}
