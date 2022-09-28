import Column from "../../components/layout/Column";
import DataTable, {TableColumn, TableStyles, Theme} from 'react-data-table-component';
import {useEffect, useState} from "react";
import {findAllActiveRoom} from "./service/TableDAO";
import Row from "../../components/layout/Row";
import css from "./Table.module.css";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Window from "../../components/ui/Window";
import {Auth} from "../auth/model/Auth";
import {createRoom, findAllRoomByTableId} from "./service/RoomDAO";
import Loading from "../../components/ui/Loading";

export interface TableProps {
    _id: string;
    type: string;
    big: number;
    small: number;
}

export default function Table() {
    const columns: TableColumn<TableProps>[] = [
        {name: 'Ширээ', selector: row => row.type,},
        {name: 'Big', selector: row => row.big,},
        {name: 'Small', selector: row => row.small,},
    ];
    const [tables, setTables] = useState<TableProps[]>([]);
    const [table, setTable] = useState<TableProps>();

    useEffect(() => {
        void async function () {
            const result = await findAllActiveRoom();
            if (result) setTables(result);
        }();
    }, []);

    const filter = (type: string) => {
        toast.info(`Хөгжүүлнэ... [${type}]`)
    }

    return (
        <Column style={{width: "100%"}}>
            <Row style={{gap: "5px"}}>
                <button onClick={() => filter("Texas")} className={css.btn}>Texas</button>
                <button onClick={() => filter("Omaha")} className={css.btn}>Omaha</button>
            </Row>
            <DataTable
                columns={columns}
                data={tables}
                style={{width: "100%"}}
                highlightOnHover={true}
                pointerOnHover={true}
                noDataComponent={"Ширээ олдсонгүй"}
                onRowClicked={(row: TableProps) => setTable(row)}
            />
            <Window caption={"Өрөө сонгох"} width={"300px"} open={!!table} onClose={() => setTable(undefined)}>
                <ChooseRoom table={table!}/>
            </Window>
        </Column>
    );
}

export interface RoomProps {
    _id: string;
    code: string;
    players?: [Auth];
    table: TableProps;
}

function ChooseRoom(props: { table: TableProps }) {
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const columns: TableColumn<RoomProps>[] = [
        {name: 'Код', selector: row => row.code,},
        {name: 'Тоглогч', selector: row => `${row.players?.length}/10`,},
    ];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onClick = async (roomId?: string) => {
        if (!roomId) {
            const result = await createRoom(props.table._id);
            if (result) roomId = result;
        }

        if (!roomId) {
            toast.error("Өрөө үүсгэж чадсангүй");
            return;
        }

        navigate(`/app/game/${props.table?._id}/${roomId}`);
    };

    useEffect(() => {
        void async function () {
            setLoading(true);
            const result = await findAllRoomByTableId(props.table._id);
            if (result) setRooms(result);
            setLoading(false);
        }();
    }, []);

    return <div>
        <DataTable
            columns={columns}
            data={rooms}
            style={{width: "100%"}}
            highlightOnHover={true}
            pointerOnHover={true}
            noDataComponent={<div>
                <h4>Таны сонгосон ширээнд өрөө олдсонгүй</h4>
                <button onClick={() => onClick()}>Шинээр өрөө үүсгэх</button>
            </div>}
            onRowClicked={(row: RoomProps) => onClick(row._id)}
        />
        <Loading isLoading={loading} isFull={true}/>
    </div>;
}
