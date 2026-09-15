'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.11V9.3a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.57a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.12c-.44-.36-.78-.83-1-1.35V6.69z" />
    </svg>
  );
}

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <TopBar />
      <Header />

      <section className="bg-[#f5f5f5] py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#000000] uppercase tracking-wide">
            Contact Us & Customer Support
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto mt-2">
            We are here to help you with order inquiries, wholesale distribution, and product feedback.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <h2 className="text-xl font-bold font-serif text-gray-900 uppercase">
              Send Us A Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center bg-green-50 rounded-2xl border border-green-200 space-y-3">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Message Received!</h3>
                <p className="text-xs text-gray-600">
                  Thank you for reaching out to Wholesaler-PK. Our customer support representative will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#6f0c07] hover:bg-[#580a06] text-white text-xs font-bold px-6 py-2.5 rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hassan Ahmed"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6f0c07] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6f0c07] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6f0c07] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6f0c07] outline-none bg-white"
                  >
                    <option value="General Inquiry">General Order Inquiry</option>
                    <option value="Delivery Tracking">Delivery Tracking & Status</option>
                    <option value="Wholesale / Bulk">Wholesale & Bulk Orders</option>
                    <option value="Feedback">Product Quality Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write details about your question or order..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6f0c07] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6f0c07] hover:bg-[#580a06] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-6">
            <div className="bg-[#f5f5f5] p-8 rounded-3xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-bold font-serif text-[#000000] uppercase">
                Direct Contact Helpline
              </h3>

              <div className="space-y-4 text-xs text-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-xl text-[#000000] shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 uppercase">Email Support</h4>
                    <p className="font-semibold text-gray-800">thewaadajewels@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-xl text-[#000000] shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 uppercase">Head Office Address</h4>
                    <p className="font-medium text-gray-700 leading-relaxed">
                      Wholesaler-PK Headquarters, Sector I-9/3, Industrial Area, Islamabad, Pakistan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Social Icons */}
              <div className="pt-4 border-t border-gray-300">
                <h4 className="font-bold text-gray-900 uppercase text-xs mb-3">Follow Us</h4>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/share/1JfmNRYKKp/"
                    target="_blank"
                    rel="noreferrer"
                    title="Facebook"
                    className="w-9 h-9 rounded-full bg-[#6f0c07] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#580a06] hover:ring-2 hover:ring-[#6f0c07]/30"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/waadajewels?stkn=ZDlsMDdoenQ4Z3Rh"
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram"
                    className="w-9 h-9 rounded-full bg-[#6f0c07] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#580a06] hover:ring-2 hover:ring-[#6f0c07]/30"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://www.tiktok.com/@waadajewels"
                    target="_blank"
                    rel="noreferrer"
                    title="TikTok"
                    className="w-9 h-9 rounded-full bg-[#6f0c07] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#580a06] hover:ring-2 hover:ring-[#6f0c07]/30"
                  >
                    <TiktokIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Pakistan Coverage Banner */}
            <div className="bg-[#6f0c07] text-white p-6 rounded-3xl text-center space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-wider text-yellow-400">Nationwide Cash on Delivery</h4>
              <p className="text-xs text-gray-300">
                Delivering premium quality products to Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan, Quetta, and all 300+ cities in Pakistan.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
