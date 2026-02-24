import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-4">
      <h1 className="font-semibold">404</h1>
      <p>Page not found</p>
      <Link href="/">← Home</Link>
    </div>
  );
}
