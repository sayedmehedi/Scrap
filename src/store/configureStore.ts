import {api} from "@data/laravel/services/api";
import rootReducer from "./reducers/rootReducer";
import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "@data/laravel/services/auth";
import {notistackSlice} from "./slices/notistackSlice";
import {orderApi} from "@data/laravel/services/order";
import {sellerApi} from "@data/laravel/services/seller";
import {productApi} from "@data/laravel/services/product";
import {setupListeners} from "@reduxjs/toolkit/dist/query";
import {countryApi} from "@data/laravel/services/country";
import {categoryApi} from "@data/laravel/services/category";
import {questionApi} from "@data/laravel/services/question";
import {conditionApi} from "@data/laravel/services/condition";
import {offerNBidsApi} from "@data/laravel/services/offerNBids";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {rtkQueryErrorLogger} from "./middleware/rtkQueryErrorLogger";
import NetInfo, {NetInfoSubscription} from "@react-native-community/netinfo";
import {AppState, AppStateStatus, NativeEventSubscription} from "react-native";
import {
  FLUSH,
  PURGE,
  PERSIST,
  PAUSE,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  whitelist: ["auth"],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createStore(
  preloadedState: Partial<ReturnType<typeof rootReducer>> = {},
) {
  const store = configureStore({
    reducer: persistedReducer,
    preloadedState: preloadedState as any,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        thunk: {
          extraArgument: {},
        },
      }).concat(
        api.middleware,
        authApi.middleware,
        orderApi.middleware,
        sellerApi.middleware,
        countryApi.middleware,
        productApi.middleware,
        categoryApi.middleware,
        questionApi.middleware,
        conditionApi.middleware,
        offerNBidsApi.middleware,
        rtkQueryErrorLogger,
       // createDebugger(),
      ),
  });

  return store;
}

export const store = createStore();

export const persistor = persistStore(store);

let initialized = false;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(
  store.dispatch,
  (dispatch, {onFocus, onFocusLost, onOffline, onOnline}) => {
    function defaultHandler() {
      const handleFocus = () => dispatch(onFocus());
      const handleFocusLost = () => dispatch(onFocusLost());
      const handleOnline = () => dispatch(onOnline());
      const handleOffline = () => dispatch(onOffline());
      const handleVisibilityChange = (state: AppStateStatus) => {
        if (state === "active") {
          handleFocus();
        } else {
          handleFocusLost();
        }
      };

      let netinfoSubscription: NetInfoSubscription | null;
      let focusSubscription: NativeEventSubscription | null;

      if (!initialized) {
        // Handle connection events
        netinfoSubscription = NetInfo.addEventListener(state => {
          if (state.isConnected) {
            handleOnline();
          } else {
            handleOffline();
          }
        });

        focusSubscription = AppState.addEventListener(
          "change",
          handleVisibilityChange,
        );
        initialized = true;
      }

      const unsubscribe = () => {
        console.log("listener sob remove krtesi");
        netinfoSubscription?.();
        focusSubscription?.remove();
        initialized = false;
      };

      return unsubscribe;
    }

    return defaultHandler();
  },
);
