import React, {useEffect, useRef} from "react";
import Select from "react-select";

interface Props {
    caption?: string;
    defaultValue?: { value: string, label: string };
    options: { value: string, label: string }[];
    value?: { value: string, label: string };
    onChange?: (value: { value: string, label: string }) => void;
    onFocus?: () => void;
    name?: string;
    isMulti?: boolean;
    hideKeyboard?: boolean;
    placeholder?: string;
    style?: React.CSSProperties;
}

export default function SelectField(props: Props) {
    const input = useRef<any>();

    const styles = {
        singleValue: (provided: any, state: any) => ({
            ...provided,
            color: "black"
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            background: "#E5EAEF",
            border: "none",
            borderRadius: '6px',
            cursor: "pointer"
        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            zIndex: 100
        }),
    }

    useEffect(() => {
        if (props.hideKeyboard) input.current.inputRef.inputMode = "none";
    }, [props.hideKeyboard]);

    return (
        <div style={props.style}>
            {props.caption ? <label style={{display: "block", paddingBottom: "5px"}}>{props.caption}</label> : null}
            <Select
                ref={input}
                styles={styles}
                defaultValue={props.defaultValue}
                options={props.options}
                onChange={(e:any) => props.onChange && props.onChange(e)}
                value={props.value}
                onFocus={props.onFocus}
                name={props.name}
                isMulti={props.isMulti}
                closeMenuOnSelect={!props.isMulti}
                placeholder={props.placeholder || "Сонгох"}
            />
        </div>
    );
}
