import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploader } from '@w3ui/react-uploader'
import { useKeyring } from '@w3ui/react-keyring'
import './tachyons.min.css'
import { toBlob, useCanvas, wipe } from './components/useCanvas.js'
import Nav, { NavSpacer } from './components/Nav'

export default function DrawPage () {
  const canvasRef = useCanvas()
  const navigate = useNavigate()
  const [{ account, space }, { setCurrentSpace }] = useKeyring()
  const [, { uploadFile }] = useUploader()
  const [saving, setSaving] = useState(false)
  const appSpaceDID = localStorage.getItem('appSpaceDID')

  useEffect(() => {
    if (!account || !appSpaceDID) {
      navigate('/authorize')
    }
  }, [account, appSpaceDID, navigate])

  if (appSpaceDID && space?.did() !== appSpaceDID) {
    // @ts-ignore
    setCurrentSpace(appSpaceDID)
  }

  const handleClearClick = e => {
    e.preventDefault()
    if (!canvasRef.current) return
    wipe(canvasRef.current)
  }
  const handleSaveClick = async e => {
    e.preventDefault()
    if (!canvasRef.current) return
    setSaving(true)
    try {
      const blob = await toBlob(canvasRef.current)
      // Upload to w3up
      const cid = await uploadFile(blob)
      // Record in localStorage
      const doodles = /** @type {string[]} */ (JSON.parse(localStorage.getItem('doodles') ?? '[]'))
      doodles.unshift(cid.toString())
      localStorage.setItem('doodles', JSON.stringify(doodles))
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Redirect to view doodles
      navigate('/doodles')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Nav>
        <a className='link dim br1 ph3 pv2 mb2 dib white bg-dark-gray mr3' href='#0' onClick={handleClearClick}>Clear</a>
        <a className='link dim br1 ph3 pv2 dib white bg-hot-pink' href='#0' onClick={handleSaveClick}>{saving ? 'Saving...' : 'Save'}</a>
      </Nav>
      <div className='flex flex-column vh-100'>
        <div className='flex-none'>
          <NavSpacer />
        </div>
        <div className='flex-auto'>
          <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-pink h-100'>
            <canvas ref={canvasRef} className='pointer shadow-3 w-100 h-100' />
          </div>
        </div>
      </div>
    </>
  )
}
