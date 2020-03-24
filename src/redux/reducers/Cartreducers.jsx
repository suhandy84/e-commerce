import{
    CART_TOTAL_QTY
} from './../actions/type'

const INITIAL_STATE={
    totalqty:0
}


export default (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case CART_TOTAL_QTY:
            return {...state,totalqty:action.payload}
        default:
            return state
    }
}