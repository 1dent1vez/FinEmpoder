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

// Presupuesto
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

// Ahorro
import AhorroOverview from './pages/modules/ahorro/Overview';
import AhorroL01 from './pages/modules/ahorro/lessons/L01';
import AhorroL02 from './pages/modules/ahorro/lessons/L02';
import AhorroL03 from './pages/modules/ahorro/lessons/L03';
import AhorroL04 from './pages/modules/ahorro/lessons/L04';
import AhorroL05 from './pages/modules/ahorro/lessons/L05';
import AhorroL06 from './pages/modules/ahorro/lessons/L06';
import AhorroL07 from './pages/modules/ahorro/lessons/L07';
import AhorroL08 from './pages/modules/ahorro/lessons/L08';
import AhorroL09 from './pages/modules/ahorro/lessons/L09';
import AhorroL10 from './pages/modules/ahorro/lessons/L10';
import AhorroL11 from './pages/modules/ahorro/lessons/L11';
import AhorroL12 from './pages/modules/ahorro/lessons/L12';
import AhorroL13 from './pages/modules/ahorro/lessons/L13';
import AhorroL14 from './pages/modules/ahorro/lessons/L14';
import AhorroL15 from './pages/modules/ahorro/lessons/L15';

// NUEVOS IMPORTS
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflineBanner from './components/OfflineBanner';

function HomePage() {
  const { user, clearAuth } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Bienvenido, {user?.email}</h1>
      <button onClick={clearAuth}>Cerrar sesion</button>
    </div>
  );
}

// Si hay token -> Home; si no, si no esta onboarded -> Onboarding 1; de lo contrario -> Login
function RootGate() {
  const token = useAuth((s) => s.token);
  if (token) return <HomePage />;
  return isOnboarded() ? <Navigate to="/login" replace /> : <Navigate to="/onboarding/1" replace />;
}

export default function App() {
  const hasHydrated = useAuth.persist.hasHydrated();
  const online = useOnlineStatus();

  if (!hasHydrated) return <p style={{ padding: 24 }}>Cargando sesion...</p>;

  return (
    <>
      {!online && <OfflineBanner dense />}

      <Routes>
        {/* Onboarding publico */}
        <Route path="/onboarding/1" element={<Screen1 />} />
        <Route path="/onboarding/2" element={<Screen2 />} />
        <Route path="/onboarding/3" element={<Screen3 />} />

        {/* Auth publico */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Legales publico */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Raiz */}
        <Route path="/" element={<RootGate />} />

        {/* ZONA PRIVADA */}
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<Home />} />
          <Route path="/search" element={<p style={{ padding: 24 }}>Buscar (proximo)</p>} />
          <Route path="/achievements" element={<p style={{ padding: 24 }}>Logros (proximo)</p>} />
          <Route path="/profile" element={<p style={{ padding: 24 }}>Perfil (proximo)</p>} />

          {/* Modulo Presupuesto */}
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

          {/* Modulo Ahorro */}
          <Route path="/app/ahorro" element={<AhorroOverview />} />
          <Route path="/app/ahorro/lesson/L01" element={<AhorroL01 />} />
          <Route path="/app/ahorro/lesson/L02" element={<AhorroL02 />} />
          <Route path="/app/ahorro/lesson/L03" element={<AhorroL03 />} />
          <Route path="/app/ahorro/lesson/L04" element={<AhorroL04 />} />
          <Route path="/app/ahorro/lesson/L05" element={<AhorroL05 />} />
          <Route path="/app/ahorro/lesson/L06" element={<AhorroL06 />} />
          <Route path="/app/ahorro/lesson/L07" element={<AhorroL07 />} />
          <Route path="/app/ahorro/lesson/L08" element={<AhorroL08 />} />
          <Route path="/app/ahorro/lesson/L09" element={<AhorroL09 />} />
          <Route path="/app/ahorro/lesson/L10" element={<AhorroL10 />} />
          <Route path="/app/ahorro/lesson/L11" element={<AhorroL11 />} />
          <Route path="/app/ahorro/lesson/L12" element={<AhorroL12 />} />
          <Route path="/app/ahorro/lesson/L13" element={<AhorroL13 />} />
          <Route path="/app/ahorro/lesson/L14" element={<AhorroL14 />} />
          <Route path="/app/ahorro/lesson/L15" element={<AhorroL15 />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
