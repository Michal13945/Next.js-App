import Footer from "./footer";
import "./globals.css";
import NavBar from "./header";
import { AuthProvider } from "./lib/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="geist-sans geist-mono antialiased flex h-screen bg-slate-700">
        <AuthProvider>
          <aside className="w-64 bg-gray-800 text-white mr-1">
            <NavBar />
          </aside>
          <div className="flex flex-col flex-1">
            <main className="flex-1 p-6 bg-slate-800	overflow-y-auto">
              {children}
            </main>
            <Footer className="text-white py-4 text-center" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
