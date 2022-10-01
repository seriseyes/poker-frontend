import React from 'react';
import css from './App.module.css';
import {Route, Routes} from "react-router-dom";
import Home from "../home/Home";
import Table from "../table/Table";
import Navbar from "./components/Navbar";
import sit from "../../assets/images/sit.jpg";
import Account from "../account/Account";
import Game from "../game/Game";
import Admin from "../admin/Admin";

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
            </Routes>
        </div>
    </div>;
}
