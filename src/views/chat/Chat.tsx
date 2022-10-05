import {useEffect, useState} from "react";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import TextField from "../../components/form/TextField";
import css from "./Chat.module.css";
import ScrollToBottom from 'react-scroll-to-bottom';

interface ChatProps {
    socket: any;
    room: string;
    me: string;
}

interface Message {
    message: string;
    sender: string;
}

export default function Chat(props: ChatProps) {
    const [chats, setChats] = useState<Message[]>([]);
    const [chat, setChat] = useState<string>("");

    useEffect(() => {
        props.socket.on("send", (data: Message) => {
            setChats(p => [...p, data]);
        });

        return () => {
            props.socket.off("send");
        }
    }, []);

    const send = () => {
        if (chat !== "") {
            props.socket.emit("send", {
                room: props.room,
                user: props.me,
                message: chat
            });
            setChat("");
        }
    }

    return <Column className={css.col}>
        <ScrollToBottom className={css.wrap}>
            {
                chats.map((el, i) => <Row key={i + "chat"} style={{gap: "5px"}}>
                    <div className={css.sender}>{el.sender + ":"}</div>
                    <div className={css.message}>{el.message}</div>
                </Row>)
            }
        </ScrollToBottom>
        <Row>
            <TextField onSubmit={send} value={chat} onChange={(e:any) => setChat(e.target.value)} placeholder={"Чат..."}/>
            <button onClick={send}>Илгээх</button>
        </Row>
    </Column>
}
