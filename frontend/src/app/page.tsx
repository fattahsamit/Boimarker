"use client";

import { useAuth } from "../app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  return (
    <main>
      <h1>Welcome {user}</h1>
      <button onClick={logout}>Logout</button>
      {/* Rest of your app */}
    </main>
  );
}
