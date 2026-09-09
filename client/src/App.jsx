import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuestPortal from './pages/GuestPortal';
import PMSAdmin from './pages/PMSAdmin';
import BookingLookupModal from './components/guest/BookingLookupModal';
import BenchmarkPanel from './components/BenchmarkPanel';

export default function App() {
  const [activePortal, setActivePortal] = useState('guest'); // 'guest' | 'pms'
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Top Universal Navbar */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activePortal === 'guest' ? (
          <GuestPortal />
        ) : (
          <PMSAdmin />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPMS={() => setActivePortal('pms')} />

      {/* Modals */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      <BenchmarkPanel
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

    </div>
  );
}
