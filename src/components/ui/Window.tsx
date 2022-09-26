import ReactDOM from "react-dom";
import Column from "../layout/Column";
import Row from "../layout/Row";
import css from "./Window.module.css";
import React from "react";
import {IoMdClose} from "react-icons/io";

interface Props {
    open: boolean;
    caption?: string;
    width?: string;
    height?: string;
    children: React.ReactNode;
    onClose: () => void;
    style?: React.CSSProperties;
}

export default function Window(props: Props) {
    if (!props.open) return null;

    return ReactDOM.createPortal(
        <Column className={css.modal}>
            <Column className={css.window} style={{...props.style, width: props.width ? props.width : "auto", height: props.height ? props.height : "auto"}}>
                <Row className={css.modalHeader}>
                    <span/>
                    <h2>{props.caption}</h2>
                    <IoMdClose onClick={props.onClose} className={css.closeIcon}/>
                </Row>
                <Column style={{height: props.height, width: props.width, overflow: "auto", alignSelf: "center"}}>
                    {props.children}
                </Column>
            </Column>
        </Column>, document.getElementById("window") as HTMLElement
    );
}
