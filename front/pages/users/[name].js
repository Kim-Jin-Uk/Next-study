import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

const Name = () => {
    const router = useRouter()
    const [name,setName] = useState(router.query.name)

    useEffect(() => {
        if (!router.isReady) return
        setName(router.query.name)
    },[router.isReady])

    return(
        <>
            <div>{name}</div>
            <div>Hello</div>
        </>
    )
}

export default Name
