import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}