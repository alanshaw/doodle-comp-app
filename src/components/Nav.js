import React from 'react'
import { Link } from 'react-router-dom'

/**
 * @param {object} props
 * @param {React.ReactNode} [props.children]
 */
export default function Nav ({ children }) {
  return (
    <header className='bg-black-90 fixed w-100 ph3 pv3 pv4-ns ph4-m ph5-l'>
      <nav className='f6 fw6 ttu tracked relative'>
        <div className='absolute right-0' style={{ marginTop: -6 }}>
          {children}
        </div>
        <Link className='link dim hot-pink dib mr3' to='/' title='Home'>Doodle Competition</Link>
        <Link className='link dim white dib mr3' to='/draw' title='Create a doodle'>✏️ Draw</Link>
        <Link className='link dim white dib mr3' to='/doodles' title='View my doodles'>🖼 My Doodles</Link>
      </nav>
    </header>
  )
}

export function NavSpacer () {
  return (
    <div className='w-100 ph3 pv3 pv4-ns ph4-m ph5-l'>
      <div className='f6 fw6 ttu tracked'>&nbsp;</div>
    </div>
  )
}
