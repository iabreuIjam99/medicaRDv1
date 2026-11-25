/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MedicaProvider, useMedica } from './context/MedicaContext';
import { LandingView } from './components/LandingView';
import { AuthView } from './components/AuthView';
import { DashboardLayout } from './components/DashboardLayout';
import { PrototypeGuideView } from './components/PrototypeGuideView';
import { ToastContainer } from './components/ui/Primitives';

function MedicaAppShell() {
  const { view, toasts, dismissToast } = useMedica();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {view === 'landing' && <LandingView />}
          {view === 'auth' && <AuthView />}
          {view === 'dashboard' && <DashboardLayout />}
          {view === 'guide' && <PrototypeGuideView />}
        </motion.div>
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  return (
    <MedicaProvider>
      <MedicaAppShell />
    </MedicaProvider>
  );
}
