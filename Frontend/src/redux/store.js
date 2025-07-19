import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { productApi } from "@/features/api/productApi";
import { cartApi } from "@/features/api/cartApi";
import { wishlistApi } from "@/features/api/wishlistApi";
import { userApi } from "@/features/api/userApi";
import { categoryApi } from "@/features/api/categoryApi";
import { sizeApi } from "@/features/api/sizeApi";
import { colourApi } from "@/features/api/colourApi";
import { orderApi } from "@/features/api/orderApi";
import { dashboardApi } from "@/features/api/dashboardApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) => 
        defaultMiddleware().concat(
            authApi.middleware,
            productApi.middleware,
            categoryApi.middleware,
            sizeApi.middleware,
            colourApi.middleware,
            cartApi.middleware,
            wishlistApi.middleware,
            orderApi.middleware,
            userApi.middleware,
            dashboardApi.middleware,
        ),
});


const initializeApp = async () => {

};

initializeApp();
