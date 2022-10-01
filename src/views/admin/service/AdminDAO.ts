import axios from "../../../utils/AxiosInstance";
import {handler} from "../../../utils/Handler";
import {AxiosError} from "axios";
import {TableProps} from "../../table/Table";

export const createTable = async (model: TableProps) => {
    try {
        const res = await axios.post<string>("/table/create", model);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}
