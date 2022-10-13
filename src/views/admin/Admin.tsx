import Column from "../../components/layout/Column";
import Window from "../../components/ui/Window";
import Loading from "../../components/ui/Loading";
import React, {useEffect, useState} from "react";
import {TableProps} from "../table/TableChoose";
import TextField from "../../components/form/TextField";
import SelectField from "../../components/form/SelectField";
import {createTable} from "./service/AdminDAO";
import {toast} from "react-toastify";
import DataTable, {TableColumn} from "react-data-table-component";
import {Auth} from "../auth/model/Auth";
import {banUser, findAllUsers} from "../auth/service/AuthDAO";
import {confirmChipRequest, findAllChipRequestByStatus} from "../account/service/ChipDAO";

export interface ChipRequest {
    _id: string;
    user: Auth,
    accepted?: Auth,
    amount: number,
    status: string
}

export default function Admin() {
    const [state, setState] = useState("user");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState({
        open: false,
        username: "",
        id: ""
    });
    const [users, setUsers] = useState<Auth[]>([]);
    const [chips, setChips] = useState<ChipRequest[]>([]);

    const columns: TableColumn<Auth>[] = [
        {name: 'Нэр', selector: row => row.username,},
        {
            name: 'Chips', selector: row => !row.chips ? "0" : row.chips.toString(),
        },
        {
            name: 'Ban', cell: row => {
                return <button onClick={() => ban(row._id!)}
                               style={{padding: "4px", fontWeight: "bold", cursor: "bold"}}>
                    {row.ban ? "Unban" : "Ban"}
                </button>
            },
        },
    ];

    const chipColumns: TableColumn<ChipRequest>[] = [
        {name: 'Хүсэлт гаргасан', selector: row => row.user?.username,},
        {
            name: 'Баталгаажуулсан хэрэглэгч',
            selector: row => !row.accepted ? "Баталгаажуулаагүй" : row.accepted?.username,
        },
        {name: 'Chip хэмжээ', selector: row => row.amount,},
        {name: 'Баталгаажуулсан эсэх', selector: row => row.status === "inactive" ? "Тийм" : "Үгүй",},
        {
            name: 'Баталгаажуулах', cell: row => {
                return <button onClick={() => setOpenConfirm({open: true, username: row.user?.username, id: row._id})}
                               style={{padding: "4px", fontWeight: "bold", cursor: "bold"}}>
                    {"Энд дарж баталгаажуулах"}
                </button>
            },
        },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await findAllUsers();
        if (result) {
            setUsers(result);
        }
        setState('user');
        setLoading(false);
    }

    const fetchChips = async () => {
        setLoading(true);
        const result = await findAllChipRequestByStatus("active");
        if (result) {
            setChips(result);
        }
        setState('chip');
        setLoading(false);
    }

    const ban = async (id: string) => {
        setLoading(true);
        const result = await banUser(id);
        if (result) {
            toast.success(result);
            fetchUsers();
        }
        setLoading(false);
    }

    const confirm = async (id: string) => {
        setLoading(true);
        const result = await confirmChipRequest(id);
        if (result) {
            toast.success(result);
            fetchChips();
            setOpenConfirm({open: false, username: "", id: ""});
        }
        setLoading(false);
    }

    return <Column>
        <Column style={{alignSelf: "flex-end", gap: "5px"}}>
            <button onClick={() => setOpen(true)} className={"button"}>Ширээ үүсгэх</button>
            <button onClick={fetchUsers} className={"button"}>Тоглогчдийн жагсаалт</button>
            <button onClick={fetchChips} className={"button"}>Цэнэглэлт баталгаажуулалт</button>
        </Column>

        <Window open={open} onClose={() => setOpen(false)}>
            <TableRegister onClose={() => setOpen(false)}/>
        </Window>

        <Window width={"300px"} open={openConfirm.open} onClose={() => setOpenConfirm({open: false, username: "", id: ""})}>
            <strong>Та "{openConfirm.username}" гэх нэртэй тоглогчийн хүсэлтийг баталгаажуулахдаа итгэлтэй байна
                уу?</strong>
            <button onClick={() => confirm(openConfirm.id)}>Тийм</button>
            <button onClick={() => setOpenConfirm({open: false, username: "", id: ""})}>Үгүй</button>
        </Window>

        {open ? null : state === 'user' ? <DataTable
                columns={columns}
                data={users}
                style={{width: "100%"}}
                noDataComponent={"Хэрэглэгч олдсонгүй"}
            /> :
            <DataTable
                columns={chipColumns}
                data={chips}
                style={{width: "100%"}}
                noDataComponent={"Хүсэлт олдсонгүй"}
            />
        }

        <Loading isLoading={loading} isFull={true}/>
    </Column>;
}

function TableRegister({onClose}: { onClose?: () => void }) {
    const [state, setState] = useState<TableProps>({
        type: "Texas",
        big: 0,
        small: 0
    });
    const [loading, setLoading] = useState(false);
    const types = [
        {value: "Texas", label: "Texas"},
        {value: "Omaha", label: "Omaha"},
    ];

    const onSubmit = async () => {
        setLoading(true);
        const result = await createTable(state);
        if (result) {
            toast.success(result);
            onClose && onClose();
        }
        setLoading(false);
    }

    const onChange = (e: any) => setState({...state, [e.target.name]: e.target.value});

    return <Column>
        <h2>Ширээ үүсгэх</h2>
        <SelectField onChange={(e) => setState({...state, type: e.value})}
                     value={{label: state.type, value: state.type}} name={"type"}
                     caption={"Төрөл"} options={types}/>
        <TextField onSubmit={onSubmit} maxLength={8} onChange={onChange} value={state.big.toString()} name={"big"}
                   caption={"Big"}
                   type={"number"}/>
        <TextField onSubmit={onSubmit} maxLength={8} onChange={onChange} value={state.small.toString()} name={"small"}
                   caption={"Small"}
                   type={"number"}/>

        <button style={{marginBottom: "10px", marginTop: "10px"}} onClick={onSubmit} className={"button primaryBg"}>{
            <Loading isLoading={loading}/>} {loading || "Үүсгэх"}
        </button>
    </Column>
}
