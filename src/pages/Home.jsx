import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import SearchBar from '../components/SearchBar';
import AISearch from '../components/AISearch';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { PlusCircle, Sparkles } from 'lucide-react';

export default function Home({ addToCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Electronics', specs: '', rating: 4.0 });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      loadProducts();
    }
  }, [navigate]);

  const loadProducts = async () => {
    const data = await productService.getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const handleAISearch = async (query) => {
    const aiResults = await productService.parseAISearch(query);
    setFilteredProducts(aiResults);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await productService.addProduct(newProduct);
    setNewProduct({ name: '', price: '', category: 'Electronics', specs: '', rating: 4.0 });
    setShowAddForm(false);
    loadProducts();
  };

  const handleEditProduct = async (id, updatedData) => {
    await productService.updateProduct(id, updatedData);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    await productService.deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="w-full max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header Container stretches edge-to-edge */}
      <div className="w-full flex flex-col items-center gap-6 mb-10">
        <div className="w-full">
          <AISearch onAISearch={handleAISearch} />
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6 border-gray-100">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 m-0">
          Discover Catalog <span className="text-sm font-normal text-gray-500">({filteredProducts.length} items found)</span>
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Product Title</label>
            <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="e.g. Sony Headphones" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Price (INR)</label>
            <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="₹" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border rounded-lg text-sm bg-white">
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">Save Entry</button>
        </form>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed rounded-2xl w-full">
          <p className="text-gray-500 text-lg">No matches found for your criteria.</p>
          <button onClick={loadProducts} className="mt-2 text-sm text-indigo-600 font-bold hover:underline">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Personalized Recommendations Panel stretches cleanly */}
      <div className="mt-16 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl w-full">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-amber-400" /> Recommended for You
        </h3>
        <p className="text-slate-400 text-sm mb-6">Based on your recent dynamic browsing behaviors and purchase logs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map(p => (
            <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition gap-4 text-left">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm text-white truncate">{p.name}</h4>
                <p className="text-xs text-indigo-300 mt-0.5 mb-0">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => addToCart(p)} className="text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition shrink-0">Add Quick</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}