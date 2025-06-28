import "./globals.css";

export const metadata = {
  title: "LearnSphere - Explore the Universe of Knowledge",
  description: "AI-powered learning platform that transforms your notes into an interactive cosmic experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
