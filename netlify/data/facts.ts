export const facts = {
    person: {
        name: 'Marcus Cedric S. Pedrosa',
        role: 'Computer Engineering Technology Student',
        year: '3rd year, specializing in Machine Learning',
        focus: [
            'Software Development',
            'Artificial Intelligence',
            'Internship Opportunities & Experience'
        ],
        bio: 'A 3rd year computer engineering technology student specializing in Machine Learning with a passion for creating useful digital solutions and solving real-world problems.',
        github: 'https://github.com/CedZzzzzzzzz',
        linkedin: 'https://www.linkedin.com/in/marcus-cedric-pedrosa/',
        facebook: 'https://www.facebook.com/marcuscedric.pedrosa',
        instagram: 'https://www.instagram.com/mar_cedz/',
    },

    availability: {
        status: 'Currently looking for internship and job opportunities',
        preferredWork: ['Remote', 'On-site', 'Hybrid'],
        contactEmail: 'ced41974@gmail.com',
        contactLinkedIn: 'https://www.linkedin.com/in/marcus-cedric-pedrosa/',
    },

    skills: {
        backend: ['Python', 'Java'],
        frontend: ['HTML', 'CSS', 'JavaScript', 'React'],
        frameworks: ['Flask', 'FastAPI', 'NumPy', 'Pandas', 'Tailwind CSS'],
        databases: ['PostgreSQL', 'MySQL', 'Supabase'],
        tools: ['Git', 'GitHub', 'Docker', 'Cisco Packet Tracer', 'Playwright', 'Postman', 'Directus'],
    },

    biggest_project: {
            name: 'Quantis-F1',
            status: 'Ongoing',
            description: 'A full-stack real-time championship predictor for the 2026 Formula 1 regulation reset. Features a live telemetry pipeline (OpenF1 → Redis → WebSocket → React dashboard), Monte Carlo simulation engine, and ML lap time prediction using FastF1 historical data.',
            stack: ['React', 'Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL', 'Supabase'],
            link: 'https://quantis-f1.tech'
    },

    projects: [
        {
            name: 'Quantis-F1',
            status: 'Ongoing',
            description: 'A full-stack real-time championship predictor for the 2026 Formula 1 regulation reset. Features a live telemetry pipeline (OpenF1 → Redis → WebSocket → React dashboard), Monte Carlo simulation engine, and ML lap time prediction using FastF1 historical data.',
            stack: ['React', 'Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL', 'Supabase'],
            link: 'https://quantis-f1.tech'
        },
        {
            name: 'EcoBench',
            status: 'Completed',
            description: 'An ergonomic solar-powered charging station integrating a custom-geared hand crank to convert human kinetic energy into stored electricity. Features an ESP32-monitored 1280Wh LiFePO4 battery and a 300W solar array for sustainable high-speed mobile charging in public spaces.',
            stack: ['ESP32', 'C++', 'React', 'Python', 'FastAPI', 'Supabase', 'Tailwind CSS', 'Resend'],
            link: 'https://pupitech-ecobench.vercel.app/'
        },
        {
            name: 'Crime Detection System',
            status: 'Completed (Academic)',
            description: 'AI-powered crime scene analysis system that detects weapons and threats using YOLOv8 object detection, enhanced with a RAG-based chatbot providing real-time investigative assistance.',
            stack: ['React', 'Flask', 'YOLOv8', 'LangChain', 'FAISS', 'NumPy'],
            link: 'https://github.com/CedZzzzzzzzz?tab=repositories&q=crime-detection'
        },
        {
            name: 'Budget Tracker',
            status: 'Personal',
            description: 'A personal budget tracker website featuring weekly and monthly expense tracking with AI-generated spending insights via Gemini during PDF export.',
            stack: ['Python', 'Flask', 'React', 'PostgreSQL'],
            link: 'https://balaze.netlify.app/'
        },
        {
            name: 'Portfolio Website',
            status: 'Personal',
            description: 'A portfolio website showcasing projects, skills, and experience. Built with a custom design using vanilla HTML, CSS, and JavaScript with a Netlify Functions backend powering an AI chatbot.',
            stack: ['HTML', 'CSS', 'JavaScript', 'Netlify Functions', 'TypeScript', 'Gemini API'],
            link: 'https://marcuscedricpedrosa.dev'
        }
    ],

    experience: [
        {
            role: 'Data Analyst Intern',
            company: 'Etiqa Life and General Assurance Philippines, Inc.',
            period: 'July 2025 – September 2025',
            description: 'Streamlined high-volume data operations by implementing automated Excel validation and a structured archival system, significantly reducing retrieval times. Ensured 100% data fidelity across complex processing pipelines by conducting rigorous cross-validation between digital datasets and physical records.',
            skills: ['MS Excel', 'Data Validation', 'Data Management']
        },
        {
            role: 'Software Quality Assurance Intern',
            company: 'Snapp Ventures Inc. (Matchmo)',
            period: 'March 2026 – Present',
            description: 'Ensured production-grade software quality by executing end-to-end testing across web, internal CRM, and Android APK environments. Audited data pipelines to achieve 100% data mapping accuracy. Enforced sub-500ms to 600ms page interactivity thresholds through network latency testing. Designed and containerized parameterized web automation scripts using Playwright and Docker across 10 consecutive weeks of agile sprints.',
            skills: ['Postman', 'Directus', 'UAT', 'API Testing', 'Playwright', 'Docker', 'JavaScript', 'Agile']
        }
    ],

    certifications: [
        {
            name: 'Introduction to Python Programming',
            issuer: 'Coursera',
            date: 'November 2025',
            link: 'https://coursera.org/share/fabf0c3097397127b88852553d8f4e47'
        },
        {
            name: 'Python Data Associate',
            issuer: 'DataCamp',
            date: 'February 2026',
            link: 'https://www.datacamp.com/certificate/PDA0015674515999'
        },
        {
            name: 'Computer Systems Servicing NC II',
            issuer: 'TESDA',
            date: 'September 2024'
        },
        {
            name: 'Mechatronics Servicing NC II',
            issuer: 'TESDA',
            date: 'February 2026'
        },
        {
            name: 'AWS AI Practitioner Challenge',
            issuer: 'Udacity',
            date: 'June 2026',
            link: 'https://www.udacity.com/certificate/e/0f3ca3fc-2c9a-11f1-9592-bfb3caafc951'
        }
    ]
} as const;