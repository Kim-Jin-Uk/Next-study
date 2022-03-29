import React from "react";
import useInput from "../../hooks/useInput";
import AppLayout from "../../components/AppLayout";

const Custom = () => {
    const [name,onChangeName,setName] = useInput('')
    return(
        <AppLayout>
            <input
                placeholder="이름을 입력하세요"
                value={name}
                onChange={onChangeName}
            ></input>
            <div>{name}</div>
        </AppLayout>
    )
}

export default Custom
