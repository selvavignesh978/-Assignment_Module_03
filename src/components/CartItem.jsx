import React from 'react';
import { Trash2 } from 'lucide-react';

export default function CartItem({ item, removeFromCart }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-100 rounded-xl shadow-sm gap-4">
      {/* Left Segment: Image Thumbnail and Info Elements */}
      <div className="flex items-center gap-4">
        {/* Product Image Box Container */}
        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful local fallback icon if path asset string mismatches
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&q=80";
            }}
          />
        </div>
        
        {/* Text Meta Container */}
        <div>
          <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
          <p className="text-sm text-indigo-600 font-semibold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Right Segment: Action Trigger Delete */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}