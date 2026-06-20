import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, MessageSquare, Send, User } from "lucide-react";

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local state for public reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "Ramesh Kumar",
      rating: 5,
      comment: "Absolutely amazing product! Exceeded my expectations, and the shipping was incredibly fast.",
      date: "12-06-2026"
    },
    {
      id: 2,
      reviewer: "Sneha J.",
      rating: 4,
      comment: "Very solid build quality. Highly recommended for daily use.",
      date: "10-06-2026"
    }
  ]);

  // Review Form States
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewerComment] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(
          "https://api-mockforge.onrender.com/api/databases/6a2bde3c54c439099ee6b611/resources/products"
        );
        const data = await res.json();
        const catalog = Array.isArray(data) ? data : data.products || [];
        const foundItem = catalog.find((p) => String(p.id) === String(id));
        
        setProduct(foundItem || null);
      } catch (err) {
        console.error("Failed to load item details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Handle Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      reviewer: reviewerName.trim() || "Anonymous Shopper",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-IN")
    };

    setReviews([newReview, ...reviews]);
    
    // Reset Form Fields
    setReviewerName("");
    setReviewerComment("");
    setReviewerRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The item configuration you are looking for does not exist or has been modified.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Previous View
      </button>

      {/* Main Layout Card Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10">
        
        {/* Left Side: Large Visual Preview Showcase Block */}
        <div className="w-full h-[320px] sm:h-[450px] bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 mix-blend-multiply transform hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80";
            }}
          />
        </div>

        {/* Right Side: Metadata Segment Content Actions Workspace */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight m-0 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {product.rating || "4.2"}
              </div>
              <span className="text-xs text-gray-400 font-medium">Verified Customer Asset Rating</span>
            </div>

            <div className="text-3xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-6">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Specifications & Technical Details</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {product.specs || "No technical parameters provided by supplier context."}
              </p>
              {product.battery && (
                <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50/60 px-3 py-2 rounded-lg w-fit border border-emerald-100/50 font-medium">
                  <span>🔋</span> <strong>{product.battery} Battery Backup Rating</strong>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Operations Blocks */}
          <div className="space-y-6">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-base transform active:scale-[0.99]"
            >
              <ShoppingCart className="w-5 h-5" /> Add Selected Item to Cart
            </button>

            {/* Feature Value Matrix Badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 text-center text-[11px] sm:text-xs text-gray-500 font-medium">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-500" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>7-Day Return policy</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Secure Warranty</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- ADDED SECTION: Public Reviews Container --- */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Public Reviews & Feedback
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Submission Form Input Box */}
          <div className="lg:col-span-1 bg-slate-50 border border-slate-100 p-5 rounded-xl h-fit">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Write a Public Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Selva Vignesh"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating Star Count</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewerRating(Number(e.target.value))}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
                >
                  <option value="5">⭐⭐⭐⭐★ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review Comments</label>
                <textarea
                  rows="4"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Share your thoughts about this item's setup or quality..."
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Submit Public Review
              </button>
            </form>
          </div>

          {/* Rendered Live Dynamic Feedback List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Latest Shopper Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-6">No reviews logged yet. Be the first to share your experience!</p>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border border-gray-100 bg-white p-4 rounded-xl shadow-xs flex gap-3 items-start animate-fadeIn">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-900 truncate m-0">{rev.reviewer}</h4>
                        <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed m-0">{rev.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}