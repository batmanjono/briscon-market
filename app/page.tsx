'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-5xl font-bold mb-3">Briscon</h1>
        <p className="text-xl text-gray-400 mb-12">Buy and Sell</p>

        <div className="space-y-4">
          <Link 
            href="/auth" 
            className="block w-full bg-white text-black py-5 rounded-2xl text-xl font-medium hover:bg-gray-100"
          >
            Seller Login / Sign Up
          </Link>

          <Link 
            href="/pos" 
            className="block w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-2xl text-xl font-medium"
          >
            Cashier POS Terminal
          </Link>

          <Link 
            href="/admin" 
            className="block w-full bg-purple-600 hover:bg-purple-700 py-5 rounded-2xl text-xl font-medium"
          >
            Admin Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-10">
          Only cashiers should use the POS page
        </p>
      </div>
    </div>
  );
}