import React from "react";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata = {
  title: "Calmly — Calendar Grid",
  description: "A calm, organized calendar with task management, drag & drop, worldwide holidays, and import/export.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
