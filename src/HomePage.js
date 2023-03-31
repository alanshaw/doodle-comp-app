import React from 'react'
import { useKeyring } from '@w3ui/react-keyring'
import { useUploadsList } from '@w3ui/react-uploads-list'
import Nav, { NavSpacer } from './components/Nav'
import { withCompetitionSpace } from './components/withCompetitionSpace'

export function HomePage ({ competitionSpaceDID }) {
  const [{ space }, { setCurrentSpace }] = useKeyring()
  const [{ data }] = useUploadsList()

  if (space?.did() !== competitionSpaceDID) {
    setCurrentSpace(competitionSpaceDID)
    return null
  }

  return (
    <>
      <Nav />
      <NavSpacer />
      <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-light-green min-vh-100'>
        <p className='f4 lh-copy measure'>
          Competition entries, in no particular order. To submit an entry to
          the competition, draw a doodle then select it on the "My Doodles"
          page, then hit "Enter Competition" in the top right.
        </p>
        {(data ?? []).map(({ root }) => (
          <div className='fl w-50 w-25-m w-20-l pa2' key={root.toString()}>
            <a href={`https://${root}.ipfs.w3s.link`} className='db link dim tc' title={root.toString()}>
              <div className='aspect-ratio aspect-ratio--16x9'>
                <img src={`https://${root}.ipfs.w3s.link`} alt={root.toString()} className='w-100 db outline black-10 aspect-ratio--object' />
              </div>
              <dl className='mt2 f6 lh-copy'>
                <dt className='clip'>CID</dt>
                <dd className='ml0 black truncate w-100'>{root.toString()}</dd>
              </dl>
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

export default withCompetitionSpace(HomePage)
