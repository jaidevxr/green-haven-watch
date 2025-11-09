import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ReactNode } from "react";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapBaseProps {
  center: [number, number];
  zoom: number;
  children?: ReactNode;
  className?: string;
}

export const MapBase = ({ center, zoom, children, className = "" }: MapBaseProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        // @ts-ignore - react-leaflet v4 type definitions
        center={center}
        // @ts-ignore
        zoom={zoom}
        // @ts-ignore
        scrollWheelZoom={true}
        // @ts-ignore
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          // @ts-ignore - react-leaflet v4 type definitions
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // @ts-ignore
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
      </MapContainer>
    </div>
  );
};
