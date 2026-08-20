"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "../../rider.css";

export default function RiderTrackPage() {
  const params = useParams();
  const token = params.token as string;
  const [dispatch, setDispatch] = useState<any>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState("");
  const watchIdRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider-track/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setError(data.message);
        else setDispatch(data);
      });

    const socket = io(process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""));
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setError("Location services not available on this device.");
      return;
    }

    setIsSharing(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rider-track/${token}/location`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          },
        );
      },
      () => setError("Location permission denied."),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    setIsSharing(false);
  };

  if (error && !dispatch) {
    return (
      <div className="rider-page">
        <div className="rider-error">{error}</div>
      </div>
    );
  }

  if (!dispatch) {
    return (
      <div className="rider-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="rider-page">
      <div className="rider-card">
        <h1>Delivery for {dispatch.orderNumber}</h1>

        <div className="rider-detail">
          <span className="label">Pick up from</span>
          <span className="value">
            {dispatch.pickupBusinessName} {dispatch.pickupAddress}
          </span>
        </div>
        <div className="rider-detail">
          <span className="label">Deliver to</span>
          <span className="value">
            {dispatch.customerName} {dispatch.deliveryAddress}
          </span>
        </div>

        {!isSharing ? (
          <button className="rider-btn" onClick={startSharing}>
            Start Sharing My Location
          </button>
        ) : (
          <>
            <div className="rider-sharing-indicator">
              <span className="dot"></span> Sharing your live location
            </div>
            <button className="rider-btn secondary" onClick={stopSharing}>
              Stop Sharing
            </button>
          </>
        )}

        {error && <div className="rider-error">{error}</div>}
      </div>
    </div>
  );
}
