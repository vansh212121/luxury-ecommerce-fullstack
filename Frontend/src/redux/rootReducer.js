import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { productApi } from "@/features/api/productApi";
import { cartApi } from "@/features/api/cartApi";
import { wishlistApi } from "@/features/api/wishlistApi";
import { orderApi } from "@/features/api/orderApi";
import { userApi } from "@/features/api/userApi";
import { categoryApi } from "@/features/api/categoryApi";
import { sizeApi } from "@/features/api/sizeApi";
import { colourApi } from "@/features/api/colourApi";
import { dashboardApi } from "@/features/api/dashboardApi";

const rootReducer = combineReducers({
    // API Reducers
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [colourApi.reducerPath]: colourApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,

    
    // Regular Slice Reducer
    auth: authReducer,
});

export default rootReducer;
