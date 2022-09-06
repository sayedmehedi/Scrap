import {InteractionManager} from "react-native";
import {useEffect, useContext, useState} from "react";
import {DeepLinkContext} from "@providers/DeepLinkProvider";
import {DeepLinkEnum, navigationRef} from "@utils/navigation";

export const useDeepLinks = (deepLinks?: DeepLinkEnum[]) => {
  const [hookRoute, setHookRoute] = useState<string>();
  const [currentRoute, setCurrentRoute] = useState<string>();
  const {deepLinksState, addDeepLink, removeDeepLink} =
    useContext(DeepLinkContext);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const route = navigationRef.getCurrentRoute();
      if (!hookRoute) {
        setHookRoute(route?.name);
      }
    });

    const handleNavigationStateChange = () => {
      setCurrentRoute(navigationRef.getCurrentRoute()?.name);
    };

    navigationRef.addListener("state", handleNavigationStateChange);

    return () => {
      task.cancel();
      navigationRef.removeListener("state", handleNavigationStateChange);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!deepLinks || hookRoute !== currentRoute) {
        return;
      }

      const found = deepLinksState.filter(link =>
        deepLinks.includes(link.type),
      );

      if (!found.length) {
        return;
      }

      const currentLink = found[0];
      await currentLink.action();
      removeDeepLink(currentLink.id);
    })();
  }, [deepLinksState, hookRoute, currentRoute]);

  return {addDeepLink};
};
