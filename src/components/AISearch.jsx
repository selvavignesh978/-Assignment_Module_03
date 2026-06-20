import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import "./AISearch.css";

export default function AISearch({ onFilterResults }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! Welcome to ShopSmart. I'm your personal shopping assistant here. What beautiful item are we looking for today? Tell me what you have in mind!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Fetch Master Catalog Data from Render Endpoint
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(
          "https://api-mockforge.onrender.com/api/databases/6a2bde3c54c439099ee6b611/resources/products"
        );
        const data = await res.json();
        const catalogItems = Array.isArray(data) ? data : data.products || [];
        setProducts(catalogItems);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      }
    };
    fetchCatalog();
  }, []);

  // 2. Continuous Scroll Anchor to target fresh chat inputs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 3. Central Parsing Engine matching all Assignment Criteria intents
  const processFrontendIntent = (userText) => {
    const text = userText.toLowerCase().trim();
    
    // Greetings Context Handling
    if (text.match(/\b(hi|hello|hey|hlo|greetings|good morning|good evening|how are you|dear|mam)\b/)) {
      return {
        text: "Hello dear! It's so nice to chat with you today. I'm doing wonderful, thank you for asking! What can I help you find for your collection or home right now?",
        results: []
      };
    }

    // "Best Product" Context Handling
    if (text.includes("which product is best") || text.includes("best product") || text.includes("top product")) {
      const bestItems = [...products]
        .filter(p => p.rating)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

      return {
        text: "Right here, dear! These are the absolute top-rated and best quality items available in our active catalog based on verified customer feedback. Take a look at these premium choices:",
        results: bestItems
      };
    }

    // Purchase Assistance Help Layout
    if (text.includes("how to purchase") || text.includes("how to buy")) {
      return {
        text: "Purchasing an item is incredibly simple, dear! Just follow these quick steps:\n\n1. Click the 'Add' button on any product card to put it in your cart.\n2. Click the Shopping Cart icon up in the top navbar corner to open your active session.\n3. Verify your pricing summary and hit the 'Proceed Checkout' button to finish your simulated order instantly!",
        results: []
      };
    }

    // Interface Navigation / Product Inspection Help
    if (text.includes("how to check") || text.includes("how to see details")) {
      return {
        text: "To check comprehensive details for any product, simply click on the item's title text or click directly on its picture box in the catalog display grid. This will instantly open a full screen dedicated page showcasing full specifications, description features, and customer reviews!",
        results: []
      };
    }

    let filtered = [...products];
    let filteringApplied = false;
    let feedbackDetails = [];

    // Category parsing conditions
    if (text.includes("electronic") || text.includes("gadget") || text.includes("device")) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === "electronics");
      feedbackDetails.push("latest gadgets");
      filteringApplied = true;
    } else if (text.includes("clothing") || text.includes("fashion") || text.includes("wear") || text.includes("shoes") || text.includes("jacket")) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === "fashion");
      feedbackDetails.push("stylish fashion collections");
      filteringApplied = true;
    } else if (text.includes("home") || text.includes("kitchen") || text.includes("furniture") || text.includes("chair") || text.includes("room")) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === "home");
      feedbackDetails.push("cozy home essentials");
      filteringApplied = true;
    }

    // Strict keyword scanning
    const productKeywords = ["laptop", "watch", "backpack", "tv", "camera", "bottle", "speaker", "mouse", "keyboard", "pillow", "purifier", "desk", "router", "led", "chair", "shoes"];
    productKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        filtered = filtered.filter(p => p.name?.toLowerCase().includes(keyword));
        filteringApplied = true;
      }
    });

    // Smart Regex Numeric Price parsing
    const budgetMatch = text.match(/(?:under|below|less than|within)\s*(?:rs\.?|₹)?\s*([\d,]+)/);
    if (budgetMatch) {
      const maxPrice = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
      filtered = filtered.filter(p => Number(p.price) <= maxPrice);
      feedbackDetails.push(`budget friendly choices under ₹${maxPrice.toLocaleString()}`);
      filteringApplied = true;
    }

    // Battery / Tech Backup specifications filtering
    if (text.includes("battery") || text.includes("backup")) {
      if (text.includes("best") || text.includes("excellent") || text.includes("great")) {
        filtered = filtered.filter(p => p.battery === "Excellent" || p.battery === "Great");
        feedbackDetails.push("incredible long-lasting battery life");
      } else {
        filtered = filtered.filter(p => p.battery);
        feedbackDetails.push("reliable battery backups");
      }
      filteringApplied = true;
    }

    // Premium Quality Rating boundaries
    if (text.includes("rating") || text.includes("rated") || text.includes("best quality") || text.includes("highly")) {
      filtered = filtered.filter(p => Number(p.rating) >= 4.4);
      feedbackDetails.push("highly recommended options loved by other shoppers");
      filteringApplied = true;
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filteringApplied) {
      if (filtered.length > 0) {
        // Communicate updates back to Home.jsx if hook callback is registered
        if (typeof onFilterResults === "function") {
          onFilterResults(filtered);
        }
        return {
          text: `Oh, I completely understand what you are looking for! I found some beautiful ${feedbackDetails.join(" with ")} that you are going to absolutely love. Take a look at these:`,
          results: filtered.slice(0, 4)
        };
      } else {
        return {
          text: `I hear you, dear! You're looking for items with those specific features, but our current catalog doesn't have an exact match right this second. Would you like to look at some of our other popular arrivals instead?`,
          results: []
        };
      }
    }

    // Fallback general substring tracking
    const fallbackMatches = products.filter(p => 
      p.name?.toLowerCase().includes(text) || 
      p.specs?.toLowerCase().includes(text)
    );

    if (fallbackMatches.length > 0) {
      if (typeof onFilterResults === "function") {
        onFilterResults(fallbackMatches);
      }
      return {
        text: `Let me check that for you... Ah, yes! Here are some lovely choices matching "${userText}" that I managed to secure from our stock area:`,
        results: fallbackMatches.slice(0, 4)
      };
    }

    return {
      text: "I want to make sure I find exactly what makes you happy! Could you specify if you are hunting for Electronic items, Trendy Fashion outfits, or something useful for your Home setup?",
      results: []
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query.trim();
    setQuery("");

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: currentQuery }]);
    setIsLoading(true);

    setTimeout(() => {
      const aiReply = processFrontendIntent(currentQuery);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: aiReply.text,
          matchedItems: aiReply.results,
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="ai-search-container">
      {/* Floating Chat Trigger Button */}
      <button className="chat-launcher-btn flex items-center justify-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI</span>
          </>
        )}
      </button>

      {/* Floating Chat Dialog Window */}
      {isOpen && (
        <div className="chat-dialog-box">
          <div className="chat-header">
            <div className="avatar-info">
              <span className="bot-avatar"><Bot className="w-5 h-5 text-indigo-600" /></span>
              <div>
                <h4>ShopSmart Agent</h4>
                <p className="status">AI Online & Listening</p>
              </div>
            </div>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-row ${
                  msg.sender === "user" ? "user justify-end" : "bot justify-start"
                }`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`p-1.5 rounded-full shrink-0 shadow-sm mt-0.5 ${msg.sender === "user" ? "bg-indigo-700 text-white" : "bg-purple-100 text-purple-700"}`}>
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="message-bubble whitespace-pre-line shadow-sm">
                      {msg.text}
                    </div>

                    {msg.matchedItems && msg.matchedItems.length > 0 && (
                      <div className="flex flex-col gap-2 mt-1 w-full max-w-[260px]">
                        {msg.matchedItems.map((item) => (
                          <Link 
                            key={item.id} 
                            to={`/product/${item.id}`}
                            className="bg-white border border-gray-100 p-2 rounded-xl shadow-xs flex gap-2.5 items-center hover:border-indigo-300 hover:shadow-md transition duration-200 text-left no-underline"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-50 border shrink-0 overflow-hidden flex items-center justify-center">
                              <img 
                                src={item.image.startsWith("http") ? item.image : `https://api-mockforge.onrender.com${item.image}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                  e.target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80`; 
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-[11px] font-bold text-gray-800 truncate m-0 leading-tight">{item.name}</h4>
                                <span className="text-[9px] bg-amber-50 text-amber-700 px-1 py-0.2 rounded-full font-bold shrink-0">★{item.rating}</span>
                              </div>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5 mb-0">{item.specs}</p>
                              <p className="text-[11px] text-indigo-600 font-bold mt-0.5 mb-0">₹{Number(item.price).toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 italic pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                Searching inventory...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask me something pleasant..."
              value={query}
              disabled={isLoading}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={isLoading || !query.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}