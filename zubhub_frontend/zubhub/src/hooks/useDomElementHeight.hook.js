import React, { useEffect, useState } from 'react'

export function useDomElementHeight(elementID) {
    const [height, setHeight] = useState(null)

    useEffect(() => {
        if (document && elementID) {
            let nav = document.getElementById(elementID);
            let height = nav.offsetHeight
            setHeight(height)
        }
    }, [])

    return { height }
}
