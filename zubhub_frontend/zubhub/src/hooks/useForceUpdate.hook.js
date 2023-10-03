import { useEffect, useState } from 'react'

export function useForceUpdate () {
  const [state, setState] = useState(false)

  useEffect(() => {
    setState(true)
  }, [])
}