import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'ecobench',
    n: 'EcoBench',
    d: 'A solar-powered public charging station with human-powered backup.',
    img: '/projects/ecobench.webp',
    categories: ['Academic', 'Completed'],
    role: 'Embedded systems + backend',
    overview:
      'EcoBench is an ergonomic solar-powered charging station with a hand crank that converts human kinetic energy into stored electricity. It combines an ESP32-monitored 1280Wh LiFePO4 battery with a 300W solar array for mobile charging in public spaces.',
    highlights: [
      'Custom-geared hand crank stores energy from human movement',
      'ESP32 monitors a 1280Wh LiFePO4 battery',
      '300W solar array supports public mobile charging',
    ],
    t: [
      'ESP32',
      'C++',
      'React',
      'Python',
      'FastAPI',
      'Supabase',
      'Tailwind CSS',
      'Resend',
    ],
    links: [['Live project', 'https://pupitech-ecobench.vercel.app/']],
  },
  {
    id: 'quantis-f1',
    n: 'Quantis-F1',
    d: 'A real-time Formula 1 championship predictor with telemetry and ML.',
    img: '/projects/quantis-f1.webp',
    categories: ['Ongoing', 'Personal'],
    role: 'Full-stack + machine learning',
    overview:
      'Quantis-F1 predicts the 2026 Formula 1 championship using live telemetry, race simulations, and machine learning. Its data pipeline connects OpenF1, Redis, WebSockets, and a React dashboard, with lap-time predictions trained on FastF1 historical data.',
    highlights: [
      'Live telemetry pipeline from OpenF1 through Redis and WebSockets',
      'Monte Carlo simulation engine for championship standings',
      'Lap-time predictions using FastF1 historical data',
    ],
    t: [
      'React',
      'Python',
      'FastAPI',
      'Docker',
      'Redis',
      'PostgreSQL',
      'Supabase',
      'OpenF1',
      'WebSocket',
      'FastF1',
    ],
    links: [['Live project', 'https://quantis-f1.tech']],
  },
  {
    id: 'budget-tracker',
    n: 'Budget Tracker',
    d: 'A personal expense tracker with AI-generated PDF insights.',
    img: '/projects/budget-tracker.webp',
    categories: ['Personal'],
    role: 'Personal project',
    overview:
      'A personal finance website for tracking weekly and monthly expenses. It adds Gemini-generated spending insights to exported PDF reports.',
    highlights: [
      'Tracks weekly and monthly expenses',
      'Adds AI-generated spending insights to PDF exports',
    ],
    t: ['Python', 'Flask', 'React', 'PostgreSQL', 'Gemini API'],
    links: [['Live project', 'https://balaze.netlify.app/']],
  },
  {
    id: 'portfolio-website',
    n: 'Portfolio Website',
    d: 'A dual-view portfolio with a custom website and an interactive terminal workspace.',
    img: '/projects/portfolio-website.webp',
    categories: ['Personal'],
    role: 'Personal project',
    overview:
      'A React and TypeScript portfolio with two ways to explore: a custom-designed website and a VS Code-inspired terminal workspace. Byte uses Gemini to answer questions from the portfolio and resume.',
    highlights: [
      'Custom portfolio view paired with an interactive terminal workspace',
      'Byte answers portfolio questions using Gemini and approved portfolio facts',
    ],
    t: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'Gemini API',
    ],
    links: [['Live project', 'https://marcuscedricpedrosa.dev']],
  },
]
