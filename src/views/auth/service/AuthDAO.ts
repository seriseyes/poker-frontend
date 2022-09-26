import {handler} from "../../../utils/Handler";
import {Auth} from "../model/Auth";
import axios from "../../../utils/AxiosInstance";
import {RegisterModel} from "../Register";
import {AxiosError} from "axios";
import {toast} from "react-toastify";

export const login = async (model: Auth) => {
    try {
        const res = await axios.post("/auth/login", model);
        return res.data;
    } catch (e) {
        const error = e as AxiosError;
        if (error && error.response?.status === 401) {
            toast.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
        }
    }
}

export const register = async (model: RegisterModel) => {
    try {
        const res = await axios.post("/user/create", model);
        return res.data;
    } catch (e) {
        handler(e as AxiosError);
    }
}
