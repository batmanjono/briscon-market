'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const CASHIER_PASSWORD = "briscon2026";

export default function POS() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [message, setMessage] = useState('');

  const getAllItems = () => {
    try {
      return JSON.parse(localStorage.getItem('briscon_items') || '[]');
    } catch {
      return [];
    }
  };

  const addItemToCart = (itemId: string) => {
    const items = getAllItems();
    const foundItem = items.find((item: any) => 
      item.id === itemId || item.productId === itemId
    );

    if (foundItem) {
      setCart([...cart, foundItem]);
      setTotal(prev => prev + foundItem.price);
      setManualInput('');
      setMessage(`Added: ${foundItem.title}`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(`❌ Item not found: ${itemId}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Auto add from QR code link
  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) addItemToCart(itemId);
  }, [searchParams]);

  const handleManualSubmit = (e: any) => {
    e.preventDefault();
    if (manualInput.trim()) {
      addItemToCart(manualInput.trim());
    }
  };

  const loginCashier = () => {
    if (enteredPassword === CASHIER_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password");
      setEnteredPassword('');
    }
  };

  const completeSale = () => {
    if (cart.length === 0) return;

    const totalDollars = (total / 100).toFixed(2);
    alert(`✅ SALE COMPLETE!\n\nTotal: $${totalDollars}\n\nPlease charge $${totalDollars} on Square now.`);

    setCart([]);
    setTotal(0);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-10 rounded-3xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Cashier Login</h1>
          <input
            type="password"
            placeholder="Enter Cashier Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full p-5 rounded-2xl bg-zinc-800 text-center text-xl mb-6"
            onKeyDown={(e) => e.key === 'Enter' && loginCashier()}
          />
          <button onClick={loginCashier} className="w-full bg-emerald-600 py-5 rounded-2xl text-xl font-medium">
            Login to POS
          </button>
        </div>
      </div>
    );
  }

  // Main POS
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 pb-32">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Briscon POS</h1>
        <p className="text-emerald-400 mb-8">Cashier Terminal</p>

        <div className="bg-zinc-900 p-6 rounded-3xl mb-8">
          <p className="text-zinc-400 mb-3">Scan QR or Type Product ID</p>
          <form onSubmit={handleManualSubmit}>
            <input
              type="text"
              placeholder="e.g. B-247"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full bg-zinc-800 p-5 rounded-2xl text-lg text-center"
              autoFocus
            />
          </form>
          {message && <p className="text-center mt-3 text-lg">{message}</p>}
        </div>

        <div className="space-y-4 mb-8">
          {cart.length === 0 && <p className="text-zinc-500 text-center py-12">No items added yet</p>}
          {cart.map((item, i) => (
            <div key={i} className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center">
              <div className="text-lg">{item.title}</div>
              <div className="font-medium text-lg">${(item.price / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-6">
            <div className="text-center mb-6">
              <p className="text-zinc-400 text-sm">TOTAL TO CHARGE</p>
              <p className="text-5xl font-bold">${(total / 100).toFixed(2)}</p>
            </div>
            
            <button
              onClick={completeSale}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-7 rounded-3xl text-2xl font-semibold"
            >
              COMPLETE SALE → PAY WITH SQUARE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}