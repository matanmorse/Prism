import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './pages/Library.jsx'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Settings from './pages/Settings.jsx'
import { EmulatorProvider } from './contexts/SharedContext.jsx'
import { ModalProvider, useModal } from './contexts/ModalContext.jsx'
import ErrorModal from './modals/ErrorModal.jsx'
import Debug from './pages/Debug.jsx'
import { Library } from 'lucide-react'
import { LibraryProvider } from './contexts/LibraryContext.jsx'
import { BigPictureProvider } from './contexts/BigPictureContext.jsx'
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

const Router = import.meta.env.DEV ? BrowserRouter : HashRouter

init({
  debug: false,
  visualDebug: false,
});

createRoot(document.getElementById('main')).render(
<StrictMode>
  <Router>
  <BigPictureProvider>
    <EmulatorProvider>
      <LibraryProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
            </Route>
          </Routes>
        </ModalProvider>
      </LibraryProvider>
    </EmulatorProvider>,
  </BigPictureProvider>
  </Router>
</StrictMode>


)
