"use client";
import * as muiLocales from "@mui/material/locale";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
} from "@mui/material/styles";
import { useLocale } from "next-intl";
import { createContext, ReactNode, useMemo, useState } from "react";

declare module "@mui/material/styles" {
  interface TypeText {
    tertiary: string;
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
    fontWeightExtraBold?: number;
    fontFamilyCode?: string;
    fontFamilySystem?: string;
  }

  interface TypographyVariants {
    fontWeightSemiBold: number;
    fontWeightExtraBold: number;
    fontFamilyCode: string;
    fontFamilySystem: string;
  }
}

const localeMap: Record<string, keyof typeof muiLocales> = {
  en: "enUS",
  id: "idID",
  // add other locales as needed
};

const customTheme: Record<
  string,
  Record<"light" | "dark", ThemeOptions["palette"]>
> = {
  default: {
    light: {
      primary: {
        main: "#2563EB",
        dark: "#1D4ED8",
        contrastText: "#FFFFFF",
      },
      // secondary: {
      //     main: '#0EA5A4',
      // },
      warning: {
        main: "#F59E0B",
      },
      error: {
        main: "#DC2626",
      },
      success: {
        main: "#16A34A",
      },
      info: {
        main: "#0284C7",
      },
      background: {
        default: "#F8FAFC",
        paper: "#FFFFFF",
        // default: '#FFFFFF',
        // paper: '#F8FAFC',
      },
      text: {
        primary: "#0F172A",
        secondary: "#475569",
        disabled: "#94A3B8",
      },
      divider: "#E2E8F0",
      // background: {
      //     default: '#FFFFFF',
      //     paper: '#F7F9FC',
      // },
      //
      // primary: {
      //     main: '#0080D7',
      //     light: '#4DA3E5',
      //     dark: '#005FA3',
      //     contrastText: '#FFFFFF',
      // },
      //
      secondary: {
        main: "#F38A1C",
        light: "#F6A24D",
        dark: "#C56A0E",
        contrastText: "#FFFFFF",
      },
      //
      // error: {
      //     main: '#F44E38',
      //     light: '#F77967',
      //     dark: '#C73B28',
      //     contrastText: '#FFFFFF',
      // },
      //
      // text: {
      //     primary: '#1A1A1A',
      //     secondary: '#4A4A4A',
      //     disabled: '#9AA0A6',
      //     tertiary: grey[700],
      // },
      //
      // divider: '#E0E4E8',
      //
      // action: {
      //     hover: 'rgba(0, 128, 215, 0.08)',
      //     selected: 'rgba(0, 128, 215, 0.16)',
      //     disabled: 'rgba(0, 0, 0, 0.26)',
      //     disabledBackground: 'rgba(0, 0, 0, 0.12)',
      //     focus: 'rgba(0, 128, 215, 0.24)',
      // },
    },
    dark: {
      primary: {
        main: "#60A5FA",
        dark: "#3B82F6",
        contrastText: "#020617",
      },
      // secondary: {
      //     main: '#2DD4BF',
      // },
      warning: {
        main: "#FBBF24",
      },
      error: {
        main: "#EF4444",
      },
      success: {
        main: "#22C55E",
      },
      info: {
        main: "#38BDF8",
      },
      background: {
        default: "#020617",
        paper: "#0F172A",
      },
      text: {
        primary: "#E5E7EB",
        secondary: "#94A3B8",
        disabled: "#64748B",
      },
      divider: "#1E293B",
      // background: {
      //     default: '#0F141A',
      //     paper: '#161C24',
      // },
      //
      // primary: {
      //     main: '#4FB3FF',
      //     light: '#79C7FF',
      //     dark: '#2A9AF0',
      //     contrastText: '#0F141A',
      // },
      //
      secondary: {
        main: "#FFB357",
        light: "#FFC77D",
        dark: "#E69532",
        contrastText: "#0F141A",
      },
      //
      // error: {
      //     main: '#FF7A6A',
      //     light: '#FF9A8D',
      //     dark: '#E85A4A',
      //     contrastText: '#0F141A',
      // },
      //
      // text: {
      //     primary: '#E6EDF3',
      //     secondary: '#A9B4C2',
      //     disabled: '#6B7480',
      //     tertiary: grey[500],
      // },
      //
      // divider: '#242B36',
      //
      // action: {
      //     hover: 'rgba(79, 179, 255, 0.08)',
      //     selected: 'rgba(79, 179, 255, 0.16)',
      //     disabled: 'rgba(230, 237, 243, 0.3)',
      //     disabledBackground: 'rgba(230, 237, 243, 0.12)',
      //     focus: 'rgba(79, 179, 255, 0.24)',
      // },
    },
  },
  rosequartz: {
    light: {
      primary: { main: "#ec407a" },
      secondary: { main: "#f48fb1" },
      background: {
        default: "#fff5f8",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#f48fb1" },
      secondary: { main: "#f06292" },
      background: {
        default: "#1a0b12",
        paper: "#24101a",
      },
    },
  },
  forestserenity: {
    light: {
      primary: { main: "#2e7d32" },
      secondary: { main: "#8bc34a" },
      background: {
        default: "#f6fbf6",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#81c784" },
      secondary: { main: "#aed581" },
      background: {
        default: "#0b1a12",
        paper: "#13261b",
      },
    },
  },
  nordicfrost: {
    light: {
      primary: { main: "#546e7a" },
      secondary: { main: "#90a4ae" },
      background: {
        default: "#f5f7f8",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#b0bec5" },
      secondary: { main: "#78909c" },
      background: {
        default: "#0f1720",
        paper: "#16202b",
      },
    },
  },
  solarflare: {
    light: {
      primary: { main: "#f57c00" },
      secondary: { main: "#ffca28" },
      background: {
        default: "#fff8f1",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#ffb74d" },
      secondary: { main: "#ffe082" },
      background: {
        default: "#1f1405",
        paper: "#2a1d0b",
      },
    },
  },
  midnightviolet: {
    light: {
      primary: { main: "#6a1b9a" },
      secondary: { main: "#ab47bc" },
      background: {
        default: "#faf7fd",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#ce93d8" },
      secondary: { main: "#ba68c8" },
      background: {
        default: "#12091f",
        paper: "#1d1333",
      },
    },
  },
  oceaniccalm: {
    light: {
      primary: { main: "#1976d2" },
      secondary: { main: "#26a69a" },
      background: {
        default: "#f4f9fc",
        paper: "#ffffff",
      },
    },
    dark: {
      primary: { main: "#64b5f6" },
      secondary: { main: "#4db6ac" },
      background: {
        default: "#0d1b2a",
        paper: "#132238",
      },
    },
  },
};

export const ThemeContext = createContext<{
  setTheme: (theme: string) => void;
  theme: string;
}>({ setTheme: () => undefined, theme: "default" });

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as "id" | "en";

  const [savedTheme, setSavedTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem("theme") || "default";
  });

  const selectedTheme = savedTheme
    ? customTheme[savedTheme]
    : customTheme.default;

  const setTheme = (theme: string) => {
    setSavedTheme(theme);
    window.localStorage.setItem("theme", theme);
  };

  const theme = useMemo(() => {
    return createTheme(
      {
        colorSchemes: {
          dark: {
            palette: {
              ...(selectedTheme ? selectedTheme.dark : {}),
            },
          },
          light: {
            palette: {
              ...(selectedTheme ? selectedTheme.light : {}),
            },
          },
        },
        typography: {
          fontFamily: "var(--font-inter)",
          fontWeightSemiBold: 600,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                minHeight: 72,
              },
              dense: {
                minHeight: 32,
                height: 32,
              },
            },
          },
        },
      },
      muiLocales[localeMap[locale] as keyof typeof muiLocales],
    );
  }, [selectedTheme, locale]);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext value={{ setTheme, theme: savedTheme }}>
        {children}
      </ThemeContext>
    </MuiThemeProvider>
  );
}
