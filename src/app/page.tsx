import Link from "next/link";

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl w-[400px] p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Welcome
        </h1>
        <p className="text-gray-600 text-center">
          Please login or register to continue
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl shadow-md text-center transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl text-center transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
