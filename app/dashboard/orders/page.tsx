"use client";

import { useBusinessStore } from "@/store/businessStore";
import { useOrderStore, type Order } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "transfer", label: "Bank Transfer" },
  { value: "wallet", label: "Wallet" },
];

export default function OrdersPage() {
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { products, fetchProducts } = useProductStore();
  const {
    orders,
    isSubmitting,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  } = useOrderStore();

  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutError, setCheckoutError] = useState("");
  const [showSuccess, setShowSuccess] = useState<Order | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);
  
  useEffect(() => {
  setCart([])
}, [activeBusinessId])

  useEffect(() => {
    if (businesses.length > 0 && activeBusinessId === null) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    if (activeBusinessId !== null) {
      fetchProducts(activeBusinessId);
      fetchOrders(activeBusinessId);
    }
  }, [activeBusinessId]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [products, productSearch]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock === 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("cash");
    setCheckoutError("");
  };

  const handleCheckout = async () => {
    if (activeBusinessId === null || cart.length === 0) return;
    setCheckoutError("");

    try {
      const order = await createOrder(activeBusinessId, {
        customerName: customerName || "Walk-in Customer",
        customerPhone: customerPhone || undefined,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      // Refresh products since stock changed server-side
      fetchProducts(activeBusinessId);
      setShowSuccess(order);
      clearCart();
    } catch (err: any) {
      setCheckoutError(
        err.response?.data?.message || "Could not complete this order.",
      );
    }
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    if (activeBusinessId === null) return;
    await updateOrderStatus(activeBusinessId, orderId, status);
    fetchProducts(activeBusinessId);
  };

  if (businesses.length === 0) {
    return (
      <>
        <div className="dash-welcome">
          <div className="dash-welcome-eyebrow">
            <span className="dot"></span>
            Orders
          </div>
          <h1>
            Process <span>sales</span>.
          </h1>
        </div>
        <div
          className="panel"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
            You need to register a business before you can take orders.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>
          Orders
        </div>
        <h1>
          Process <span>sales</span>.
        </h1>
        <p>Build an order, take payment, and manage sales history.</p>
      </div>

      {businesses.length > 1 && (
        <div
          className="field-group"
          style={{ maxWidth: 320, marginBottom: 20 }}
        >
          <label className="field-label">Business</label>
          <select
            value={activeBusinessId ?? ""}
            onChange={(e) => setActiveBusinessId(Number(e.target.value))}
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="pos-layout">
        <div className="panel pos-products-panel">
          <div className="inventory-search" style={{ marginBottom: 16 }}>
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
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <div className="pos-product-grid">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                className="pos-product-card"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                <div className="pos-product-thumb">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    product.name[0]
                  )}
                </div>
                <div className="pos-product-name">{product.name}</div>
                <div className="pos-product-price">
                  ₦{product.price.toLocaleString()}
                </div>
                <div
                  className={`pos-product-stock ${product.stock === 0 ? "out" : ""}`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : `${product.stock} in stock`}
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <p
                style={{
                  fontSize: "0.86rem",
                  color: "var(--gray)",
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                No products found.
              </p>
            )}
          </div>
        </div>

        <div className="panel pos-cart-panel">
          <h2
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.05rem",
              marginBottom: 16,
            }}
          >
            Current Order
          </h2>

          {cart.length === 0 ? (
            <p
              style={{
                fontSize: "0.84rem",
                color: "var(--gray)",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              Tap a product to add it to the order.
            </p>
          ) : (
            <div className="pos-cart-items">
              {cart.map((item) => (
                <div className="pos-cart-item" key={item.productId}>
                  <div className="pos-cart-item-info">
                    <div className="pos-cart-item-name">{item.name}</div>
                    <div className="pos-cart-item-price">
                      ₦{item.price.toLocaleString()} each
                    </div>
                  </div>
                  <div className="pos-qty-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="pos-cart-remove"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="14"
                      height="14"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <div className="pos-cart-total">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>

              <div className="modal-field" style={{ marginTop: 16 }}>
                <label>Customer Name (optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                />
              </div>
              <div className="modal-field">
                <label>Phone (optional)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="080..."
                />
              </div>
              <div className="modal-field">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {checkoutError && (
                <div className="error-message" style={{ marginTop: 12 }}>
                  {checkoutError}
                </div>
              )}

              <button
                className="btn-create"
                style={{ width: "100%", marginTop: 16 }}
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : `Complete Order — ₦${cartTotal.toLocaleString()}`}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>Order History</h2>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            No orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <div className="order-row" key={order.id}>
              <div>
                <div className="order-customer">{order.customerName}</div>
                <div className="order-id">
                  {order.orderNumber} · {order.items.length} item
                  {order.items.length === 1 ? "" : "s"}
                </div>
              </div>
              <div />
              <div className="order-amount">
                ₦{order.totalAmount.toLocaleString()}
              </div>
              <select
                className={`order-status-select ${order.status}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))
        )}
      </div>

      {showSuccess && (
        <div className="modal-overlay" onClick={() => setShowSuccess(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Order Complete</h3>
              <p className="modal-sub">
                {showSuccess.orderNumber} — ₦
                {showSuccess.totalAmount.toLocaleString()} recorded for{" "}
                {showSuccess.customerName}.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-primary-modal"
                  style={{ flex: "none", width: "100%" }}
                  onClick={() => setShowSuccess(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
