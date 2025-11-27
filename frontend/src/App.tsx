import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/Login';
import SignUpPage from './pages/auth/SignUp';

import Screen1 from './pages/onboarding/Screen1';
import Screen2 from './pages/onboarding/Screen2';
import Screen3 from './pages/onboarding/Screen3';

import { PrivateRoute } from './routes/PrivateRoute';
import { useAuth } from './store/auth';
import { isOnboarded } from './utils/onboarding';

import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';

import Home from './pages/home/Home';

import PresupuestoOverview from './pages/modules/presupuesto/Overview';
import L01 from './pages/modules/presupuesto/lessons/L01';
import L02 from './pages/modules/presupuesto/lessons/L02';
import L03 from './pages/modules/presupuesto/lessons/L03';
import L04 from './pages/modules/presupuesto/lessons/L04';
import L05 from './pages/modules/presupuesto/lessons/L05';
import L06 from './pages/modules/presupuesto/lessons/L06';
import L07 from './pages/modules/presupuesto/lessons/L07';
import L08 from './pages/modules/presupuesto/lessons/L08';
import L09 from './pages/modules/presupuesto/lessons/L09';
import L10 from './pages/modules/presupuesto/lessons/L10';
import L11 from './pages/modules/presupuesto/lessons/L11';
import L12 from './pages/modules/presupuesto/lessons/L12';
import L13 from './pages/modules/presupuesto/lessons/L13';
import L14 from './pages/modules/presupuesto/lessons/L14';
import L15 from './pages/modules/presupuesto/lessons/L15';

// NUEVOS IMPORTS
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflineBanner from './components/OfflineBanner';

// Home

function HomePage() {
  const { user, clearAuth } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Bienvenido, {user?.email}</h1>
      <button onClick={clearAuth}>Cerrar sesión</button>
    </div>
  );
}

// Si hay token → Home; si no, si no está onboarded → Onboarding 1; de lo contrario → Login
function RootGate() {
  const token = useAuth((s) => s.token);
  if (token) return <HomePage />;
  return isOnboarded() ? <Navigate to="/login" replace /> : <Navigate to="/onboarding/1" replace />;
}

export default function App() {
  const hasHydrated = useAuth.persist.hasHydrated();
  const online = useOnlineStatus(); // AQUÍ DETECTAS LA CONEXIÓN

  if (!hasHydrated) return <p style={{ padding: 24 }}>Cargando sesión...</p>;

  return (
    <>
      {!online && <OfflineBanner dense />}

      <Routes>
        {/* Onboarding público (forzado a nuevos usuarios) */}
        <Route path="/onboarding/1" element={<Screen1 />} />
        <Route path="/onboarding/2" element={<Screen2 />} />
        <Route path="/onboarding/3" element={<Screen3 />} />

        {/* Auth público */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Legales público */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Raíz */}
        <Route path="/" element={<RootGate />} />

        {/* ZONA PRIVADA */}
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<Home />} />
          <Route path="/search" element={<p style={{ padding: 24 }}>Buscar (próximo)</p>} />
          <Route path="/achievements" element={<p style={{ padding: 24 }}>Logros (próximo)</p>} />
          <Route path="/profile" element={<p style={{ padding: 24 }}>Perfil (próximo)</p>} />

          {/* Módulo Presupuestación */}
          <Route path="/app/presupuesto" element={<PresupuestoOverview />} />
          <Route path="/app/presupuesto/lesson/L01" element={<L01 />} />
          <Route path="/app/presupuesto/lesson/L02" element={<L02 />} />
          <Route path="/app/presupuesto/lesson/L03" element={<L03 />} />
          <Route path="/app/presupuesto/lesson/L04" element={<L04 />} />
          <Route path="/app/presupuesto/lesson/L05" element={<L05 />} />
          <Route path="/app/presupuesto/lesson/L06" element={<L06 />} />
          <Route path="/app/presupuesto/lesson/L07" element={<L07 />} />
          <Route path="/app/presupuesto/lesson/L08" element={<L08 />} />
          <Route path="/app/presupuesto/lesson/L09" element={<L09 />} />
          <Route path="/app/presupuesto/lesson/L10" element={<L10 />} />
          <Route path="/app/presupuesto/lesson/L11" element={<L11 />} />
          <Route path="/app/presupuesto/lesson/L12" element={<L12 />} />
          <Route path="/app/presupuesto/lesson/L13" element={<L13 />} />
          <Route path="/app/presupuesto/lesson/L14" element={<L14 />} />
          <Route path="/app/presupuesto/lesson/L15" element={<L15 />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
