import {Linking} from "react-native";
import {useEffect, useCallback, useState} from "react";

export const useURL = () => {
  const [link, setLink] = useState<string>();
  const handleUrlChange = useCallback(({url}: {url: string}) => {
    setLink(url);
  }, []);

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();

      if (!initialUrl) {
        return;
      }

      handleUrlChange({url: initialUrl});
    })();

    const subscription = Linking.addEventListener("url", handleUrlChange);

    return () => subscription.remove();
  }, []);

  return link;
};
