import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { setOnboarded } from '../../utils/onboarding';

export default function Screen3() {
  const nav = useNavigate();
  return (
    <OnboardingLayout
      img="/src/assets/onb3.png"
      title="Invierte en tu futuro"
      body="Conoce los fundamentos de la inversión y desarrolla habilidades para hacer crecer tu dinero de forma responsable."
      step={3}
      primaryLabel="Iniciar"
      onPrimary={() => { setOnboarded(); nav('/login'); }}
    />
  );
}
