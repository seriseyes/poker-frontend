import React from "react";
import css from "./Layout.module.css";

export interface ColumnProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export default function Column(props: ColumnProps) {
    return <div onClick={props.onClick}
                style={props.style}
                className={`${css.column} ${props.className || ""}`}>
        {props.children}
    </div>
}
