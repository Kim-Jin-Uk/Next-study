import React from "react";
import AppLayout from "../../components/AppLayout";
import CustomInput from "../../components/CutomInput";

const Custom = () => {

    return(
        <AppLayout>
            {/*컴포넌트 분리, 렌더링 확인해보기*/}
            <CustomInput></CustomInput>
            <div>None rendering area</div>
        </AppLayout>
    )
}

export default Custom
