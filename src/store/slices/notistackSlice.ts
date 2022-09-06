import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";
import {ToastShowParams} from "react-native-toast-message";

interface INotification {
  key: string;
  dismissed: boolean;
  options?: ToastShowParams;
}

const initialState: {
  notifications: INotification[];
} = {
  notifications: [],
};

export const notistackSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    enquerSnackbar: {
      reducer(state, {payload}: PayloadAction<INotification>) {
        state.notifications.push(payload as any);
      },
      prepare(notification: Omit<INotification, "key" | "dismissed">) {
        const payload = {
          ...notification,
          dismissed: false,
          key: nanoid(),
        };
        return {payload};
      },
    },
    closeSnackbar: {
      reducer: (
        state,
        action: PayloadAction<{dismissAll: boolean; key: string}>,
      ) => {
        const {payload} = action;
        state.notifications = state.notifications.map(notification => {
          const shouldDismiss =
            payload.dismissAll || notification.key === payload.key;
          return shouldDismiss
            ? {...notification, dismissed: true}
            : {...notification};
        });
      },
      prepare: (key: string = "") => ({
        payload: {key, dismissAll: !key},
      }),
    },
    removeSnackbar(state, {payload}) {
      state.notifications = state.notifications.filter(
        notification => notification.key !== payload,
      );
    },
  },
  extraReducers: builder => {},
});
