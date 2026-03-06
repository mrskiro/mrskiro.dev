export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto max-w-xl px-4 py-12">{children}</div>;
}
