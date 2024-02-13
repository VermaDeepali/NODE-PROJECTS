const qrCode = require('qrcode');
const fs = require('fs'); // To save the QR code as an image file

// Data to be encoded in the QR code
// const data = 'Hello, World!';
const data = "https://takeuforward.org/system-design/complete-system-design-roadmap-with-videos-for-sdes/"

// Generate QR code as a data URL
qrCode.toDataURL(data, (err, url) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('QR Code Data URL:', url);

  // Save the QR code as an image file
  saveQRCodeAsImage(url, 'qrcode1.png');
});

// Function to save the QR code as an image file
function saveQRCodeAsImage(dataURL, filename) {
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

  fs.writeFile(filename, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving QR code as image:', err);
    } else {
      console.log('QR code saved as', filename);
    }
  });
}
