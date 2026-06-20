import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function Cart({ cart, removeFromCart, clearCart }) {
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue Browsing Catalog
      </Link>
      
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart Session</h2>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border rounded-xl">
          <p className="text-gray-500">Your cart selection is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <CartItem key={index} item={item} removeFromCart={removeFromCart} />
            ))}
          </div>
          
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 border-b pb-3 mb-3">
              <span>Items Count</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-gray-900 mb-6">
              <span>Total Payable</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={() => { alert('Order simulation complete!'); clearCart(); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> Proceed Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}