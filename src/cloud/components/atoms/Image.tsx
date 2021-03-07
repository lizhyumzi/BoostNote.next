import React, { CSSProperties } from 'react'

interface ImageProps {
  src: string
  className?: string
  style?: CSSProperties
  alt?: string
}

const Image = ({ src, className, style, alt }: ImageProps) => {
  return <img src={src} className={className} style={style} alt={alt} />
}

export default Image
