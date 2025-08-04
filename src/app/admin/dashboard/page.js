// pages/admin/dashboard.js
'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Head from "next/head";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Tableau de bord Admin</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">
              Bienvenue, {session.user.email}
            </h1>
            <p className="mb-4">
              Ceci est le tableau de bord de l&apos;administrateur.
            </p>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}