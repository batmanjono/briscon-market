'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Login failed: " + error.message);
        else window.location.href = '/seller';
      } else {
        // Signup without redirect
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert("Signup failed: " + error.message);
        } else if (data.user) {
          // Save profile
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName,
            phone: phone || null,
            bsb: bsb || null,
            account_number: accountNumber || null,
            display_name: fullName.split(' ')[0] || fullName
          });

          alert("✅ Account created successfully!\n\nPlease login now.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isLogin ? "Seller Login" : "Create Seller Account"}
        </h1>
        <p className="text-center text-gray-400 mb-8">Briscon Market</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />
              <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="BSB *" value={bsb} onChange={(e) => setBsb(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />
                <input type="text" placeholder="Account Number *" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />
              </div>
            </>
          )}

          <input type="email" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />
          <input type="password" placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-zinc-700 rounded-xl" required />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-lg font-medium">
            {loading ? "Processing..." : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 underline text-lg py-3 px-8 rounded-xl hover:bg-zinc-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}