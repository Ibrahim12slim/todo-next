"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="p-4 flex justify-between border-b border-gray-300">
      <h1 className="font-bold">TodoApp</h1>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        {isLoggedIn ? (
          <>
            <Link href="/todos">Todos</Link>
            <button
              onClick={handleLogout}
              className="underline hover:text-gray-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
