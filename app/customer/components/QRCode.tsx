import React from "react";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeComponent({ data, size = 100 }) {
  return <QRCode size={size} value={JSON.stringify(data)} />;
}
