export const initialState = {
    // name:"jinuk",
    // age:27,
    // projects:['react','next','node','express']
    user:{
        isLogin:false,
        userData:null,
        signUpData:{},
        loginData:{}
    },
    video:{
        videoList:[]
    }
}

// action이 너무 많아지기에 동적으로 생성해보자
// const changeName1 = {
//     type:'CHANGE_NAME',
//     data: 'jindol'
// }
//
// const changeName2 = {
//     type:'CHANGE_NAME',
//     data: 'jindol2'
// }

// //action creator
// const changeName = (data) => {
//     return{
//         type:'CHANGE_NAME',
//         data
//     }
// }

export const logInAction = (data) => {
    return{
        type:'LOG_IN',
        data
    }
}

export const logOutAction = () => {
    return{
        type:'LOG_OUT'
    }
}

const rootReducer = (state = initialState, action) => {
    switch (action.type){
        // case 'CHANGE_NAME':
        //     return {
        //         ...state,
        //         name: action.data
        //     }
        case 'LOG_IN':
            return{
                ...state, //video 객체 참조
                user:{
                    ...state.user,
                    isLogin: true,
                    userData:action.data
                }
            }
        case 'LOG_OUT':
            return{
                ...state, //video 객체 참조
                user:{
                    ...state.user,
                    isLogin: false,
                    userData:null
                }
            }
        default:
            return {
                ...state
            }
    }
}

export default rootReducer
