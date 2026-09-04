export default function Layout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto max-w-xl px-4 py-12">{children}</div>;
}
