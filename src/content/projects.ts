import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'ecobench',
    n: 'EcoBench',
    d: 'A solar-powered public charging station with human-powered backup.',
    img: '/projects/ecobench.webp',
    role: 'Embedded systems + full-stack',
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
    year: '2026',
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
    id: 'crime-detection',
    n: 'Crime Detection System',
    d: 'An academic AI system for weapon detection and investigative support.',
    img: '/projects/crime-detection.webp',
    role: 'Academic project · AI/ML',
    overview:
      'This academic project analyzes crime scenes for weapons and threats with YOLOv8 object detection. A retrieval-augmented chatbot provides investigative assistance alongside the detections.',
    highlights: [
      'Detects weapons and threats with YOLOv8',
      'Includes a retrieval-augmented chatbot for investigative assistance',
    ],
    t: ['React', 'Flask', 'YOLOv8', 'LangChain', 'FAISS', 'NumPy'],
    links: [
      [
        'GitHub repository search',
        'https://github.com/CedZzzzzzzzz?tab=repositories&q=crime-detection',
      ],
    ],
  },
  {
    id: 'budget-tracker',
    n: 'Budget Tracker',
    d: 'A personal expense tracker with AI-generated PDF insights.',
    img: '/projects/budget-tracker.webp',
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
    d: 'A portfolio with a custom interface and an AI chat function.',
    img: '/projects/portfolio-website.webp',
    role: 'Personal project',
    overview:
      'A portfolio website built with a custom HTML, CSS, and JavaScript design. Netlify Functions power its AI chatbot.',
    highlights: [
      'Custom interface built with HTML, CSS, and JavaScript',
      'AI chatbot powered by Netlify Functions and Gemini',
    ],
    t: [
      'HTML',
      'CSS',
      'JavaScript',
      'Netlify Functions',
      'TypeScript',
      'Gemini API',
    ],
    links: [['Live project', 'https://marcuscedricpedrosa.dev']],
  },
]
