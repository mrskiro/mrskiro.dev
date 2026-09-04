export default function Layout({ children }: LayoutProps<"/feed">) {
  return (
    // oxlint-disable-next-line @mrskiro/oxlint-rules/no-tailwind-arbitrary-value -- レイアウト固有のグリッド定義。トークン化しても値の言い換えにしかならない
    <div className="grid h-dvh grid-rows-[auto_1fr] md:grid-cols-[200px_1fr] md:grid-rows-1">
      {children}
    </div>
  );
}
