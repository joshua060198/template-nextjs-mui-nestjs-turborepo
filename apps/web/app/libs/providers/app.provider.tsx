import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import DateProvider from "@web/libs/providers/date.provider";
import { DialogProvider } from "@web/libs/providers/global-dialog/dialog.provider";
import AppQueryClientProvider from "@web/libs/providers/query-client.provider";
import SnackProvider from "@web/libs/providers/snack.provider";
import ThemeProvider from "@web/libs/providers/theme.provider";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

export default function AppProvider({
  children,
  messages,
}: Readonly<{
  children: ReactNode;
  messages: Record<string, unknown>;
}>) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <DateProvider>
            <CssBaseline enableColorScheme />
            <AppQueryClientProvider>
              <SnackProvider>
                <DialogProvider>{children}</DialogProvider>
              </SnackProvider>
            </AppQueryClientProvider>
          </DateProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </AppRouterCacheProvider>
  );
}
