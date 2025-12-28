import QRCode from "qrcode";

export function printQRCode(qr: string) {
  QRCode.toString(qr, { type: 'terminal' }, function (err: any, url: any) {
    if (err) console.error(err);
    console.log(url);
  });
}