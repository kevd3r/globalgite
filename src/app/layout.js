// app/layout.js
import { Providers } from "./providers";


import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body >
        <Providers>
          {children}
        </Providers>
      </body>
        
      
    </html>
  );
}
