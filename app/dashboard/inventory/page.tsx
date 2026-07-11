"use client";

import { useMemo, useState } from 'react'

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  image: string | null;
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Ankara Fabric Bundle",
    sku: "AF-1029",
    category: "Fabrics",
    price: 8500,
    stock: 3,
    lowStockThreshold: 5,
    image: null,
  },
  {
    id: "2",
    name: "Beaded Sandals (Size 40)",
    sku: "BS-4021",
    category: "Footwear",
    price: 6200,
    stock: 2,
    lowStockThreshold: 5,
    image: null,
  },
  {
    id: "3",
    name: "Shea Butter — 500ml",
    sku: "SB-0087",
    category: "Beauty",
    price: 3500,
    stock: 5,
    lowStockThreshold: 10,
    image: null,
  },
  {
    id: "4",
    name: "Groundnut Oil — 5L",
    sku: "GO-2201",
    category: "Provisions",
    price: 12000,
    stock: 24,
    lowStockThreshold: 10,
    image: null,
  },
  {
    id: "5",
    name: "Aso-Oke Headtie",
    sku: "AO-3312",
    category: "Fabrics",
    price: 15500,
    stock: 8,
    lowStockThreshold: 5,
    image: null,
  },
  {
    id: "6",
    name: "Rice, 5kg bag",
    sku: "RC-0091",
    category: "Provisions",
    price: 8500,
    stock: 40,
    lowStockThreshold: 15,
    image: null,
  },
];

const categories = ["All", "Fabrics", "Footwear", "Beauty", "Provisions"];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Fabrics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter(
    (p) => p.stock <= p.lowStockThreshold,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImage(null);
      return;
    }
    setImage(await readFileAsDataUrl(file));
  };

  const resetForm = () => {
    setName("");
    setSku("");
    setCategory("Fabrics");
    setPrice("");
    setStock("");
    setLowStockThreshold("");
    setImage(null);
    setEditingProduct(null);
  };

  const openAdd = () => {
    resetForm();
    setShowAdd(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setLowStockThreshold(String(product.lowStockThreshold));
    setImage(product.image);
    setShowAdd(true);
  };

  const closeModal = () => {
    setShowAdd(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock — production POST/PATCH to your backend inventory endpoint.
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                sku,
                category,
                price: Number(price),
                stock: Number(stock),
                lowStockThreshold: Number(lowStockThreshold),
                image,
              }
            : p,
        ),
      );
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name,
        sku,
        category,
        price: Number(price),
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        image,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }

    setIsSubmitting(false);
    closeModal();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0)
      return { label: "Out of Stock", className: "failed" };
    if (product.stock <= product.lowStockThreshold)
      return { label: "Low Stock", className: "pending" };
    return { label: "In Stock", className: "paid" };
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>
          Inventory
        </div>
        <h1>
          Manage your <span>stock</span>.
        </h1>
        <p>Track products, prices, and stock levels across your business.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                <path d="M3 8v8l9 5 9-5V8" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="stat-value">₦{totalValue.toLocaleString()}</div>
          <div className="stat-label">Total Stock Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{lowStockCount}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{outOfStockCount}</div>
          <div className="stat-label">Out of Stock</div>
        </div>
      </div>

      <div className="panel">
        <div className="inventory-toolbar">
          <div className="inventory-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="inventory-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button className="biz-add-btn" onClick={openAdd}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--gray)",
            }}
          >
            <p style={{ fontSize: "0.9rem" }}>No products match your search.</p>
          </div>
        ) : (
          <div className="inventory-table">
            <div className="inventory-table-head">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span></span>
            </div>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              return (
                <div className="inventory-row" key={product.id}>
                  <div className="inventory-product-cell">
                    <div className="inventory-thumb">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        product.name[0]
                      )}
                    </div>
                    <div>
                      <div className="inventory-name">{product.name}</div>
                      <div className="inventory-sku">SKU: {product.sku}</div>
                    </div>
                  </div>
                  <span className="inventory-category">{product.category}</span>
                  <span className="inventory-price">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="inventory-stock">{product.stock} units</span>
                  <span className={`order-status ${status.className}`}>
                    {status.label}
                  </span>
                  <div className="inventory-actions">
                    <button
                      className="icon-btn-small"
                      onClick={() => openEdit(product)}
                      title="Edit"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="15"
                        height="15"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z" />
                      </svg>
                    </button>
                    <button
                      className="icon-btn-small warn"
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="15"
                        height="15"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <p className="modal-sub">
              {editingProduct
                ? "Update the details for this product."
                : "Add a new item to your inventory."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="logo-upload-row">
                <div className="logo-upload-box">
                  {image ? (
                    <img src={image} alt="Product" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--gray)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="22"
                      height="22"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e.target.files?.[0] || null)
                    }
                  />
                  <div className="logo-upload-plus">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </div>
                <div className="logo-upload-text">
                  <strong>Product Photo</strong>
                  <span>Optional — PNG or JPG.</span>
                </div>
              </div>

              <div className="modal-field">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankara Fabric Bundle"
                />
              </div>

              <div className="form-row-2">
                <div className="modal-field">
                  <label>SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AF-1029"
                  />
                </div>
                <div className="modal-field">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="modal-field">
                  <label>Price (₦)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="modal-field">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="modal-field">
                <label>Low Stock Alert Threshold</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-modal"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
