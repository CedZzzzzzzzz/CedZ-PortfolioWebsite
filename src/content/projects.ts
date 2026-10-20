import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'ecobench',
    n: 'ECOBENCH',
    d: 'ESP32 energy-monitoring system, firmware to backend.',
    img: '',
    year: '2026',
    role: 'Firmware + full-stack',
    overview:
      'Replace this with 2-3 sentences: the problem, your approach, and the result.',
    highlights: [
      'ESP32 firmware that measures and reports energy usage',
      'Backend that stores and serves the readings',
      'Dashboard for live and historical data',
    ],
    t: ['ESP32', 'C++', 'firmware', 'backend APIs'],
    links: [
      ['GitHub', 'https://github.com/MarcusCedric'],
      ['Live demo', ''],
    ],
  },
  {
    id: 'bifrost',
    n: 'Bifrost Gateway',
    d: 'Full-stack AI middleware gateway.',
    img: '',
    year: '2026',
    role: 'Full-stack',
    overview:
      'Replace this with 2-3 sentences: the problem, your approach, and the result.',
    highlights: [
      'Gateway layer between apps and AI models',
      'Backend routing and request handling',
      'Frontend to monitor and configure it',
    ],
    t: ['AI middleware', 'Python', 'backend APIs', 'React'],
    links: [
      ['GitHub', 'https://github.com/MarcusCedric'],
      ['Live demo', ''],
    ],
  },
  {
    id: 'f1',
    n: 'F1 2026 Predictor',
    d: 'Championship prediction platform with an ML engine.',
    img: '',
    year: '2026',
    role: 'ML + web',
    overview:
      'Replace this with 2-3 sentences: the problem, your approach, and the result.',
    highlights: [
      'ML engine that predicts championship standings',
      'Web platform to explore the predictions',
      'Pipeline from data to a deployed app',
    ],
    t: ['ML models', 'Python', 'React'],
    links: [
      ['GitHub', 'https://github.com/MarcusCedric'],
      ['Live demo', ''],
    ],
  },
]
