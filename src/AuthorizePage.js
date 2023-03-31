import React, { useState } from 'react'
import { useKeyring } from '@w3ui/react-keyring'
import { useNavigate } from 'react-router-dom'
import Nav, { NavSpacer } from './components/Nav.js'
import DIDIcon from './components/DIDIcon.js'
import { withCompetitionSpace } from './components/withCompetitionSpace'

export function AuthorizePage ({ competitionSpaceDID }) {
  const [{ account, spaces }, { authorize, createSpace, registerSpace }] = useKeyring()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const appSpaces = spaces.filter(s => s.did() !== competitionSpaceDID)

  if (account) {
    if (appSpaces.length === 1) {
      localStorage.setItem('appSpaceDID', appSpaces[0].did())
      navigate('/draw')
      return null
    }

    const handleRegisterSpaceSubmit = async e => {
      e.preventDefault()
      const did = await createSpace()
      await registerSpace(account)
      localStorage.setItem('appSpaceDID', did)
      navigate('/draw')
    }

    const handleSpaceSelectSubmit = async e => {
      e.preventDefault()
      localStorage.setItem('appSpaceDID', e.target.dataset.did)
      navigate('/draw')
    }

    return (
      <>
        <Nav />
        <NavSpacer />
        <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-light-yellow min-vh-100'>
          {appSpaces.length ? (
            <>
              <p className='f4 lh-copy measure'>
                Select the space you'd like to use with this website:
              </p>
              {appSpaces.map(s => (
                <form data-did={s.did()} onSubmit={handleSpaceSelectSubmit} key={s.did()}>
                  <button type='submit' className='db w-100 bw0 flex items-center pointer bg-white-80 mb3 pa2 fw3 br2 grow'>
                    <div className='mr2' style={{ width: 50 }}>
                      <DIDIcon did={s.did()} />
                    </div>
                    <label className='f5 sans-serif'>{s.did()}</label>
                  </button>
                </form>
              ))}
            </>
          ) : (
            <>
              <p className='f4 lh-copy measure'>
                You have no spaces, would you like to create a new one?
              </p>
              <form onSubmit={handleRegisterSpaceSubmit} className='measure'>
                <button type='submit' className='bw0 link dim br1 ph3 pv2 dib white bg-hot-pink pointer'>Create</button>
              </form>
            </>
          )}
        </div>
      </>
    )
  }

  if (submitted) {
    return (
      <>
        <Nav />
        <NavSpacer />
        <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-light-yellow min-vh-100'>
          <p className='f4 lh-copy measure'>
            Click the link in the email we sent to <span className='b'>{email}</span> to authorize this agent.
          </p>
        </div>
      </>
    )
  }

  const handleAuthorizeSubmit = async e => {
    e.preventDefault()
    setSubmitted(true)
    try {
      // @ts-ignore
      await authorize(email)
    } catch (err) {
      throw new Error('failed to authorize', { cause: err })
    } finally {
      setSubmitted(false)
    }
  }

  return (
    <>
      <Nav />
      <NavSpacer />
      <div className='ph3 pv3 pv4-ns ph4-m ph5-l bg-light-yellow min-vh-100'>
        <p className='f4 lh-copy measure'>
          Authorize this website to use the w3up account registered to your
          email address. We will obtain
          &nbsp;<code className='bg-white-50'>store/add</code>,
          &nbsp;<code className='bg-white-50'>upload/add</code> and 
          &nbsp;<code className='bg-white-50'>upload/list</code> capabilities
          from the account.
        </p>
        <form onSubmit={handleAuthorizeSubmit} className='measure'>
          <div className='mb3'>
            <label htmlFor='email' className='f4 lh-copy db mb2'>Email address:</label>
            <input id='email' className='db pa2 w-100' type='email' value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type='submit' className='bw0 link dim br1 ph3 pv2 dib white bg-hot-pink pointer' disabled={submitted}>Authorize</button>
        </form>
      </div>
    </>
  )
}

export default withCompetitionSpace(AuthorizePage)
