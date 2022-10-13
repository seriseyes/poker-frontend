import React, {useEffect} from 'react';
import css from './App.module.css';
import {Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import TableChoose from "../table/TableChoose";
import Navbar from "./components/Navbar";
import sit from "../../assets/images/sit.jpg";
import black from "../../assets/images/black.jpg";
import admin from "../../assets/images/admin.jpg";
import Account from "../account/Account";
import Admin from "../admin/Admin";
import Table from "../newgame/Table";

export default function App() {

    return <div style={{width: "100%", height: "100%"}}>
        <Navbar/>
        <div style={{position: "fixed", top: 0, left: "180px", right: 0}}>
            <Routes>
                <Route path="/table" element={<TableChoose/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/remain" element={<Account/>}/>
                <Route path="/game/:tableId/:roomId/:round" element={<Table/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/moving/:tableId/:roomId" element={<Moving/>}/>
            </Routes>
        </div>
        <Background/>
    </div>;
}

function Background() {
    const location = useLocation();

    return <img className={css.image}
                src={location.pathname.includes("admin") ? admin : location.pathname.includes("game") ? black : sit}
                alt="GOT sit"/>
}

export function Moving() {
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        setTimeout(() => {
            navigate("/app/game/" + params.tableId + "/" + params.roomId + "/2");
        }, 2000);
    }, []);

    return <h3 style={{color: "white"}}>
        Түр хүлээнэ үү. Дараагийн тоглолтыг үүсгэж байна...
    </h3>
}
