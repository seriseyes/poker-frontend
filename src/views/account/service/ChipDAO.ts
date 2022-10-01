import axios from "../../../utils/AxiosInstance";
import {handler} from "../../../utils/Handler";
import {AxiosError} from "axios";
import {ChipRequest} from "../../admin/Admin";

export const createChipRequest = async (amount: string) => {
    try {
        const res = await axios.get<string>("/chip/create?amount=" + amount);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}

export const findAllChipRequestByStatus = async (status: string) => {
    try {
        const res = await axios.get<ChipRequest[]>("/chip/all/status?status=" + status);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}

export const confirmChipRequest = async (id: string) => {
    try {
        const res = await axios.get<string>("/chip/confirm?id=" + id);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}
