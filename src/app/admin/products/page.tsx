'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  Save,
  X,
  Package,
  Layers,
  DollarSign,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { PRODUCTS } from '@/data/products';
import { subscribeProducts, saveProductToFirestore, deleteProductFromFirestore } from '@/lib/firestoreServices';
import ProductCardClient from '@/app/collections/[category]/ProductCardClient';
import ProductQuickViewModal from '@/components/products/ProductQuickViewModal';

// Master Categories mapping for Admin (includes jewelry + general store categories)
const ADMIN_CATEGORIES = [
  {
    id: 'necklaces',
    name: 'Necklaces',
    subcategories: [
      { id: 'necklaces', name: 'All Necklaces' },
      { id: 'pendant-necklaces', name: 'Pendants & Chains' },
      { id: 'chokers', name: 'Chokers' },
    ],
  },
  {
    id: 'rings',
    name: 'Rings',
    subcategories: [
      { id: 'rings', name: 'All Rings' },
      { id: 'diamond-rings', name: 'Diamond Rings' },
      { id: 'bands', name: 'Bands & Stacks' },
    ],
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    subcategories: [
      { id: 'bracelets', name: 'All Bracelets' },
      { id: 'bangles', name: 'Bangles & Cuffs' },
    ],
  },
  {
    id: 'firefighters',
    name: 'Firefighters',
    subcategories: [
      { id: 'firefighters', name: 'All Firefighters' },
      { id: 'firefighter-equipment', name: 'Equipment & Gear' },
    ],
  },
  {
    id: 'apparel',
    name: 'Apparel',
    subcategories: [
      { id: 'men-fashion', name: 'Men Fashion' },
      { id: 'women-fashion', name: 'Women Fashion' },
      { id: 'kids-fashion', name: 'Kids Fashion' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    subcategories: [
      { id: 'mobile-accessories', name: 'Mobile Accessories' },
      { id: 'audio', name: 'Audio & Wearables' },
    ],
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    subcategories: [
      { id: 'kitchen-products', name: 'Kitchen Products' },
      { id: 'decor', name: 'Home Decor' },
    ],
  },
  { id: 'grocery', name: 'Grocery & Essentials', subcategories: [] },
  { id: 'beauty-care', name: 'Beauty & Care', subcategories: [] },
  { id: 'best-selling', name: 'Best Selling', subcategories: [] },
  { id: 'bundles', name: 'Value Bundles', subcategories: [] },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Form Drawer / Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    urduName: '',
    shortDescription: '',
    description: '',
    category: 'necklaces',
    categoryName: 'Necklaces',
    subCategory: '',
    subCategoryName: '',
    price: 870,
    originalPrice: 1100,
    wholesalePrice: 800,
    moq: 1,
    inStock: true,
    isBestSeller: false,
    isNew: false,
    discountBadge: '',
    image: '',
    hoverImage: '',
    images: [],
    unit: 'Piece',
  });

  // Additional image URL string for form
  const [galleryUrlsString, setGalleryUrlsString] = useState('');

  // Preview State
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeProducts((dynamicProducts) => {
      if (dynamicProducts && dynamicProducts.length > 0) {
        setProducts(dynamicProducts);
      } else {
        setProducts(PRODUCTS);
      }
      setLoading(false);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Update Category & Subcategory when Category changes in Form
  const handleCategoryChange = (catId: string) => {
    const matched = ADMIN_CATEGORIES.find((c) => c.id === catId);
    const catName = matched ? matched.name : catId;
    const subcats = matched ? matched.subcategories : [];
    const defaultSub = subcats[0] ? subcats[0].id : '';
    const defaultSubName = subcats[0] ? subcats[0].name : '';

    setFormData((prev) => ({
      ...prev,
      category: catId,
      categoryName: catName,
      subCategory: defaultSub,
      subCategoryName: defaultSubName,
    }));
  };

  const handleSubCategoryChange = (subCatId: string) => {
    const currentCat = ADMIN_CATEGORIES.find((c) => c.id === formData.category);
    const matchedSub = currentCat?.subcategories.find((s) => s.id === subCatId);

    setFormData((prev) => ({
      ...prev,
      subCategory: subCatId,
      subCategoryName: matchedSub ? matchedSub.name : subCatId,
    }));
  };

  const handleOpenAddForm = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      urduName: '',
      shortDescription: 'Ice, Milk, Cream, Espresso, Condensed Milk...',
      description: 'Premium quality crafted item with finest finish.',
      category: 'necklaces',
      categoryName: 'Necklaces',
      subCategory: 'necklaces',
      subCategoryName: 'All Necklaces',
      price: 870,
      originalPrice: 1100,
      wholesalePrice: 800,
      moq: 1,
      inStock: true,
      isBestSeller: false,
      isNew: true,
      discountBadge: '20% OFF',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      hoverImage: '',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'],
      unit: 'Piece',
    });
    setGalleryUrlsString('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormData({ ...prod });
    setGalleryUrlsString(prod.images ? prod.images.join(', ') : '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a product name');
      return;
    }

    setFormSaving(true);
    try {
      const parsedGallery = galleryUrlsString
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const finalImages = parsedGallery.length > 0
        ? parsedGallery
        : formData.image
        ? [formData.image]
        : [];

      const payload: Partial<Product> = {
        ...formData,
        id: editingProductId || undefined,
        images: finalImages,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        moq: Number(formData.moq) || 1,
      };

      await saveProductToFirestore(payload);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product. Please try again.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProductFromFirestore(id);
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete product.');
      }
    }
  };

  const handleToggleStock = async (prod: Product) => {
    try {
      await saveProductToFirestore({
        ...prod,
        inStock: !prod.inStock,
      });
    } catch (err) {
      console.error('Stock toggle error:', err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const selectedCatObj = ADMIN_CATEGORIES.find((c) => c.id === formData.category);

  return (
    <div className="min-h-screen bg-[#111215] text-[#f4f4f5] font-sans">
      
      {/* Top Header Navigation */}
      <header className="bg-[#191b20] border-b border-[#282c36] sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-[#232730] hover:bg-[#2b303c] text-gray-300 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Product Manager Admin</span>
                <span className="bg-[#0d5c46] text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </h1>
              <p className="text-xs text-gray-400">Manage categories, prices, ingredients &amp; dynamic store cards</p>
            </div>
          </div>

          <button
            onClick={handleOpenAddForm}
            className="bg-[#0d5c46] hover:bg-[#094736] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Filter Controls Bar */}
        <div className="bg-[#191b20] border border-[#282c36] p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111215] border border-[#2e3340] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-[#0d5c46] outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Filter Collection:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-[#111215] border border-[#2e3340] text-xs text-white px-3 py-2.5 rounded-xl outline-none cursor-pointer"
            >
              <option value="all">All Collections ({products.length})</option>
              {ADMIN_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product List Table */}
        <div className="bg-[#191b20] border border-[#282c36] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#21242c] text-gray-300 font-bold uppercase border-b border-[#2d323e]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Collection / Subcategory</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">MOQ</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a34]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No products found. Click &quot;Add New Product&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const primaryImg = prod.image || (prod.images && prod.images[0]) || '';
                    return (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                        {/* Product Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#232730] overflow-hidden flex-shrink-0 border border-white/5">
                              {primaryImg ? (
                                <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-[9px]">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm truncate">{prod.name}</div>
                              {prod.shortDescription && (
                                <div className="text-[11px] text-gray-400 truncate max-w-xs">
                                  {prod.shortDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Collection / Subcategory */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-200">{prod.categoryName || prod.category}</div>
                          {prod.subCategoryName && (
                            <div className="text-[10px] text-emerald-400 font-medium">{prod.subCategoryName}</div>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-bold text-white">
                          Rs. {prod.price?.toLocaleString()}
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-gray-400 line-through block font-normal">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* MOQ */}
                        <td className="py-3.5 px-4 text-gray-300 font-semibold">{prod.moq || 1}</td>

                        {/* Stock Toggle Status */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStock(prod)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                              prod.inStock !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {prod.inStock !== false ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewProduct(prod);
                                setIsPreviewOpen(true);
                              }}
                              className="p-2 rounded-xl bg-[#232730] hover:bg-[#2e3442] text-gray-300 transition cursor-pointer"
                              title="Preview Popup"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(prod)}
                              className="p-2 rounded-xl bg-[#232730] hover:bg-[#0d5c46] text-white transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-2 rounded-xl bg-[#232730] hover:bg-red-600 text-white transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FORM MODAL: Add / Edit Product */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans text-gray-900">
          <div className="fixed inset-0" onClick={() => setIsFormOpen(false)} />

          <div className="relative w-full max-w-4xl bg-[#181a20] text-[#f4f4f5] rounded-3xl p-6 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col border border-[#2d323e]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2f3d] mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{editingProductId ? 'Edit Product Details' : 'Add New Product'}</span>
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-[#242834] text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="overflow-y-auto space-y-6 flex-1 pr-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LEFT FORM SECTION */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Basic Details</span>
                  </h3>

                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dublin Brew or Emerald Solitaire"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Urdu Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Urdu Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ڈبلن بریو"
                      value={formData.urduName || ''}
                      onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Short Description / Ingredients */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Ingredients / Short Subtitle (Appears on Card &amp; Popup) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ice, Milk, Cream, Espresso, Condensed Milk..."
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      placeholder="Full product description..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition resize-none"
                    />
                  </div>

                  {/* Dynamic Category & Subcategory Selection */}
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Collection &amp; Category Assignment</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Main Collection *</label>
                      <select
                        value={formData.category || 'necklaces'}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {ADMIN_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Subcategory</label>
                      <select
                        value={formData.subCategory || ''}
                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                        className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {selectedCatObj && selectedCatObj.subcategories.length > 0 ? (
                          selectedCatObj.subcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))
                        ) : (
                          <option value="">General ({formData.categoryName})</option>
                        )}
                      </select>
                    </div>
                  </div>

                </div>

                {/* RIGHT FORM SECTION */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Pricing &amp; Inventory</span>
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Regular Price *</label>
                      <input
                        type="number"
                        required
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Original Price</label>
                      <input
                        type="number"
                        value={formData.originalPrice || 0}
                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                        className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">MOQ</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.moq || 1}
                        onChange={(e) => setFormData({ ...formData, moq: Number(e.target.value) })}
                        className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.inStock !== false}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <span>In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.isBestSeller)}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <span>Best Seller</span>
                    </label>
                  </div>

                  {/* Images & Media */}
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Product Image URLs</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Discount Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. 20% OFF or Special"
                      value={formData.discountBadge || ''}
                      onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                      className="w-full bg-[#20232c] border border-[#2e3342] text-xs text-white rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Live Card Preview Box */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-400 mb-2">Live Card Preview:</label>
                    <div className="pointer-events-none transform scale-95 origin-top-left">
                      <ProductCardClient
                        product={{
                          id: 'preview',
                          slug: 'preview',
                          name: formData.name || 'Sample Product',
                          category: formData.category || 'necklaces',
                          categoryName: formData.categoryName || 'Necklaces',
                          subCategoryName: formData.subCategoryName || '',
                          price: Number(formData.price) || 870,
                          originalPrice: Number(formData.originalPrice) || 1100,
                          image: formData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
                          description: formData.description || '',
                          shortDescription: formData.shortDescription || 'Ice, Milk, Cream, Espresso, Condensed Milk...',
                          images: [formData.image || ''],
                        }}
                      />
                    </div>
                  </div>

                </div>

              </div>

              {/* Submit Footer */}
              <div className="pt-4 border-t border-[#2a2f3d] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-[#242834] hover:bg-[#2e3444] text-gray-300 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="bg-[#0d5c46] hover:bg-[#094736] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{formSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* QUICK VIEW PREVIEW MODAL */}
      {isPreviewOpen && (
        <ProductQuickViewModal
          product={previewProduct}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

    </div>
  );
}
