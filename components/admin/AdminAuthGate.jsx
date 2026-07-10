"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) setError("Identifiants incorrects. Merci de réessayer.");
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-ink-400 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border border-ink-100 bg-white px-8 py-10"
        >
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Zanieri"
              width={140}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-center text-[11px] uppercase tracking-widest2 text-ink-400 mb-8">
            Espace administration
          </p>

          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
            />
            <input
              type="password"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
            />
            {error && <p className="text-[13px] text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return children;
}
