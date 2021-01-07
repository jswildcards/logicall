import React from 'react';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeComponent() {
  return (
    <QRCode
      value="http://awesome.link.qr"
    />
  );
}
