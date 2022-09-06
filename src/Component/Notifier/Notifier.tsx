import React from "react";
import Toast from "react-native-toast-message";
import { notistackSlice } from "@store/slices/notistackSlice";
import { useAppDispatch, useAppSelector } from "hooks/store";

let displayed: string[] = [];

const Notifier = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    store => store.notistack.notifications || [],
  );

  const storeDisplayed = (id: string) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: string) => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(({ key, options = {}, dismissed }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        Toast.hide();
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) return;

      Toast.show({
        ...options,
        onHide() {
          // remove this snackbar from redux store
          dispatch(notistackSlice.actions.removeSnackbar(key));
          removeDisplayed(key);
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, dispatch]);

  return null;
};

export default Notifier;
