"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/">🏠 Home</Link>
        {session && <Link href="/nuevo-post">➕ Nuevo Post</Link>}
      </div>
      <AuthButtons />
    </nav>
  );
}
