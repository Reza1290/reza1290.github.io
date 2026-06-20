import { useRef } from 'react'
import './GlitchText.css'

export default function GlitchText({ children, tag: Tag = 'span', className = '', style = {} }) {
  return (
    <Tag
      className={`glitch-text ${className}`}
      data-text={typeof children === 'string' ? children : ''}
      style={style}
    >
      {children}
    </Tag>
  )
}
