import "./globals.css";
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: "Comunali - Scrutinio Voti",
  description: "Sistema di scrutinio voti per elezioni comunali italiane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="h-full">
      <body className="min-h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
