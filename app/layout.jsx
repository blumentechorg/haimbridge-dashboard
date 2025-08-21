import "../styles/globals.css";

export const metadata = { title: "Hotel Owner Dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
