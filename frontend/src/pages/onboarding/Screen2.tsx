import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { setOnboarded } from '../../utils/onboarding';

export default function Screen2() {
  const nav = useNavigate();
  return (
    <OnboardingLayout
      img="/src/assets/onb2.png"
      title="Ahorra con propósito"
      body="Aprende a establecer metas financieras alcanzables y crea el hábito del ahorro sin sacrificar tu bienestar."
      step={2}
      primaryLabel="Siguiente"
      onPrimary={() => nav('/onboarding/3')}
      onSkip={() => { setOnboarded(); nav('/login'); }}
    />
  );
}
