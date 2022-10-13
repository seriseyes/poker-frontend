import axios from "../../../utils/AxiosInstance";
import {handler} from "../../../utils/Handler";
import {AxiosError} from "axios";
import {TableProps} from "../TableChoose";

export const findAllActiveRoom = async () => {
    try {
        const res = await axios.get<TableProps[]>("/table/all/active");
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}
