"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"   

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async () => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_name: businessName }, // read by the trigger above
      },
    });

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-slate-800">Create your account</h1>
      <input
        placeholder="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSignup}
        className="bg-[#1E3A5F] text-white rounded-lg py-2 text-sm font-medium"
      >
        Sign up
      </button>
    </div>
  );
}