import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl gap-4 px-4 py-12">
      <h1 className="font-semibold">404</h1>
      <p>Page not found</p>
      <Link href="/">← Home</Link>
    </div>
  );
}
