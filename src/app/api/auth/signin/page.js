// app/auth/signin/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Connexion Admin</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Connexion Admin</h2>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}