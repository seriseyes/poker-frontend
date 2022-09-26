import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Router from "./Router";
import './Globals.css';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Router/>
            <Notification/>
        </BrowserRouter>
    </React.StrictMode>
);

export default function Notification() {
    return (
        <ToastContainer
            position={"top-center"}
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
}
