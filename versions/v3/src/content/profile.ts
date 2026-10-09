import type { FlightPath } from '../scene/trajectories';
import type { Side } from '../state/rally';
export type Entry = { id: string; title: string; summary: string; url?: string; side: Side; year?: number; status?: string; source: string; trajectory?: FlightPath; note?: string };
export const profile = { name: 'Lulu Zhao', affiliation: 'CS PhD Cornell', focus: 'Human–AI Interaction · Design · Embodied Intelligence' };
const cv = 'CV, September 2026, my CV';
export const projects: Entry[] = [
  { id: 'physical-invention', trajectory: 'straight', title: 'AI-Assisted Co-Design for Physical Invention', summary: 'Multimodal AI for spatial reasoning and co-evolving physical artifacts and fabrication mechanisms. Advised by Qian Yang at Cornell.', side: 'technology', year: 2026, status: 'August 2026–present', source: cv },
  { id: 'movebot', trajectory: 'crosscourt', note: 'This work explores contact-rich humanoid skills through video-generated motion references and policy learning.', title: 'MoveBot', summary: 'Humanoid manipulation policies distilled from generative videos. Advised by Kuan Fang at Cornell.', url: 'https://luluzhao.me/research/movebot', side: 'technology', year: 2026, status: 'October 2025–July 2026', source: cv },
  { id: 'anchorit', trajectory: 'insideout', note: 'Research at Beijing Normal University, advised by Ting Zhang.', title: 'AnchorIT', summary: 'Training-free composed image retrieval with diffusion priors and language-model reasoning.', url: 'https://luluzhao.me/research/anchorit', side: 'technology', year: 2025, source: cv },
  { id: 'elastoplastic', trajectory: 'straight', note: 'Research at The Chinese University of Hong Kong, advised by K. W. Samuel Au and Xiangyu Chu.', title: 'Manipulating Elasto-Plastic Objects', summary: 'Learning-based predictive control with a 3D occupancy representation.', url: 'https://luluzhao.me/research/elastoplastic-manipulation', side: 'technology', year: 2025, status: 'RA-L 2025 / ICRA 2026', source: cv },
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
