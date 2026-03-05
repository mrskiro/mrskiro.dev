export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="grid h-dvh grid-cols-[200px_1fr]">{children}</div>;
}
