import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

const baseStyle = definePartsStyle({
  track: {
    _checked: {
      bg: "#7b69ec",
    },
  },
});

const switchTheme = defineMultiStyleConfig({ baseStyle });

const theme = extendTheme({
  components: {
    Switch: switchTheme,
  },
});

export default theme;
