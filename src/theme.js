export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    5: "#F0F0F0",
    10: "#F6F6F6",
    20: "#F9F9F9",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
    1100: "#000814",
    1200: "#0d1b2a",
  },
  primary: {
    50: "#E0F5FF",
    100: "#B3E6FF",
    200: "#80D8FF",
    300: "#4DC3FF",
    400: "#26B3FF",
    500: "#00A3FF",
    600: "#0090E6",
    700: "#0077B3",
    800: "#005A80",
    900: "#004066",
  }
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              light: colorTokens.primary[800],
              hovered:colorTokens.primary[500],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[1100],
              alt: colorTokens.grey[1200],
             
            },
          }
        : {
            // palette values for light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
              hovered: colorTokens.primary[800],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
              testing: colorTokens.primary[5],
            },
          }),
    },
    typography: {
      fontFamily: ["Quicksand", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 14,
      },
      h7: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 12,
      },
      h8: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 10,
      },
    },
  };
};
