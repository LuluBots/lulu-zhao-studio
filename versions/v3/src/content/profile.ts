import type { FlightPath } from '../scene/trajectories';
import type { Side } from '../state/rally';
export type Entry = { id: string; title: string; summary: string; url?: string; side: Side; year?: number; status?: string; source: string; trajectory?: FlightPath; note?: string };
export const profile = { name: 'Lulu Zhao', affiliation: 'CS PhD Cornell', focus: 'Human–AI Interaction · Design · Embodied Intelligence' };
const cv = 'CV, September 2026, my CV';
export const projects: Entry[] = [
  { id: 'physical-invention', trajectory: 'straight', title: 'AI-Assisted Co-Design for Physical Invention', summary: 'Multimodal AI for spatial reasoning and co-evolving physical artifacts and fabrication mechanisms. Advised by Qian Yang at Cornell.', side: 'technology', year: 2026, status: 'August 2026–present', source: cv },
  { id: 'movebot', trajectory: 'crosscourt', note: 'This work explores contact-rich humanoid skills through video-generated motion references and policy learning.', title: 'MoveBot', summary: 'Humanoid manipulation policies distilled from generative videos. Collaborated with Qi Wu at Cornell.', url: 'https://luluzhao.me/research/movebot', side: 'technology', year: 2026, status: 'October 2025–July 2026', source: cv },
  { id: 'anchorit', trajectory: 'insideout', note: 'Research at Beijing Normal University, advised by Ting Zhang.', title: 'AnchorIT', summary: 'Training-free composed image retrieval with diffusion priors and language-model reasoning.', url: 'https://luluzhao.me/research/anchorit', side: 'technology', year: 2025, source: cv },
  { id: 'elastoplastic', trajectory: 'straight', note: 'Research at The Chinese University of Hong Kong, advised by K. W. Samuel Au and Xiangyu Chu.', title: 'Manipulating Elasto-Plastic Objects', summary: 'Learning-based predictive control with a 3D occupancy representation.', url: 'https://luluzhao.me/research/elastoplastic-manipulation', side: 'technology', year: 2025, status: 'RA-L 2025 / ICRA 2026', source: cv },
  { id: 'foam-hand', trajectory: 'insideout', title: 'Dexterous Manipulation of Foam Hand via Diffusion Policy', summary: 'Learning generalized dexterous manipulation for a 23-DoF anthropomorphic soft hand using diffusion policies and a customized teleoperation system.', note: 'Summer research at Carnegie Mellon University’s Robotics Institute, advised by Nancy Pollard.', url: 'https://github.com/CMU-Foam-Hands-Lab/diff_foam', side: 'technology', year: 2024, status: 'June–August 2024 · Carnegie Mellon University', source: 'https://v1.luluzhao.me/research/foam-hand' },
];
export const publications: Entry[] = [
  { id: 'kinogen', title: 'KinoGen: Customizable Humanoid Loco-Manipulation References via Kinematically Grounded Video Generation', summary: 'Coauthored humanoid loco-manipulation research.', side: 'technology', status: 'Under review — ICRA 2027', source: cv },
];
// Article body verified in the browser on 2026-10-08; summary below is a paraphrase.
export const articles: Entry[] = [
  { id: 'unfinished-questions', trajectory: 'crosscourt', note: 'My opening note asks what relationships and ways of thinking intelligent systems can make possible.', title: 'A place for unfinished questions', summary: 'On moving from poetry and PPE into robotics, and keeping room for questions between research, design, and human experience.', url: 'https://luluzhao.me/blog/a-place-for-unfinished-questions', side: 'humanities', year: 2026, source: 'https://luluzhao.me/blog/a-place-for-unfinished-questions' },
];
export const sides = {
  technology: {
    title: 'Code', color: '#536b85', mark: 'geometry',
    focus: 'Human–AI Interaction · Design · Embodied Intelligence',
    biography: 'I study how multimodal AI can support the co-design of physical inventions at Cornell. My earlier work spans robot learning, manipulation, and generative models.',
    interests: ['Human–AI Interaction', 'AI-assisted co-design', 'Embodied intelligence', 'Robot learning'],
    source: 'https://luluzhao.me/research', entries: projects,
  },
  humanities: {
    title: 'Verse', color: '#fff1d6', mark: 'leaf',
    focus: 'Poetry & essays · Reading & writing · PPE',
    biography: 'I began publishing poetry and essays in primary school, studied humanities in high school, and started university in Politics, Philosophy, and Economics before moving into AI.',
    interests: ['Poetry & essays', 'Literature, history & philosophy', 'Politics, Philosophy & Economics', 'Human experience'],
    source: 'https://luluzhao.me/about', entries: articles,
  },
} as const;
export const interests = { technology: sides.technology.interests, humanities: sides.humanities.interests };

// Contact destinations verified against the preserved V1 site.
export const socialLinks = [
  { label: 'Email', href: 'mailto:lz625@cornell.edu' },
  { label: 'GitHub', href: 'https://github.com/LuluBots' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=9eMU41cAAAAJ&hl=en' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lulubotszhao/' },
] as const;

export const education = [
 { school: 'Cornell University', dates: '2025–present', program: 'PhD · Computer Science', distinction: 'Cornell Fellowship · 2025' },
 { school: 'The Chinese University of Hong Kong', dates: '2024–2025', program: 'Exchange · New Asia College' },
 { school: 'Carnegie Mellon University', dates: 'Summer 2024', program: 'Summer research · Robotics Institute' },
 { school: 'Beijing Normal University', dates: '2021–2025', program: 'Bachelor of Engineering · Artificial Intelligence' },
];
