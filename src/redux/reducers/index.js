import {combineReducers} from 'redux'
import Authreducers from './Authreducers'
import HeaderReducers from './Headerreducers'
import CartReducers from './Cartreducers'

export default combineReducers({
    Auth:Authreducers,
    Header:HeaderReducers,
    Cart:CartReducers
})