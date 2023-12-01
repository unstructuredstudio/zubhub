import React, { useEffect, useState } from 'react';

export function useDomElementHeight(elementID) {
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (document && elementID) {
      let node = document.getElementById(elementID);
      handleHeight(node);
      window.addEventListener('resize', () => handleHeight(node));
    }
  }, []);

  const handleHeight = node => {
    let height = node.offsetHeight;
    setHeight(height);
  };

  return { height };
}

const useProjectCardGrid = () => {
  const [columns, setColumns] = useState(0);
  useEffect(() => {
    // Calculate the number of columns based on the current window width
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const columns = calculateColumns(windowWidth);
    setColumns(columns);
  }, []);

  const calculateColumns = width => {
    // Customize the column widths and corresponding number of columns as per your requirement
    if (width < 480) {
      return 1; // 1 column for width less than 480px
    } else if (width < 768) {
      return 2; // 2 columns for width between 480px and 768px
    } else if (width < 1024) {
      return 3; // 3 columns for width between 768px and 1024px
    } else {
      return 4; // 4 columns for width greater than or equal to 1024px
    }
  };

  return columns;
};
