import React from 'react'
import md5 from 'blueimp-md5'

export default function DIDIcon ({ did }) {
  const src = `https://www.gravatar.com/avatar/${md5(did)}?d=identicon`
  return <img title={did} alt={did} src={src} className='w-100 br2' />
}