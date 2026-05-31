import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import ComingSoonModal from './components/ComingSoonModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');

  // Global trigger for Coming Soon modules
  const handleTriggerComingSoon = (moduleName) => {
    setSelectedModule(moduleName);
    setIsModalOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          {/* Glass Header */}
          <Navbar onTriggerComingSoon={handleTriggerComingSoon} />
          
          {/* Main Workspace */}
          <main className="flex-grow">
            <AppRoutes onTriggerComingSoon={handleTriggerComingSoon} />
          </main>
          
          {/* Footer */}
          <Footer onTriggerComingSoon={handleTriggerComingSoon} />

          {/* Reusable Coming Soon Modal */}
          <ComingSoonModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            moduleName={selectedModule} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
