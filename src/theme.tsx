import { extendTheme } from "@chakra-ui/react";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = {
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
};

const initialColorMode = "light";
const useSystemColorMode = false;

const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: "#16161D",
      },
      heroGradientStart: {
        default: "#7928CA",
      },
      heroGradientEnd: {
        default: "#FF0080",
      },
    },
    radii: {
      button: "12px",
    },
  },
  colors: {
    white: "#FAF9F6",
    black: "#16161D",
  },
  fonts,
  breakpoints,
  initialColorMode,
  useSystemColorMode,
  styles: {
    global: () => ({
      body: {
        bg: "white",
      },
    }),
  },
});

export default theme;
