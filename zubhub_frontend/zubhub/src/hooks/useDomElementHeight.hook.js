import React, { useEffect, useState } from 'react'

export function useDomElementHeight(elementID) {
    const [height, setHeight] = useState(null)

    useEffect(() => {
        if (document && elementID) {
            let node = document.getElementById(elementID);
            handleHeight(node)
            window.addEventListener('resize', () => handleHeight(node))
        }
    }, [])

    const handleHeight = (node) => {
        let height = node.offsetHeight
        setHeight(height)
    }

    return { height }
}
