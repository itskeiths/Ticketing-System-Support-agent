import React from 'react'
import {ReactNode} from 'react'

interface Props{
    children: ReactNode | ReactNode[];
}

const BaseLayout = ({children}:Props) => {
  return (
    <div>{children}</div>
  )
}

export default BaseLayout