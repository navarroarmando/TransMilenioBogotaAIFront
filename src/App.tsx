import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './auth/components/ProtectedRoute';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import DataManagement from './pages/DataManagement/DataManagement';
import OptimizationEngine from './pages/OptimizationEngine/OptimizationEngine';
import RetrainEngine from './pages/RetrainEngine/RetrainEngine';
import Results from './pages/Results/Results';
import History from './pages/History/History';
import Reports from './pages/Reports/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="data-management" element={<DataManagement />} />
        <Route path="optimization" element={<OptimizationEngine />} />
        <Route path="retrain" element={<RetrainEngine />} />
        <Route path="results" element={<Results />} />
        <Route path="history" element={<History />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
