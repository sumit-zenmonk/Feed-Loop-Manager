"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../feature/auth/auth-slice";

// User Reducer
import UserfeedbackReducer from "../feature/user/feedback/feedback-slice";

// Admin Reducer
import adminUserReducer from "../feature/admin/user/user-slice";

// global Reducer
import globalfeedbackReducer from "../feature/global/feedback/feedback-slice";

const persistConfig = {
    key: "root",
    storage,
};

const appReducer = combineReducers({
    authReducer: authReducer,
    UserfeedbackReducer: UserfeedbackReducer,
    globalfeedbackReducer: globalfeedbackReducer,
    adminUserReducer: adminUserReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type.includes("auth/logout/fulfilled")) {
        // storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;