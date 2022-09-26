import {Link, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/Store";
import App from "./views/app/App";
import Menu from "./views/menu/Menu";

export default function Router() {
    return (
        <Provider store={store}>
            <div style={{width: "100%", height: "100%"}}>
                <Routes>
                    <Route path="/app/*" element={<App/>}/>
                    <Route path="/" element={<Menu/>}/>
                    <Route path="*" element={<NoMatch/>}/>
                </Routes>
            </div>
        </Provider>
    );
}

function NoMatch() {
    return <div>Хуудас олдсонгүй. <Link to={"/"}>Энд дарж буцна уу.</Link></div>;
}
