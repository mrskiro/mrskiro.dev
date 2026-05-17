export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] md:grid-cols-[200px_1fr] md:grid-rows-1">
      {children}
    </div>
  );
}
