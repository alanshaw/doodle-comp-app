import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { KeyringProvider, useKeyring } from '@w3ui/react-keyring'
import { UploaderProvider } from '@w3ui/react-uploader'
import { UploadsListProvider } from '@w3ui/react-uploads-list'
import './tachyons.min.css'
import HomePage from './HomePage.js'
import DrawPage from './DrawPage.js'
import DoodlesPage from './DoodlesPage.js'
import AuthorizePage from './AuthorizePage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/draw',
    element: <DrawPage />
  },
  {
    path: '/doodles',
    element: <DoodlesPage />
  },
  {
    path: '/authorize',
    element: <AuthorizePage />
  }
])

export default function App () {
  return (
    <div className='sans-serif'>
      <KeyringProvider>
        <AgentLoader>
          <UploaderProvider>
            <UploadsListProvider>
              <RouterProvider router={router} />
            </UploadsListProvider>
          </UploaderProvider>
        </AgentLoader>
      </KeyringProvider>
    </div>
  )
}

function AgentLoader ({ children }) {
  const [, { loadAgent }] = useKeyring()
  // eslint-disable-next-line
  useEffect(() => { loadAgent() }, []) // load agent - once.
  return children
}
