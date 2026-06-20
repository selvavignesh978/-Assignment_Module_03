import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [cart, setCart] = useState([]);

  // Load persistent localstorage state data hooks
  useEffect(() => {
    const savedCart = localStorage.getItem('shopsmart_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('shopsmart_cart', JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      setCart(updated);
      localStorage.setItem('shopsmart_cart', JSON.stringify(updated));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopsmart_cart');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col w-full">
        <Navbar cartCount={cart.length} />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/contact" element={<Contact />} /> {/* FIXED: Added the actual route component here */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;