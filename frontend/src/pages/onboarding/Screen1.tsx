import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { setOnboarded } from '../../utils/onboarding';

export default function Screen1() {
  const nav = useNavigate();
  return (
    <OnboardingLayout
      img="/src/assets/onb1.png"
      title="Aprende a tomar el control de tu dinero"
      body="Descubre cómo organizar tus ingresos y gastos con herramientas simples que te ayudarán a tomar decisiones financieras informadas."
      step={1}
      primaryLabel="Siguiente"
      onPrimary={() => nav('/onboarding/2')}
      onSkip={() => { setOnboarded(); nav('/login'); }}
    />
  );
}
