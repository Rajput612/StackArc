interface Concept {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  difficulty: string;
  exercises: Array<{
    title: string;
    description: string;
    code?: string;
    solution?: string;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  rating: string;
  enrolled: string;
  concepts: Concept[];
}

export const courseContent: Record<string, Course> = {
  'python-basics': {
    id: 'python-basics',
    title: 'Python Basic',
    description: 'Master Python basics including syntax, data types, control structures, and functions',
    duration: '4 weeks',
    level: 'Beginner',
    rating: '4.8',
    enrolled: '1,234',
    concepts: []
  },
  'python-advanced': {
    id: 'python-advanced',
    title: 'Python Advanced',
    description: 'Deep dive into advanced Python concepts including decorators, generators, and metaclasses',
    duration: '6 weeks',
    level: 'Advanced',
    rating: '4.9',
    enrolled: '856',
    concepts: []
  },
  'data-structures': {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Learn essential data structures implementation in Python',
    duration: '5 weeks',
    level: 'Intermediate',
    rating: '4.7',
    enrolled: '978',
    concepts: []
  },
  'algorithms': {
    id: 'algorithms',
    title: 'Algorithms',
    description: 'Master fundamental algorithms and problem-solving techniques',
    duration: '6 weeks',
    level: 'Intermediate',
    rating: '4.8',
    enrolled: '765',
    concepts: []
  },
  'django': {
    id: 'django',
    title: 'Django',
    description: 'Build web applications with Django framework',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: '4.9',
    enrolled: '1,567',
    concepts: []
  },
  'gunicorn': {
    id: 'gunicorn',
    title: 'Gunicorn',
    description: 'Learn to deploy Python applications with Gunicorn server',
    duration: '2 weeks',
    level: 'Intermediate',
    rating: '4.6',
    enrolled: '543',
    concepts: []
  },
  'nginx': {
    id: 'nginx',
    title: 'Nginx',
    description: 'Configure and optimize Nginx for Python web applications',
    duration: '2 weeks',
    level: 'Intermediate',
    rating: '4.7',
    enrolled: '678',
    concepts: []
  },
  'postgresql': {
    id: 'postgresql',
    title: 'PostgreSQL',
    description: 'Master PostgreSQL database for Python applications',
    duration: '4 weeks',
    level: 'Intermediate',
    rating: '4.8',
    enrolled: '892',
    concepts: []
  },
  'docker': {
    id: 'docker',
    title: 'Docker',
    description: 'Containerize Python applications with Docker',
    duration: '3 weeks',
    level: 'Intermediate',
    rating: '4.9',
    enrolled: '1,234',
    concepts: []
  },
  'git': {
    id: 'git',
    title: 'Git',
    description: 'Master version control with Git for Python projects',
    duration: '2 weeks',
    level: 'Beginner',
    rating: '4.7',
    enrolled: '2,345',
    concepts: []
  }
};
