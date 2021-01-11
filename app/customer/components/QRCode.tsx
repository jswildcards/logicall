import React from "react";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeComponent({ data }) {
  return <QRCode value={JSON.stringify(data)} />;
}
