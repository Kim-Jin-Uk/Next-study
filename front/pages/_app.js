import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import wrapper from "../store/configureStore";
import 'antd/dist/antd.css';

const App = ({Component}) =>{

    return(
        <>
            <Head>
                <meta charSet={'utf-8'}/>
                {/*웹 이름 설정해보기*/}
                <title>Jindol Web</title>
            </Head>
            <Component></Component>
        </>
    )
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(App)
