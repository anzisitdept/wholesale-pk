'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle, Truck, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { saveOrderToFirestore } from '@/lib/firestoreServices';
import { loadLocationData, LocationDataSet } from '@/lib/locationData';
import SearchableSelect from '@/components/checkout/SearchableSelect';

export default function CheckoutModal() {
  const {
    cart,
    subtotal,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    amountNeededForFreeShipping
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [locationData, setLocationData] = useState<LocationDataSet | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [location, setLocation] = useState({
    provinceId: '',
    districtId: '',
    tehsilId: ''
  });
  const [locationNames, setLocationNames] = useState({
    province: '',
    district: '',
    tehsil: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen && !locationData) {
      setLoadingLocations(true);
      loadLocationData()
        .then(setLocationData)
        .catch(() => setLocationData(null))
        .finally(() => setLoadingLocations(false));
    }
  }, [isCheckoutOpen, locationData]);

  const provinces = useMemo(
    () =>
      (locationData?.provinces ?? []).map(p => ({
        value: p.id,
        label: p.name.en
      })),
    [locationData]
  );

  const districts = useMemo(() => {
    const list = locationData?.districts ?? [];
    const filtered = location.provinceId
      ? list.filter(d => d.parent.id === location.provinceId)
      : [];
    return filtered.map(d => ({
      value: d.id,
      label: d.name.en
    }));
  }, [locationData, location.provinceId]);

  const tehsils = useMemo(() => {
    const list = locationData?.tehsils ?? [];
    const filtered = location.districtId
      ? list.filter(t => t.parent.id === location.districtId)
      : [];
    return filtered.map(t => ({
      value: t.id,
      label: t.name.en
    }));
  }, [locationData, location.districtId]);

  // Auto-select a single available option
  useEffect(() => {
    if (districts.length === 1) {
      setLocation(l => ({
        ...l,
        districtId: districts[0].value,
        tehsilId: ''
      }));
      setLocationNames(n => ({ ...n, district: districts[0].label, tehsil: '' }));
    }
  }, [districts]);

  useEffect(() => {
    if (tehsils.length === 1) {
      setLocation(l => ({ ...l, tehsilId: tehsils[0].value }));
      setLocationNames(n => ({ ...n, tehsil: tehsils[0].label }));
    }
  }, [tehsils]);

  if (!isCheckoutOpen) return null;

  const deliveryFee = subtotal >= 3000 ? 0 : 200;
  const grandTotal = subtotal + deliveryFee;

  const handleProvinceChange = (value: string, label: string) => {
    setLocation({ provinceId: value, districtId: '', tehsilId: '' });
    setLocationNames({ province: label, district: '', tehsil: '' });
  };

  const handleDistrictChange = (value: string, label: string) => {
    setLocation(l => ({ ...l, districtId: value, tehsilId: '' }));
    setLocationNames(n => ({ ...n, district: label, tehsil: '' }));
  };

  const handleTehsilChange = (value: string, label: string) => {
    setLocation(l => ({ ...l, tehsilId: value }));
    setLocationNames(n => ({ ...n, tehsil: label }));
  };

  const fullLocation = [locationNames.province, locationNames.district, locationNames.tehsil]
    .filter(Boolean)
    .join(', ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required shipping details including your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert('Please enter a valid email address so we can send your order confirmation.');
      return;
    }
    if (!location.provinceId || !location.districtId || !location.tehsilId) {
      alert('Please select your Province, District, and Tehsil.');
      return;
    }

    setIsSaving(true);

    const orderPayload = {
      customerName: formData.fullName,
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: fullLocation,
      province: {
        id: location.provinceId,
        name: locationNames.province
      },
      district: {
        id: location.districtId,
        name: locationNames.district
      },
      tehsil: {
        id: location.tehsilId,
        name: locationNames.tehsil
      },
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        selectedWeight: item.selectedWeight,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      shippingFee: deliveryFee,
      totalAmount: grandTotal,
      paymentMethod: 'Cash on Delivery (COD)',
      orderStatus: 'Pending' as const
    };

    // Save to Firestore in real-time for Admin Panel
    const result = await saveOrderToFirestore(orderPayload);
    const placedOrderId = result.orderId || '';

    // Trigger order confirmation email in the background
    try {
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: placedOrderId,
          customerName: formData.fullName,
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          city: fullLocation,
          items: orderPayload.items,
          subtotal,
          shippingFee: deliveryFee,
          totalAmount: grandTotal,
          paymentMethod: orderPayload.paymentMethod,
        }),
      }).catch(err => console.error("Email notification error:", err));
    } catch (err) {
      console.error("Failed to dispatch order email:", err);
    }

    setOrderId(placedOrderId);
    setIsSaving(false);
    setIsSubmitted(true);
    clearCart();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 md:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#000000] text-white p-4 sm:p-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight uppercase tracking-wider">
                {isSubmitted ? 'Order Confirmed!' : 'Cash on Delivery (COD) Checkout'}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-200">Official Store - Wholesaler-PK</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-full transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {isSubmitted ? (
          /* Order Confirmation View */
          <div className="p-4 sm:p-6 text-center space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Thank You For Your Order!</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Your order number is <span className="font-bold text-[#000000] bg-gray-100 px-2 py-0.5 rounded">{orderId}</span>
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                Order confirmation has been sent to <span className="font-semibold text-gray-800">{formData.email}</span>. Our team will also verify your order on <span className="font-semibold text-gray-800">{formData.phone}</span> before dispatch.
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 sm:p-4 rounded-xl text-left border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-bold text-gray-800">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email Address:</span>
                <span className="font-semibold text-gray-800">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-semibold text-gray-800">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Address:</span>
                <span className="font-semibold text-gray-800">{formData.address}, {fullLocation}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="text-gray-600 font-medium">Total Amount (COD):</span>
                <span className="font-extrabold text-[#000000] text-sm sm:text-base">Rs. {grandTotal}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center pt-2 pb-2">
              <a
                href={`https://wa.me/923100005480?text=Hi%20Wholesaler-PK,%20I%20placed%20order%20${orderId}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Track on WhatsApp</span>
              </a>
              <button
                onClick={handleClose}
                className="bg-[#000000] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#333333] transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-h-[85vh] md:max-h-none overflow-y-auto checkout-modal-body">

            {/* Left: Customer Info Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b pb-2">
                Shipping Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Order confirmation & tracking updates will be sent to this email.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] outline-none"
                />
              </div>

              {/* Location heading */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 border-b pb-2">
                  <MapPin size={14} className="text-[#000000]" />
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                    Province, District & Tehsil
                  </h4>
                </div>
              </div>

              <SearchableSelect
                label="Province"
                placeholder={loadingLocations ? 'Loading provinces...' : 'Select Province'}
                options={provinces}
                value={location.provinceId}
                onChange={handleProvinceChange}
                disabled={loadingLocations}
                required
              />

              <SearchableSelect
                label="District"
                placeholder={location.provinceId ? 'Select District' : 'Select Province first'}
                options={districts}
                value={location.districtId}
                onChange={handleDistrictChange}
                disabled={!location.provinceId}
                required
              />

              <SearchableSelect
                label="Tehsil"
                placeholder={location.districtId ? 'Select Tehsil' : 'Select District first'}
                options={tehsils}
                value={location.tehsilId}
                onChange={handleTehsilChange}
                disabled={!location.districtId}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House #, Street #, Sector/Area, Nearby Landmark"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] outline-none"
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b pb-2 mb-3">
                  Order Summary ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
                </h3>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-200">
                  {cart.map(item => (
                    <div key={item.cartId} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 pt-3 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping (Delivery Fee)</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold border-t pt-2 text-[#000000]">
                    <span>Total Amount</span>
                    <span>Rs. {grandTotal}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center space-x-2 text-[11px] text-green-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Payment Method: <strong>Cash on Delivery (Pay when order arrives)</strong></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#000000] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {isSaving ? 'CONFIRMING ORDER...' : 'PLACE CONFIRMED COD ORDER'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
