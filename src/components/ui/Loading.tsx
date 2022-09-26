import css from "./Loading.module.css";
import ReactDOM from 'react-dom';

interface Props {
    isLoading: boolean;
    isFull?: boolean;
}

export default function Loading(props: Props) {
    if (!props.isLoading) return null;

    if (props.isFull) {
        return ReactDOM.createPortal(
            <div className={css.ldsDualRing}></div>,
            document.getElementById("loading")!
        );
    } else {
        return <div className={css.ldsEllipsis}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    }
}
