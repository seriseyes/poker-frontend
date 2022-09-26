import css from "./Layout.module.css";
import React from "react";
import {ColumnProps} from "./Column";

export default function Row(props: ColumnProps) {
    return <div onClick={props.onClick}
                style={props.style}
                className={`${css.row} ${props.className || ""}`}>
        {props.children}
    </div>
}
