'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FAQS = [
  {
    q: 'How can I place an order on Wholesaler-PK?',
    a: 'You can easily place an order by browsing our website, clicking "ADD TO CART" or "BUY IT NOW" on any product, and filling out your Cash on Delivery (COD) shipping address at checkout.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We offer Cash on Delivery (COD) across all cities in Pakistan. You only pay cash to the courier representative when the parcel is delivered to your doorstep.'
  },
  {
    q: 'How long does delivery take across Pakistan?',
    a: 'Orders shipped to major cities (Lahore, Islamabad, Rawalpindi, Karachi, Faisalabad, Multan) take 2 to 3 working days. Other remote areas take 3 to 4 working days.'
  },
  {
    q: 'Are your products authentic and genuine?',
    a: 'Yes! All Wholesaler-PK products are sourced from trusted suppliers and are 100% authentic and genuine. We carefully verify quality before items are listed and dispatched.'
  },
  {
    q: 'What is your shipping charge policy?',
    a: 'Standard delivery charges are Rs. 200 nationwide. However, all orders over Rs. 3,000 qualify for 100% FREE Home Delivery!'
  },
  {
    q: 'What if I receive a damaged or incorrect item?',
    a: 'We package all items securely to prevent damage during transit. If your parcel arrives damaged or incorrect, simply send us a clear photo or video by email within 24 hours and we will arrange a FREE replacement or refund immediately!'
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <TopBar />
      <Header />

      <section className="bg-[#f5f5f5] py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#000000] uppercase tracking-wide">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto mt-2">
            Find quick answers regarding delivery times, product quality, COD payment, and our guarantees.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 max-w-4xl py-12">
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="font-bold text-xs md:text-sm text-gray-900 flex items-center space-x-3">
                  <HelpCircle className="w-4 h-4 text-[#000000] flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openIdx === idx ? 'transform rotate-180 text-[#000000]' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="p-5 text-xs md:text-sm text-gray-700 leading-relaxed border-t border-gray-200 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
