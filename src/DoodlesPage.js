import React, { useState } from 'react'
import { useKeyring } from '@w3ui/react-keyring'
import { useUploadsList } from '@w3ui/react-uploads-list'
import { Upload } from '@web3-storage/upload-client'
import { useNavigate } from 'react-router-dom'
import { CID } from 'multiformats'
import Nav, { NavSpacer } from './components/Nav'
import { withCompetitionSpace } from './components/withCompetitionSpace'

export function DoodlesPage ({ competitionSpaceDID }) {
  const [{ agent }, { getProofs }] = useKeyring()
  const [, { reload }] = useUploadsList()
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const doodles = /** @type {string[]} */ (JSON.parse(localStorage.getItem('doodles') ?? '[]'))

  const handleEnterClick = async e => {
    e.preventDefault()
    if (!agent) return
    try {
      setLoading(true)
      const cid = CID.parse(selected)
      const proofs = await getProofs([{ can: 'upload/add', with: competitionSpaceDID }])
      await Upload.add({ issuer: agent, proofs, with: competitionSpaceDID }, cid, [])
      // reload the uploads list
      await reload()
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav>
        {selected && <a className='link dim br1 ph3 pv2 dib white bg-hot-pink' href='#0' onClick={handleEnterClick}>{loading ? 'Submitting entry...' : 'Enter Competition'}</a>}
      </Nav>
      <NavSpacer />
      <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-light-blue min-vh-100' onClick={e => setSelected('')}>
        {doodles.length ? (
          <>
            <p className='f4 lh-copy measure'>
              Doodles that you have drawn. If you'd like to enter one in the
              competition, click on it, and then hit the 'Submit' button in the
              navigation bar.
            </p>
            {doodles.map(cid => (
              <div className={`fl w-50 w-25-m w-20-l ${selected === cid ? 'ba bw3 b--hot-pink' : 'pa2'}`} key={cid}>
                <a href='#0' className='db link tc' title={cid} onClick={e => { e.preventDefault(); e.stopPropagation(); setSelected(cid) }}>
                  <div className='aspect-ratio aspect-ratio--16x9'>
                    <img src={`https://${cid}.ipfs.w3s.link`} alt={cid} className='w-100 db outline black-10 aspect-ratio--object' />
                  </div>
                  <dl className='mt2 f6 lh-copy'>
                    <dt className='clip'>CID</dt>
                    <dd className='ml0 black truncate w-100'>{cid}</dd>
                  </dl>
                </a>
              </div>
            ))}
          </>
        ) : (
          <p className='f4 lh-copy measure'>
            You have no doodles, go draw one!
          </p>
        )}
      </div>
    </>
  )
}

export default withCompetitionSpace(DoodlesPage)
