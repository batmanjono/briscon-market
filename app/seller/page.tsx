'use client';
import { useState } from 'react';
import QRCode from 'qrcode';

export default function SellerPortal() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [productId, setProductId] = useState('');
  const [recentItems, setRecentItems] = useState<any[]>([]);

  const createItem = async () => {
    if (!title || !price) return alert("Please fill in both fields");

    const priceInCents = Math.round(parseFloat(price) * 100);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newProductId = `B-${randomNum}`;

    const newItem = {
      id: 'local-' + Date.now(),
      title: title.trim(),
      price: priceInCents,
      productId: newProductId
    };

    // Save to localStorage
    const savedItems = JSON.parse(localStorage.getItem('briscon_items') || '[]');
    localStorage.setItem('briscon_items', JSON.stringify([...savedItems, newItem]));

    // Generate QR
    const qrUrl = `${window.location.origin}/pos?item=${newItem.id}`;
    const qr = await QRCode.toDataURL(qrUrl, { width: 500, margin: 1 });

    setQrCode(qr);
    setItemName(title);
    setProductId(newProductId);

    // Update recent items
    setRecentItems([newItem, ...recentItems].slice(0, 6));

    setTitle('');
    setPrice('');

    alert(`✅ Item Created!\nProduct ID: ${newProductId}`);
  };

  const regenerateQR = async (item: any) => {
    const qrUrl = `${window.location.origin}/pos?item=${item.id}`;
    const qr = await QRCode.toDataURL(qrUrl, { width: 500, margin: 1 });

    setQrCode(qr);
    setItemName(item.title);
    setProductId(item.productId);
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>${itemName}</title></head><body style="text-align:center; padding:40px; font-family:Arial;">
        <h2>${itemName}</h2>
        <p style="font-size:28px; font-weight:bold; margin:20px 0;">${productId}</p>
        <img src="${qrCode}" style="width:420px; height:420px;" />
        <p style="margin-top:40px; color:#555;">Briscon Market • ${new Date().toLocaleDateString()}</p>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Briscon Seller Portal</h1>
        <p className="text-gray-600 mb-8">Create as many items as you want</p>

        <div className="bg-amber-100 border border-amber-400 p-5 rounded-2xl mb-8">
          <strong>Important:</strong> The price you set is what the buyer pays.<br />
          Market 10% + Platform 3% = <strong>You keep 87%</strong>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          
          <input
            type="text"
            placeholder="Item name (e.g. Imperial Guard Army)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl mb-4 text-lg text-gray-900"
          />
          
          <input
            type="number"
            placeholder="Price in AUD"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 text-lg text-gray-900"
          />

          <button
            onClick={createItem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-medium"
          >
            Create Item & Generate QR Code
          </button>
        </div>

        {/* Current QR Code */}
        {qrCode && (
          <div className="bg-white p-8 rounded-2xl shadow text-center mb-8">
            <h3 className="font-bold text-xl mb-2">{itemName}</h3>
            <p className="text-2xl font-mono text-blue-600 mb-6">Product ID: <strong>{productId}</strong></p>
            
            <img src={qrCode} alt="QR Code" className="mx-auto mb-8 border-2 border-gray-300 p-4" />

            <button
              onClick={printQR}
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 rounded-2xl text-lg font-medium"
            >
              Print QR Code + Product ID
            </button>
          </div>
        )}

        {/* Recently Created Items */}
        {recentItems.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4 text-gray-900">Recently Created Items</h3>
            <div className="space-y-2">
              {recentItems.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => regenerateQR(item)}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl cursor-pointer transition-colors"
                >
                  <span className="text-gray-900 font-medium">{item.title}</span>
                  <span className="font-mono text-blue-600 font-semibold">{item.productId}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Tap an item to regenerate its QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}