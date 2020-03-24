import{
    USER_LOGIN_FAILED,
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_REGISTER_START,
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS,
    SEARCH_RESULT
} from './../actions/type'

const INITIAL_STATE={
    username:'',
    id:0,
    loading:false,
    islogin:false,
    islogout:false,
    isregister:false,
    errormes:'',
    role:'',
    hasilcari:[]
}

export default (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case USER_LOGIN_START:
            return {...state,loading:true}
        case USER_LOGIN_SUCCESS:
            return {...state,loading:false,...action.payload,islogin:true}
        case USER_LOGIN_FAILED:
            return{...state,loading:false,errormes:action.payload}
        case USER_REGISTER_START:
            return {...state,loading:true}
        case USER_REGISTER_SUCCESS:
            return {...state,loading:false,successmes:action.payload,isregister:true}
        case USER_REGISTER_FAILED:
            return{...state,loading:false,errormes:action.payload}
        case 'ErrorClear':
            return INITIAL_STATE
        case SEARCH_RESULT:
            return{...state,hasilcari:action.payload}
        default:
            return state
    }
}