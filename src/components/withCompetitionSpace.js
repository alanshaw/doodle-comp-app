import React, { useEffect, useState } from 'react'
import { useKeyring } from '@w3ui/react-keyring'
import { stringToDelegation } from '@web3-storage/access/encoding'

const competitionServerURL = process.env.REACT_APP_COMPETITION_SERVER_URL ?? 'http://localhost:3003'

export function withCompetitionSpace (Component) {
  return props => {
    const [{ agent, spaces }, { addSpace }] = useKeyring()
    const [competitionSpaceDID, setCompetitionSpaceDID] = useState(localStorage.getItem('competitionSpaceDID'))
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (!agent) return
      const fetchDelegation = async () => {
        try {
          if (!competitionSpaceDID && !loading) {
            setLoading(true)
            const res = await fetch(competitionServerURL, {
              method: 'POST',
              body: JSON.stringify({ audience: agent.did() })
            })
            if (!res.ok) throw new Error(`failed to get delegation: ${res.status}`)
            const proof = stringToDelegation(await res.text())
            const did = proof.capabilities[0].with
            localStorage.setItem('competitionSpaceDID', did)
            setCompetitionSpaceDID(did)
            if (!spaces.some(s => s.did() === did)) {
              await addSpace(proof)
            }
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchDelegation()
    }, [competitionSpaceDID, loading, spaces, agent, addSpace])

    return competitionSpaceDID ? <Component {...props} competitionSpaceDID={competitionSpaceDID} /> : null
  }
}
