import { Activity, Dumbbell, CalendarRange, Timer, History, Scale, Swords } from 'lucide-react';

export const APP = {
  key: 'fitpulse',
  name: 'FitPulse',
  short: 'Workout tracker',
  logo: '💪',
  accent: 'rose',
  tagline: 'Train smarter. Track everything.',
  description: 'Log every rep with a live workout session, follow structured programs, beat your personal records and watch your body metrics trend the right way.',
  heroPoints: ['Live sessions with rest timers & auto PR detection', '48-exercise library with an interactive muscle map', 'Programs, streaks, challenges and body metrics'],
  heroCards: [
    { icon: '🏋️', title: 'New PR: Bench 80 kg', sub: '+2.5 kg vs last week' },
    { icon: '🔥', title: '9-day streak', sub: '612 kcal today' },
  ],
  searchPlaceholder: 'Search exercises…',
  demo: { name: 'Bharath Kumar', email: 'demo@fitpulse.app', password: 'Demo@1234' },
  nav: [
    { to: '/', label: 'Today', icon: Activity },
    { to: '/session', label: 'Start workout', icon: Timer },
    { to: '/exercises', label: 'Exercise library', icon: Dumbbell },
    { to: '/programs', label: 'Programs', icon: CalendarRange },
    { to: '/history', label: 'History & PRs', icon: History },
    { to: '/body', label: 'Body & nutrition', icon: Scale },
    { to: '/challenges', label: 'Challenges', icon: Swords },
  ],
};
