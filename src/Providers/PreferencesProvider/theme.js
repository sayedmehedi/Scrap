import merge from "deepmerge";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {DefaultTheme, configureFonts} from "react-native-paper";

const fontConfig = {
  web: {
    black: {
      fontFamily: "Inter-Black",
      fontWeight: "900",
    },
    extrabold: {
      fontFamily: "Inter-ExtraBold",
      fontWeight: "800",
    },
    bold: {
      fontFamily: "Inter-Bold",
      fontWeight: "700",
    },
    semibold: {
      fontFamily: "Inter-SemiBold",
      fontWeight: "600",
    },
    medium: {
      fontFamily: "Inter-Medium",
      fontWeight: "500",
    },
    regular: {
      fontFamily: "Inter-Regular",
      fontWeight: "400",
    },
    light: {
      fontFamily: "Inter-Light",
      fontWeight: "300",
    },
    extralight: {
      fontFamily: "Inter-ExtraLight",
      fontWeight: "200",
    },
    thin: {
      fontFamily: "Inter-Thin",
      fontWeight: "100",
    },
  },
  ios: {
    black: {
      fontFamily: "Inter-Black",
      fontWeight: "900",
    },
    extrabold: {
      fontFamily: "Inter-ExtraBold",
      fontWeight: "800",
    },
    bold: {
      fontFamily: "Inter-Bold",
      fontWeight: "700",
    },
    semibold: {
      fontFamily: "Inter-SemiBold",
      fontWeight: "600",
    },
    medium: {
      fontFamily: "Inter-Medium",
      fontWeight: "500",
    },
    regular: {
      fontFamily: "Inter-Regular",
      fontWeight: "400",
    },
    light: {
      fontFamily: "Inter-Light",
      fontWeight: "300",
    },
    extralight: {
      fontFamily: "Inter-ExtraLight",
      fontWeight: "200",
    },
    thin: {
      fontFamily: "Inter-Thin",
      fontWeight: "100",
    },
  },
  android: {
    black: {
      fontFamily: "Inter-Black",
      fontWeight: "900",
    },
    extrabold: {
      fontFamily: "Inter-ExtraBold",
      fontWeight: "800",
    },
    bold: {
      fontFamily: "Inter-Bold",
      fontWeight: "700",
    },
    semibold: {
      fontFamily: "Inter-SemiBold",
      fontWeight: "600",
    },
    medium: {
      fontFamily: "Inter-Medium",
      fontWeight: "500",
    },
    regular: {
      fontFamily: "Inter-Regular",
      fontWeight: "400",
    },
    light: {
      fontFamily: "Inter-Light",
      fontWeight: "300",
    },
    extralight: {
      fontFamily: "Inter-ExtraLight",
      fontWeight: "200",
    },
    thin: {
      fontFamily: "Inter-Thin",
      fontWeight: "100",
    },
  },
};

const paperLightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#E62B56",
    primary05: "rgba(230, 43, 86, 0.25)",
    accent: "#191F2B",
    accent05: "rgba(25, 31, 43, 0.25)",
    background: "#F7F7F7",
    white: "#FFFFFF",
    success: "#51B764",

    text: "#111111",
    tertiary: "#98A2B3",
  },
  fonts: configureFonts(fontConfig),
};

const paperDarkTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#E62B56",
    primary05: "rgba(230, 43, 86, 0.25)",
    accent: "#191F2B",
    accent05: "rgba(25, 31, 43, 0.25)",
    background: "#F7F7F7",
    white: "#FFFFFF",
    success: "#51B764",

    text: "#111111",
    tertiary: "#98A2B3",
  },
  fonts: configureFonts(fontConfig),
};

export const combinedDefaultTheme = merge(
  NavigationDefaultTheme,
  paperLightTheme,
);
export const combinedDarkTheme = merge(NavigationDarkTheme, paperDarkTheme);
