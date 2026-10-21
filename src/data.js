export const MUSCLES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Cardio'];

const X = (name, muscle, equip, level, type, kcal, tips) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, muscle, equip, level, type, kcal, tips });
export const EXERCISES = [
  X('Bench Press', 'Chest', 'Barbell', 'Intermediate', 'weight', 7, ['Retract shoulder blades', 'Bar to mid-chest', 'Drive feet into floor']),
  X('Incline Dumbbell Press', 'Chest', 'Dumbbell', 'Intermediate', 'weight', 6, ['Bench at 30°', 'Elbows ~45° from torso', 'Control the descent']),
  X('Push-ups', 'Chest', 'Bodyweight', 'Beginner', 'reps', 6, ['Body in a straight line', 'Chest to fist height', 'Full lockout']),
  X('Cable Fly', 'Chest', 'Cable', 'Intermediate', 'weight', 5, ['Soft elbows', 'Squeeze at the middle', 'Slow eccentric']),
  X('Chest Dips', 'Chest', 'Bodyweight', 'Advanced', 'reps', 7, ['Lean forward', 'Shoulders down', 'Elbows flare slightly']),
  X('Deadlift', 'Back', 'Barbell', 'Advanced', 'weight', 9, ['Bar over mid-foot', 'Neutral spine', 'Push the floor away']),
  X('Pull-ups', 'Back', 'Bodyweight', 'Intermediate', 'reps', 8, ['Full hang start', 'Chest to bar', 'No kipping']),
  X('Barbell Row', 'Back', 'Barbell', 'Intermediate', 'weight', 7, ['Hinge to 45°', 'Pull to lower ribs', 'Pause at the top']),
  X('Lat Pulldown', 'Back', 'Machine', 'Beginner', 'weight', 6, ['Lean back slightly', 'Elbows to pockets', 'Control on the way up']),
  X('Seated Cable Row', 'Back', 'Cable', 'Beginner', 'weight', 6, ['Tall chest', 'Squeeze shoulder blades', 'No torso swing']),
  X('Overhead Press', 'Shoulders', 'Barbell', 'Intermediate', 'weight', 7, ['Glutes tight', 'Head through at the top', 'Bar path straight']),
  X('Lateral Raise', 'Shoulders', 'Dumbbell', 'Beginner', 'weight', 4, ['Lead with elbows', 'Stop at shoulder height', 'Light weight, strict form']),
  X('Face Pull', 'Shoulders', 'Cable', 'Beginner', 'weight', 4, ['Rope to forehead', 'External rotate', 'Elbows high']),
  X('Arnold Press', 'Shoulders', 'Dumbbell', 'Intermediate', 'weight', 6, ['Rotate as you press', 'Full range', 'Core braced']),
  X('Barbell Curl', 'Biceps', 'Barbell', 'Beginner', 'weight', 4, ['Elbows pinned', 'No swinging', 'Squeeze at the top']),
  X('Hammer Curl', 'Biceps', 'Dumbbell', 'Beginner', 'weight', 4, ['Neutral grip', 'Alternate arms', 'Slow negative']),
  X('Preacher Curl', 'Biceps', 'Machine', 'Intermediate', 'weight', 4, ['Armpits on pad', 'Full stretch', 'Controlled tempo']),
  X('Tricep Pushdown', 'Triceps', 'Cable', 'Beginner', 'weight', 4, ['Elbows by your sides', 'Full lockout', 'Pause at bottom']),
  X('Skull Crushers', 'Triceps', 'Barbell', 'Intermediate', 'weight', 5, ['Bar to forehead', 'Upper arms still', 'Use an EZ bar']),
  X('Close-grip Bench', 'Triceps', 'Barbell', 'Intermediate', 'weight', 6, ['Hands shoulder-width', 'Elbows tucked', 'Touch lower chest']),
  X('Plank', 'Core', 'Bodyweight', 'Beginner', 'time', 4, ['Squeeze glutes', 'Neutral neck', 'Breathe steadily']),
  X('Hanging Leg Raise', 'Core', 'Bodyweight', 'Advanced', 'reps', 5, ['No swinging', 'Curl pelvis up', 'Slow lowering']),
  X('Russian Twist', 'Core', 'Bodyweight', 'Beginner', 'reps', 5, ['Lean back 45°', 'Rotate from the torso', 'Feet up for harder']),
  X('Cable Crunch', 'Core', 'Cable', 'Intermediate', 'weight', 4, ['Hips still', 'Round the spine', 'Exhale on crunch']),
  X('Back Squat', 'Quads', 'Barbell', 'Intermediate', 'weight', 9, ['Brace before descent', 'Knees track toes', 'Hip crease below knee']),
  X('Leg Press', 'Quads', 'Machine', 'Beginner', 'weight', 7, ['Feet shoulder-width', 'Don’t lock knees', 'Lower back on pad']),
  X('Bulgarian Split Squat', 'Quads', 'Dumbbell', 'Intermediate', 'weight', 8, ['Rear foot on bench', 'Torso upright', 'Drive through front heel']),
  X('Walking Lunges', 'Quads', 'Dumbbell', 'Beginner', 'reps', 7, ['Long stride', 'Back knee near floor', 'Stay tall']),
  X('Romanian Deadlift', 'Hamstrings', 'Barbell', 'Intermediate', 'weight', 8, ['Soft knees', 'Push hips back', 'Bar close to legs']),
  X('Leg Curl', 'Hamstrings', 'Machine', 'Beginner', 'weight', 5, ['Hips pressed down', 'Full curl', 'Slow return']),
  X('Nordic Curl', 'Hamstrings', 'Bodyweight', 'Advanced', 'reps', 6, ['Anchor feet', 'Lower as slow as possible', 'Hips extended']),
  X('Hip Thrust', 'Glutes', 'Barbell', 'Intermediate', 'weight', 7, ['Upper back on bench', 'Chin tucked', 'Full hip extension']),
  X('Glute Bridge', 'Glutes', 'Bodyweight', 'Beginner', 'reps', 4, ['Feet close to glutes', 'Squeeze at top', 'Ribs down']),
  X('Cable Kickback', 'Glutes', 'Cable', 'Beginner', 'weight', 4, ['Slight forward lean', 'Kick back and up', 'Control']),
  X('Standing Calf Raise', 'Calves', 'Machine', 'Beginner', 'weight', 3, ['Full stretch at bottom', 'Pause at top', 'Straight knees']),
  X('Seated Calf Raise', 'Calves', 'Machine', 'Beginner', 'weight', 3, ['Knees under pad', 'Slow tempo', 'High reps']),
  X('Treadmill Run', 'Cardio', 'Machine', 'Beginner', 'time', 11, ['Light, quick steps', 'Relaxed shoulders', 'Breathe rhythmically']),
  X('Rowing Machine', 'Cardio', 'Machine', 'Beginner', 'time', 10, ['Legs, hips, arms', 'Arms, hips, legs on return', 'Steady pace']),
  X('Jump Rope', 'Cardio', 'Bodyweight', 'Beginner', 'time', 12, ['Small jumps', 'Wrists turn the rope', 'Stay on balls of feet']),
  X('Burpees', 'Cardio', 'Bodyweight', 'Intermediate', 'reps', 12, ['Chest to floor', 'Explosive jump', 'Land softly']),
  X('Kettlebell Swing', 'Glutes', 'Kettlebell', 'Intermediate', 'reps', 11, ['Hinge, don’t squat', 'Snap hips', 'Bell to chest height']),
  X('Mountain Climbers', 'Core', 'Bodyweight', 'Beginner', 'time', 10, ['Hips level', 'Drive knees fast', 'Hands under shoulders']),
  X('Cycling', 'Cardio', 'Machine', 'Beginner', 'time', 9, ['Set saddle height', 'Smooth pedal circles', 'Steady cadence']),
  X('Box Jumps', 'Quads', 'Bodyweight', 'Intermediate', 'reps', 10, ['Arm swing', 'Land softly', 'Step down']),
  X('Farmer’s Carry', 'Core', 'Dumbbell', 'Beginner', 'time', 8, ['Tall posture', 'Tight grip', 'Short quick steps']),
  X('Shrugs', 'Back', 'Dumbbell', 'Beginner', 'weight', 3, ['Straight up', 'Pause at top', 'No rolling']),
  X('Reverse Fly', 'Shoulders', 'Dumbbell', 'Beginner', 'weight', 4, ['Hinge forward', 'Thumbs up', 'Squeeze rear delts']),
  X('Diamond Push-ups', 'Triceps', 'Bodyweight', 'Intermediate', 'reps', 6, ['Hands in a diamond', 'Elbows back', 'Full range']),
];
export const ex = (id) => EXERCISES.find((e) => e.id === id);

