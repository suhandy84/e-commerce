import{
    CART_TOTAL_QTY
} from './../actions/type'

export const TotalQty=(data)=>{
    return{
        type:CART_TOTAL_QTY,
        payload:data
    }
}