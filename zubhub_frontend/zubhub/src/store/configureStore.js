import {createStore,applyMiddleware} from 'redux';
import {persistStore,persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import thunk from 'redux-thunk';


const persistConfig = {
  key:'root',
  storage,
  whitelist:['auth']
}

const persistedReducer = persistReducer(persistConfig,rootReducer);

export default ()=>{
  let store = createStore(persistedReducer,applyMiddleware(thunk));
  let persistor = persistStore(store);
  return{
    store,
    persistor
  }
}