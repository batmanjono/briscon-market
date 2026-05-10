'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = "admin2026";   // ← CHANGE THIS TO SOMETHING SECURE BEFORE THE EVENT!

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [sales, setSales] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const loginAdmin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      fetchSales();
    } else {
      alert("Incorrect Admin Password");
      setEnteredPassword('');
    }
  };

  const fetchSales = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('sales')
      .select(`
        *,
        items (title)
      `)
      .order('sold_at', { ascending: false });

    if (data) {
      setSales(data);
      const total = data.reduce((sum, sale) => sum + sale.total_amount, 0);
      setTotalRevenue(total);
    }
    setLoading(false);
  };

  const exportPayouts = () => {
    let csv = "Date,Item Title,Total Price,Market 10%,Your 3%,Seller Payout\n";

    sales.forEach((sale) => {
      csv += `${new Date(sale.sold_at).toLocaleString()},"${sale.items?.title || 'Unknown'}",$${(sale.total_amount/100).toFixed(2)},$${(sale.market_cut/100).toFixed(2)},$${(sale.platform_cut/100).toFixed(2)},$${(sale.seller_payout/100).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briscon-payouts-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl max-w-sm w-full text-center shadow-2xl">
          <h1 className="text-4xl font-bold mb-2 text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Briscon Market</p>
          
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full p-5 border-2 border-gray-300 rounded-2xl mb-6 text-center text-xl focus:outline-none focus:border-purple-600"
            onKeyDown={(e) => e.key === 'Enter' && loginAdmin()}
          />
          
          <button
            onClick={loginAdmin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl text-xl font-medium"
          >
            Access Admin Dashboard
          </button>
          
          <p className="text-xs text-gray-500 mt-6">Only the organiser can access this page</p>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard (after login)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Briscon Admin Dashboard</h1>
          <div className="space-x-4">
            <button onClick={fetchSales} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Refresh
            </button>
            <button onClick={exportPayouts} className="bg-black text-white px-8 py-3 rounded-xl">
              Export Payout CSV
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-5xl font-bold text-green-600 mt-3">
              ${(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <p className="text-gray-600">Number of Sales</p>
            <p className="text-5xl font-bold mt-3">{sales.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <p className="text-gray-600">Your 3% Platform Fee</p>
            <p className="text-5xl font-bold text-purple-600 mt-3">
              ${((totalRevenue * 0.03) / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sales List */}
        <div className="bg-white rounded-3xl shadow">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-semibold text-black">All Transactions</h2>
          </div>

          <div className="divide-y">
            {loading && <p className="p-12 text-center">Loading...</p>}
            
            {sales.map((sale) => (
              <div key={sale.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-lg block">{sale.items?.title}</strong>
                    <span className="text-sm text-gray-500">
                      {new Date(sale.sold_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-2xl">
                      ${(sale.total_amount / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">
                      Seller gets: ${(sale.seller_payout / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sales.length === 0 && !loading && (
              <p className="p-12 text-center text-gray-500">No sales recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}