"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/de";

dayjs.locale("de");

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
