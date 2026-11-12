import type { Award } from '../types/content'

export const awards: Award[] = [
  {
    id: 'bobathon',
    kind: 'Award',
    category: 'Hackathon',
    badge: '2nd place',
    t: 'ICS x IBM Bobathon',
    role: 'Backend developer',
    w: 'October 2026',
    d: 'A two-day sprint at the Polytechnic University of the Philippines, building around IBM Bob. Our team built PUPila, an AI-guided enrollment portal powered by our CampusAssist AI agent. It assigns subjects for regular students, streamlines approvals for irregular students, and answers enrollment questions through a real-time chatbot. I built the backend. It was our first hackathon as a team and my third overall.',
    photos: [
      {
        label: 'The team with the 2nd place award',
        src: '/hackathon_pics/bobathon/group_win.jpg',
      },
      {
        label: 'Holding the trophy',
        src: '/hackathon_pics/bobathon/solo.jpg',
      },
      {
        label: 'Day one with the team',
        src: '/hackathon_pics/bobathon/first_day.jpg',
      },
    ],
  },
  {
    id: 'rotc-cose',
    kind: 'Leadership',
    category: 'ROTC',
    badge: 'Head Corps Escort',
    t: 'ROTC COSE',
    role: 'Head Corps Escort',
    w: 'Nov 2024 – Jun 2025',
    d: 'Led the Corps of Sponsors and Escorts through ceremonial roles at ROTC events and university functions. I coordinated logistics between military officers and university administrators so high-profile protocols ran smoothly, and trained junior sponsors and escorts in protocol, conduct, and their responsibilities.',
    photos: [
      {
        label: 'The Corps of Sponsors and Escorts',
        src: '/leadership/rotc/complete-1600.jpg',
      },
      { label: 'In the COSE uniform', src: '/leadership/rotc/me-1600.jpg' },
      { label: 'At the ROTC ball', src: '/leadership/rotc/ball.jpg' },
      { label: 'With the corps', src: '/leadership/rotc/first_td.jpg' },
    ],
  },
]
