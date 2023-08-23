import React from 'react';

export default function Gallery({ type = 'image', images = [] }) {
  const renderImages = images.map((img, index) => {
    return <div style={{ background: '#ccc' }}>Hello</div>;
  });
  const imagesArraySize = images.length;
  let gridTemplate = `
      "a" 100px / 1fr
  `;

  if (imagesArraySize == 2)
    gridTemplate = `
      "a b" 100px / 1.5fr 1fr
  `;

  if (imagesArraySize == 3)
    gridTemplate = `
      "a b" 100px 
      "a c" 50px / 5fr 1fr
  `;

  return <div style={{ gridTemplate, display: 'grid', gap: 10 }}>{renderImages}</div>;
}