export const PROGRAMS = [
  {
    id: 'ppl', name: 'Push · Pull · Legs', icon: '🏋️', level: 'Intermediate', weeks: 8, perWeek: 6, goal: 'Muscle gain', grad: ['#e11d48', '#f59e0b'],
    desc: 'The classic hypertrophy split. Hit every muscle twice a week with progressive overload.',
    days: [
      { name: 'Push', list: ['bench-press', 'overhead-press', 'incline-dumbbell-press', 'lateral-raise', 'tricep-pushdown'] },
      { name: 'Pull', list: ['deadlift', 'pull-ups', 'barbell-row', 'face-pull', 'barbell-curl'] },
      { name: 'Legs', list: ['back-squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'standing-calf-raise'] },
    ],
  },
  {
    id: 'fb', name: 'Full-body Foundations', icon: '🌱', level: 'Beginner', weeks: 6, perWeek: 3, goal: 'Build a habit', grad: ['#10b981', '#0ea5e9'],
    desc: 'Three simple full-body sessions a week to learn the big lifts and build consistency.',
    days: [
      { name: 'Day A', list: ['back-squat', 'push-ups', 'lat-pulldown', 'plank'] },
      { name: 'Day B', list: ['romanian-deadlift', 'overhead-press', 'seated-cable-row', 'glute-bridge'] },
      { name: 'Day C', list: ['leg-press', 'incline-dumbbell-press', 'hammer-curl', 'russian-twist'] },
    ],
  },
  {
    id: 'hiit', name: 'HIIT Fat Burn', icon: '🔥', level: 'Intermediate', weeks: 4, perWeek: 4, goal: 'Fat loss', grad: ['#f97316', '#ec4899'],
    desc: 'Short, intense circuits that torch calories and boost conditioning.',
    days: [
      { name: 'Circuit 1', list: ['burpees', 'kettlebell-swing', 'mountain-climbers', 'jump-rope'] },
      { name: 'Circuit 2', list: ['box-jumps', 'walking-lunges', 'russian-twist', 'rowing-machine'] },
    ],
  },
  {
    id: 'str', name: 'Strength 5×5', icon: '🦍', level: 'Advanced', weeks: 12, perWeek: 3, goal: 'Raw strength', grad: ['#6366f1', '#a855f7'],
    desc: 'Heavy compound lifts, five sets of five, adding weight every session.',
    days: [
      { name: 'Workout A', list: ['back-squat', 'bench-press', 'barbell-row'] },
      { name: 'Workout B', list: ['back-squat', 'overhead-press', 'deadlift'] },
    ],
  },
  {
    id: 'core', name: 'Core & Mobility', icon: '🧘', level: 'Beginner', weeks: 4, perWeek: 3, goal: 'Posture', grad: ['#14b8a6', '#84cc16'],
    desc: 'Bulletproof your midsection and move better every day.',
    days: [{ name: 'Core flow', list: ['plank', 'glute-bridge', 'russian-twist', 'hanging-leg-raise', 'farmer-s-carry'] }],
  },
];

export const FRIENDS = [
  ['Arjun', '🦁', 68420], ['Meera', '🦊', 61200], ['Rohan', '🐺', 57800], ['Ishita', '🦄', 52150], ['Kabir', '🐻', 47300], ['Sana', '🐼', 39900],
];

export const CHALLENGES = [
  { id: 'steps', name: '70K steps this week', icon: '👟', goal: 70000, unit: 'steps', days: 7, color: '#0ea5e9' },
  { id: 'workouts', name: '12 workouts in October', icon: '🏋️', goal: 12, unit: 'workouts', days: 31, color: '#e11d48' },
  { id: 'water', name: 'Hydration hero — 2.5 L × 14 days', icon: '💧', goal: 14, unit: 'days', days: 14, color: '#06b6d4' },
  { id: 'plank', name: '5-minute plank club', icon: '🧱', goal: 300, unit: 'sec', days: 30, color: '#8b5cf6' },
];
