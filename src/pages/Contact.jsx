import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Support",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Reset Form
    setFormData({ name: "", email: "", subject: "Support", message: "" });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight m-0 text-gray-900">
          Get in Touch with <span className="text-indigo-600">ShopSmart</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          Have questions about an order, budget parameters, or how our conversational AI search works? Drop us a message below!
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start w-full">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-2 space-y-4 w-full">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight m-0 mb-2">
            Contact Channels
          </h2>
          
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Support</h4>
              <p className="text-sm sm:text-base font-semibold text-gray-800 m-0 truncate">support@shopsmart-ai.com</p>
              <p className="text-xs text-gray-400 mt-1 m-0">Average response time is under 12 hours.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Toll-Free Helpline</h4>
              <p className="text-sm sm:text-base font-semibold text-gray-800 m-0">1800-425-SMART</p>
              <p className="text-xs text-gray-400 mt-1 m-0">Available for order tracking support.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Technology Hub Base</h4>
              <p className="text-sm sm:text-base font-semibold text-gray-800 m-0">Block-C, Tech Park Campus</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 m-0">Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Operating Hours</h4>
              <p className="text-sm sm:text-base font-semibold text-gray-800 m-0">Monday – Saturday</p>
              <p className="text-xs text-gray-500 mt-0.5 m-0">09:00 AM – 06:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form Container */}
        <div className="lg:col-span-3 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm w-full">
          <h3 className="text-lg font-bold text-gray-900 m-0 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Send an Electronic Message
          </h3>

          {formSubmitted && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-sm flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Message Dispatched!</strong> Your message has been sent successfully. We will review it and get back to you shortly.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Selva Vignesh"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inquiry Topic</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium text-gray-700 transition"
              >
                <option value="Support">Technical Product Support</option>
                <option value="Order">Order Tracking & Cart Sessions</option>
                <option value="AI">AI Assistant Engine Feedback</option>
                <option value="Business">Business Partnerships</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message Detail</label>
              <textarea
                rows="5"
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you today?"
                className="w-full p-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-sm transform active:scale-[0.995]"
            >
              <Send className="w-4 h-4" /> Send Message Entry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}