import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProtegidaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // si no hay sesión, lo mando a la home
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Zona protegida</h1>
      <p>Hola {session.user?.name}, solo los usuarios logueados pueden ver esto.</p>
    </main>
  );
}
