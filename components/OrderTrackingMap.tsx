"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { io, Socket } from "socket.io-client";

const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function OrderTrackingMap({
  orderId,
  initialLat,
  initialLng,
}: {
  orderId: number;
  initialLat: number | null;
  initialLng: number | null;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null,
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""));
    socketRef.current = socket;

    socket.emit("join_order_tracking", orderId);
    socket.on("rider_location", (data: { lat: number; lng: number }) => {
      setPosition([data.lat, data.lng]);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  if (!position) {
    return (
      <div className="tracking-map-empty">
        Waiting for the rider to start sharing their location...
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: 320, width: "100%", borderRadius: 12 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position} icon={riderIcon}>
        <Popup>Your rider is here</Popup>
      </Marker>
    </MapContainer>
  );
}
