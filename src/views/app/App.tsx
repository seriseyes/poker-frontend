import React from 'react';
import css from './App.module.css';
import {Route, Routes} from "react-router-dom";
import Home from "../home/Home";
import Table from "../table/Table";
import Navbar from "./components/Navbar";
import sit from "../../assets/images/sit.jpg";
import Account from "../account/Account";

export default function App() {
    return <div>
        <img className={css.image} src={sit} alt="GOT sit"/>
        <Navbar/>
        <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/table" element={<Table/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/remain" element={<Account/>}/>
        </Routes>
    </div>;
}
