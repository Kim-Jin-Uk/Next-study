import React, {memo} from "react";
import useInput from "../../hooks/useInput";

const CustomInput = () => {
    const [name,onChangeName,setName] = useInput('')
    return(
        <>
            <input
                placeholder="이름을 입력하세요"
                value={name}
                onChange={onChangeName}
            ></input>
            <div>{name}</div>
        </>
    )
}

export default CustomInput

