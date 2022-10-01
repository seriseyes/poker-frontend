import {AxiosError} from "axios";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

enum ErrorInterface {
    VALIDATION = "VALIDATION",
    DUPLICATION = "DUPLICATION",
}

export interface CustomError {
    fields: { field: string, message: string }[]
    type: ErrorInterface;
}

export function handler(err: AxiosError) {
    if (!err || !err.response) {
        toast.error("Сүлжээний алдаа гарлаа");
        return;
    }
    if (err.response.status === 401) {
        toast.error(<div>
            Хандалтын хугацаа дууссан байна.
            <Link to={"/"}> Энд дарж дахин нэвтэрнэ үү</Link>
        </div>, {autoClose: 5000});
        return;
    }

    const data = err.response.data as CustomError;
    if (data.type === ErrorInterface.VALIDATION) {
        toast.error(data.fields[0].message);
    }

    toast.error(err.response.data ? err.response.data as string : err.message as string);
}
