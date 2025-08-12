import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// call reducers
import questionReducer from './question_reducer';
import resultReducer from './result_reducer';
import userReducer from './user_reducer';
import otherReducer from './other_reducer';

// configure persist config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // specify the reducer(s) you want to persist
};

// combine reducers
const rootReducer = combineReducers({
    questions: questionReducer,
    result: resultReducer,
    user: userReducer,
    other: otherReducer,
});

// persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create the persisted store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export { store, persistor };
