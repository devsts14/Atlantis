import {combineReducers} from 'redux';
import {userReducer} from './userReducer'
import {searchReducer} from './searchReducer'
import {cartReducer} from './cartReducer'
import {drawerReducer} from './drawerReducer'
import {alertReducer} from './alertReducer'
import {checkoutReducer} from './checkoutReducer'

const rootReducer=combineReducers({
  user:userReducer,
  search:searchReducer,
  cart:cartReducer,
  drawer:drawerReducer,
  alert:alertReducer,
  checkout:checkoutReducer
})

export default rootReducer;