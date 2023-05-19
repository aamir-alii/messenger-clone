import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/authContext";
import ActiveStatus from "./components/ActiveStatus";

export const metadata = {
  title: "Messenger Clone",
  description: "Messenger Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
