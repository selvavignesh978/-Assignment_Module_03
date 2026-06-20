import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Edit, Trash2 } from 'lucide-react';

export default function ProductCard({ product, addToCart, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: product.name, price: product.price });

  const handleUpdate = (e) => {
    e.preventDefault();
    onEdit(product.id, editForm);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between h-full">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3 p-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
            <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Price (₹)</label>
            <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-medium transition">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1.5 rounded font-medium transition">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          {/* Top Image Banner container click redirects to detail portal */}
          <Link to={`/product/${product.id}`} className="block relative w-full h-44 bg-gray-50 border-b border-gray-50 overflow-hidden group">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
              }}
            />
          </Link>

          <div className="p-5 flex flex-col flex-grow justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(product.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <Link to={`/product/${product.id}`} className="block hover:text-indigo-600 transition">
                <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1" title={product.name}>{product.name}</h3>
              </Link>
              <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-2">{product.specs || "No specifications listed"}</p>
              
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-700">{product.rating || "4.0"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-lg font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}