import axios from 'axios';

const BASE_URL = 'https://api-mockforge.onrender.com/api/databases/6a2bde3c54c439099ee6b611/resources/products';

export const productService = {
  // 1. READ ALL (Get live catalog data from the server)
  getProducts: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching products from live API:', error.message);
      return [];
    }
  },
  
  // 2. CREATE (Post a new entry to the database)
  addProduct: async (product) => {
    try {
      // Force structured data types before transmitting payload
      const formattedProduct = {
        ...product,
        price: Number(product.price),
        rating: product.rating ? Number(product.rating) : 4.0,
        // Swap relative dots to clean root absolute URLs if creating client-side
        image: product.image ? product.image.replace(/^\./, '') : '/image/Asus Vivobook 14.jpg'
      };
      
      const response = await axios.post(BASE_URL, formattedProduct);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating new product entry:', error.message);
      throw error;
    }
  },

  // 3. UPDATE (Put customized changes directly into the matching record ID)
  updateProduct: async (id, updatedData) => {
    try {
      if (updatedData.price) updatedData.price = Number(updatedData.price);
      if (updatedData.image) updatedData.image = updatedData.image.replace(/^\./, '');

      const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating record ID ${id}:`, error.message);
      throw error;
    }
  },

  // 4. DELETE (Drop the target record row off the live table resource)
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      console.error(`❌ Error deleting record ID ${id}:`, error.message);
      throw error;
    }
  },

  // 5. AI NLP Smart Search Parser (Now runs filters on top of the live endpoint data stream)
  parseAISearch: async (query) => {
    try {
      const lowerQuery = query.toLowerCase();
      // Fetch fresh database snapshot state stream first
      const allProducts = await productService.getProducts();
      let filtered = [...allProducts];

      // Extract price constraints (e.g., "under 40000" or "under ₹40,000")
      const priceMatch = lowerQuery.match(/under\s*(?:₹)?\s*([\d,]+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
        filtered = filtered.filter(p => p.price <= maxPrice);
      }

      // Extract intent-based keywords
      if (lowerQuery.includes("laptop") || lowerQuery.includes("asus") || lowerQuery.includes("hp") || lowerQuery.includes("dell")) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes("laptop") || p.category === "Electronics");
      }
      if (lowerQuery.includes("battery") || lowerQuery.includes("power")) {
        filtered = filtered.filter(p => p.battery === "Excellent" || p.battery === "Great");
      }
      if (lowerQuery.includes("best") || lowerQuery.includes("top")) {
        filtered = filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    } catch (error) {
      console.error('❌ Error executing AI Smart Search logic:', error.message);
      return [];
    }
  }
};