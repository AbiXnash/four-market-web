import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-6xl font-bold text-slate-700">404</h1>
        <p className="mb-8 text-sm text-slate-400">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
