"use client";

import api from "@/store/axiosInstance";
import { useBusinessStore } from "@/store/businessStore";
import { useOrderStore, type Order } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import { ClipboardList } from "lucide-react";
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
  const [riders, setRiders] = useState<any[]>([]);
  const [orderDispatch, setOrderDispatch] = useState<
    Record<number, { riderId: number; status: string }>
  >({});
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { products, fetchProducts, clearProducts } = useProductStore();
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

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [noteLog, setNoteLog] = useState<
    { id: string; text: string; date: string }[]
  >([]);

  const openOrderDetail = (order: Order) => {
    setViewingOrder(order);
    setOrderNote("");
  };

  const addNote = () => {
    if (!orderNote.trim()) return;
    setNoteLog((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: orderNote,
        date: new Date().toLocaleString("en-NG", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setOrderNote("");
  };

  const handleAiParse = async () => {
    if (!activeBusinessId || !aiInput.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await api.post(`/businesses/${activeBusinessId}/ai-order`, {
        text: aiInput,
      });
      const newCartItems = res.data.items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.stock,
      }));
      setCart(newCartItems);
      setAiInput("");
    } catch (err: any) {
      setAiError(err.response?.data?.message || "Could not parse that order");
    } finally {
      setAiLoading(false);
    }
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    setCart([]);
  }, [activeBusinessId]);

  useEffect(() => {
    if (businesses.length > 0 && activeBusinessId === null) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    clearProducts();
    if (activeBusinessId !== null) {
      fetchProducts(activeBusinessId);
      fetchOrders(activeBusinessId);
    }
  }, [activeBusinessId]);
  //riders
  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/riders`)
        .then((res) => {
          setRiders(res.data.riders.filter((r: any) => r.isActive));
        })
        .catch(() => {});
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
  const handleConfirmOrder = async (orderId: number) => {
    if (!activeBusinessId) return;
    try {
      await api.post(
        `/businesses/${activeBusinessId}/orders/${orderId}/confirm`,
      );
      fetchOrders(activeBusinessId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not confirm order");
    }
  };

  if (businesses.length === 0) {
    return (
      <>
        <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <ClipboardList size={25} strokeWidth={2.5} />
          </span>
          <span>ORDERS</span>
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
  //rider
  const handleDispatchStatusChange = async (
    orderId: number,
    status: string,
  ) => {
    if (!activeBusinessId) return;
    try {
      await api.patch(
        `/businesses/${activeBusinessId}/orders/${orderId}/dispatch-status`,
        { status },
      );
      setOrderDispatch((prev) => ({
        ...prev,
        [orderId]: { ...prev[orderId], status },
      }));
      // If delivered, the backend also marks the order "fulfilled" refresh orders to reflect that
      if (status === "delivered") {
        fetchOrders(activeBusinessId);
      }
    } catch (err) {
      console.error("Could not update dispatch status", err);
    }
  };

  const handleAssignRider = async (orderId: number, riderId: number) => {
    if (!activeBusinessId || !riderId) return;
    try {
      const res = await api.post(
        `/businesses/${activeBusinessId}/orders/${orderId}/assign-rider`,
        { riderId },
      );
      setOrderDispatch((prev) => ({
        ...prev,
        [orderId]: { riderId, status: res.data.dispatch.status },
      }));
    } catch (err) {
      console.error("Could not assign rider", err);
    }
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <ClipboardList size={25} strokeWidth={2.5} />
          </span>
          <span>ORDERS</span>
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
          <div className="panel" style={{ marginBottom: 16 }}>
            <label className="field-label">
              AI Order Entry{" "}
              <span style={{ color: "var(--accent)" }}>✦ Enterprise</span>
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g. 2 bags of rice and 1 groundnut oil"
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 9,
                  border: "1.5px solid var(--line)",
                }}
              />
              <button
                className="btn-create"
                onClick={handleAiParse}
                disabled={aiLoading}
              >
                {aiLoading ? "Thinking..." : "Build Order"}
              </button>
            </div>
            {aiError && (
              <div className="error-message" style={{ marginTop: 10 }}>
                {aiError}
              </div>
            )}
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
              fontFamily: "inter",
              fontSize: "1.05rem",
              fontWeight:700,
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
            <div className="order-row-dispatch" key={order.id}>
              <div
                className="order-row"
                key={order.id}
                onClick={() => openOrderDetail(order)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div className="order-customer">{order.customerName}</div>
                  <div className="order-id">
                    {order.orderNumber} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </div>
                </div>
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
              {!order.confirmedAt && order.status !== "cancelled" && (
                <button
                  className="confirm-order-btn"
                  onClick={() => handleConfirmOrder(order.id)}
                >
                  Confirm Order
                </button>
              )}
              {riders.length > 0 && order.status !== "cancelled" && (
                <div className="dispatch-row">
                  <select
                    className="dispatch-select"
                    value={orderDispatch[order.id]?.riderId || ""}
                    onChange={(e) =>
                      handleAssignRider(order.id, Number(e.target.value))
                    }
                  >
                    <option value="">Assign rider...</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  {orderDispatch[order.id]?.riderId && (
                    <select
                      className="dispatch-select"
                      value={orderDispatch[order.id]?.status || "assigned"}
                      onChange={(e) =>
                        handleDispatchStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="assigned">Assigned</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {viewingOrder && (
        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
          <div
            className="order-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-detail-header">
              <div>
                <div className="order-detail-title-row">
                  <h2>{viewingOrder.orderNumber}</h2>
                  <span className={`order-status ${viewingOrder.status}`}>
                    {viewingOrder.status}
                  </span>
                  {!viewingOrder.confirmedAt &&
                    viewingOrder.status !== "cancelled" && (
                      <span className="order-status pending">Unconfirmed</span>
                    )}
                </div>
                <p className="order-detail-subtitle">
                  {new Date(viewingOrder.createdAt).toLocaleDateString(
                    "en-NG",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                  {" · "}
                  {(viewingOrder as any).source === "storefront"
                    ? "Online Storefront"
                    : "POS"}
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setViewingOrder(null)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="order-detail-body">
              <div className="order-detail-main">
                {/* Order Items */}
                <div className="od-card">
                  <div className="od-card-head">
                    <h3>Order Items</h3>
                  </div>
                  {viewingOrder.items.map((item, i) => (
                    <div className="od-item-row" key={i}>
                      <div className="od-item-thumb">
                        {item.productName?.[0] || "?"}
                      </div>
                      <div className="od-item-info">
                        <div className="od-item-name">
                          {item.productName || "Unknown item"}
                        </div>
                        <div className="od-item-qty">
                          {item.quantity} × ₦{item.unitPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="od-item-total">
                        ₦{(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="od-card">
                  <div className="od-card-head">
                    <h3>Order Summary</h3>
                  </div>
                  <div className="od-summary-row">
                    <span>
                      Subtotal ({viewingOrder.items.length} item
                      {viewingOrder.items.length === 1 ? "" : "s"})
                    </span>
                    <span>
                      ₦
                      {viewingOrder.items
                        .reduce((s, i) => s + i.quantity * i.unitPrice, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  {(viewingOrder as any).deliveryFee > 0 && (
                    <div className="od-summary-row">
                      <span>Delivery Fee</span>
                      <span>
                        ₦{(viewingOrder as any).deliveryFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="od-summary-row total">
                    <span>Total</span>
                    <span>₦{viewingOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="od-payment-note">
                    {viewingOrder.paymentMethod === "pay_on_delivery" ? (
                      <span>Payment due on delivery</span>
                    ) : (
                      <span>Paid via {viewingOrder.paymentMethod}</span>
                    )}
                  </div>
                </div>

                {/* Timeline / Notes log */}
                <div className="od-card">
                  <div className="od-card-head">
                    <h3>Timeline</h3>
                  </div>
                  <div className="od-timeline-entry">
                    <div className="od-timeline-dot"></div>
                    <div>
                      <div className="od-timeline-text">
                        Order placed by {viewingOrder.customerName}
                      </div>
                      <div className="od-timeline-date">
                        {new Date(viewingOrder.createdAt).toLocaleString(
                          "en-NG",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  {noteLog.map((note) => (
                    <div className="od-timeline-entry" key={note.id}>
                      <div className="od-timeline-dot note"></div>
                      <div>
                        <div className="od-timeline-text">{note.text}</div>
                        <div className="od-timeline-date">{note.date}</div>
                      </div>
                    </div>
                  ))}
                  <div className="od-comment-box">
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Leave a note about this order..."
                    />
                    <button onClick={addNote} disabled={!orderNote.trim()}>
                      Add Note
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-detail-sidebar">
                <div className="od-card">
                  <div className="od-card-head">
                    <h3>Customer</h3>
                  </div>
                  <div className="od-customer-row">
                    <div className="od-customer-avatar">
                      {viewingOrder.customerName[0]}
                    </div>
                    <div>
                      <div className="od-customer-name">
                        {viewingOrder.customerName}
                      </div>
                      <div className="od-customer-meta">1 order</div>
                    </div>
                  </div>
                </div>

                <div className="od-card">
                  <div className="od-card-head">
                    <h3>Contact Information</h3>
                  </div>
                  {viewingOrder.customerEmail && (
                    <div className="od-detail-line">
                      {viewingOrder.customerEmail}
                    </div>
                  )}
                  <div className="od-detail-line">
                    {viewingOrder.customerPhone || "No phone on record"}
                  </div>
                </div>

                {(viewingOrder as any).deliveryAddress && (
                  <div className="od-card">
                    <div className="od-card-head">
                      <h3>Delivery Address</h3>
                    </div>
                    <div className="od-detail-line">
                      {(viewingOrder as any).deliveryAddress}
                    </div>
                  </div>
                )}

                {orderDispatch[viewingOrder.id] && (
                  <div className="od-card">
                    <div className="od-card-head">
                      <h3>Dispatch</h3>
                    </div>
                    <div className="od-detail-line">
                      Status:{" "}
                      <span className="od-dispatch-status">
                        {orderDispatch[viewingOrder.id].status.replace(
                          "_",
                          " ",
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
