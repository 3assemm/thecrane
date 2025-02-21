import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { CraneCalculator } from './components/Calculator/Calculator';
import { Profile } from './components/Profile';
import { Results } from './pages/Results';
import { CraneSelection } from './pages/CraneSelection';
import { LoadChartComparison } from './pages/LoadChartComparison';
import { Report } from './pages/Report';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { HtmlReportPage } from './pages/HtmlReportPage';
import { Help } from './pages/Help';
import { HelpArabic } from './pages/HelpArabic';
import { QrScannerPage } from './pages/QrScannerPage';
import { CranesTableList } from './pages/CranesTableList';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { UserManagement } from './pages/UserManagement';
import { EditCalculation } from './pages/EditCalculation';
import { AuthProvider } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { StyleGuide } from './pages/StyleGuide';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, [i18n]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-500">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500">
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <main className="container mx-auto px-4 py-8">
                    <CraneCalculator />
                  </main>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/results" element={<Results />} />
              <Route path="/crane-selection" element={<CraneSelection />} />
              <Route
                path="/load-chart-comparison"
                element={<LoadChartComparison />}
              />
              <Route path="/report" element={<Report />} />
              <Route path="/html-report" element={<HtmlReportPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/calculations/:id/edit"
                element={<EditCalculation />}
              />
              <Route
                path="/help"
                element={i18n.language === 'ar' ? <HelpArabic /> : <Help />}
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/qr-scanner" element={<QrScannerPage />} />
              <Route path="/cranes-table-list" element={<CranesTableList />} />
              <Route path="/style-guide" element={<StyleGuide />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
