import axios from "../../../utils/AxiosInstance";
import {handler} from "../../../utils/Handler";
import {AxiosError} from "axios";
import {RoomProps} from "../Table";

export const createRoom = async (tableId: string) => {
    try {
        const res = await axios.get<string>("/room/create?tableId=" + tableId);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}

export const moveRoom = async (roomId: string) => {
    try {
        const res = await axios.get<string>("/room/move?roomId=" + roomId);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}

export const findAllRoomByTableId = async (tableId: string) => {
    try {
        const res = await axios.get<RoomProps[]>("/room/all/tableId?tableId=" + tableId);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}


export const findRoomById = async (id: string) => {
    try {
        const res = await axios.get<RoomProps>("/room/id?id=" + id);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}


export const startRoom = async (id: string) => {
    try {
        const res = await axios.get<string>("/room/start?id=" + id);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}

export const findCalculatedRoomById = async (id: string) => {
    try {
        const res = await axios.get<RoomProps>("/room/calculated?id=" + id);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}
