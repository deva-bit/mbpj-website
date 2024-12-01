import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sessionStorage from 'redux-persist/lib/storage/session';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import userSlice from './user/userSlice'
import userRoleSlice from './userRole/userRoleSlice'

const persistConfig = {
    key: 'root',
    storage: sessionStorage,
}

const rootReducer = combineReducers({
    user: userSlice,
    userRole:userRoleSlice
})
  
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
