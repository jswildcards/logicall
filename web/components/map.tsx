import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Box } from "@chakra-ui/react";

export default function Map({ markers = [], polylines = [] }) {
  return (
    <MapContainer
      center={[22.4, 114.1]}
      zoom={11}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers?.map(({ latitude, longitude, message }) => (
        <Marker position={[latitude, longitude]}>
          <Popup>{message}</Popup>
        </Marker>
      ))}
      {polylines?.map(([polyline, message]) => (
        <Polyline positions={polyline}><Popup>{message.map(m => m ? <Box>{m}</Box> : null)}</Popup></Polyline>
      ))}
    </MapContainer>
  );
}
