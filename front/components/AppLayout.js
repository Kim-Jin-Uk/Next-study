import React from "react";
import PropTypes from 'prop-types'
import Link from 'next/link'

const AppLayout = ({children}) => {
    return(
        <>
            <div>AppLayout component</div>
            <div>
                {/*<Link />를 사용할 경우 prefetch를 통해 페이지를 새로 고치지 않고 이동 가능*/}
                <Link href={'/test'}><a>test</a></Link>
                <div></div>
                <Link href={'/test/custom'}><a>custom</a></Link>
                <div></div>
                {/*직접 확인해보자*/}
                <a href="/test">none prepetch test</a>
                <div></div>
                <a href="/test/custom">none prepetch custom</a>
            </div>
            {children}
        </>
    )
}

//없어도 상관없으나 혹시모를 오류 방지
AppLayout.propTypes = {
    //return 안에 들어갈 수 있는 모든것들이 node 여기에서 node는 백이 아닌 react에서의 노드
    children: PropTypes.node.isRequired,
}

export default AppLayout
