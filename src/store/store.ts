import { configureStore } from "@reduxjs/toolkit";
import { izhApi } from "./izhApi";

export const store = configureStore({
    reducer: {
        [izhApi.reducerPath]: izhApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(izhApi.middleware)
})