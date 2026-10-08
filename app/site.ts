export const site = {
  name: "Lulu Zhao",
  chineseName: "赵璐璐",
  role: "CS PhD student · Cornell University",
  institution: "Cornell University",
  researchSummary: "I’m interested in human–AI interaction and design.",
  email: "lz625@cornell.edu",
  github: "https://github.com/LuluBots",
  linkedin: "https://www.linkedin.com/in/lulubotszhao/",
  scholar: "https://scholar.google.com/citations?user=9eMU41cAAAAJ&hl=en",
};

export type ResearchProject = {
  slug: string;
  title: string;
  shortTitle: string;
  dates: string;
  institution: string;
  advisors: string;
  summary: string;
  contribution: string;
  tags: string[];
  links?: { label: string; url: string }[];
  featured?: boolean;
};

export const researchProjects: ResearchProject[] = [
  {
    slug: "anchorit",
    title: "AnchorIT: Zero-Shot Composed Image Retrieval with Diffusion Priors and LLMs",
    shortTitle: "AnchorIT",
    dates: "Mar 2025 – Jul 2025",
    institution: "Beijing Normal University",
    advisors: "Advised by Prof. Ting Zhang",
    summary: "A training-free approach to composed image retrieval through visual editing and semantic reasoning.",
    contribution: "Proposed a training-free ZS-CIR framework that combines diffusion-based editing with LLM-driven semantic reasoning.",
    tags: ["Diffusion models", "LLMs", "Image retrieval"],
    featured: true,
  },
  {
    slug: "foam-hand",
    title: "Dexterous Manipulation of Foam Hand via Diffusion Policy",
    shortTitle: "Dexterous Foam Hand",
    dates: "Jun 2024 – Aug 2024",
    institution: "Carnegie Mellon University",
    advisors: "Advised by Prof. Nancy Pollard",
    summary: "Learning generalized dexterous manipulation for a soft, anthropomorphic robotic hand.",
    contribution: "Developed a generalized manipulation policy for a 23-DoF anthropomorphic soft hand with a customized teleoperation system.",
    tags: ["Dexterous manipulation", "Diffusion policy", "Teleoperation"],
    featured: true,
    links: [
      { label: "Project code", url: "https://github.com/CMU-Foam-Hands-Lab/diff_foam" },
      { label: "Project video", url: "https://drive.google.com/drive/folders/1KEXPBYPwv0lbEvvZ6YWYVUTffquYh2OQ?usp=drive_link" },
    ],
  },
  {
    slug: "anxiety-detection-robot",
    title: "Tongue-based Intelligent Anxiety Detection Robot",
    shortTitle: "Anxiety Detection Robot",
    dates: "Jul 2022 – Dec 2022",
    institution: "Beijing Normal University",
    advisors: "Advised by Prof. Qingqiong Deng",
    summary: "An autonomous, conversational robot prototype for accessible anxiety screening.",
    contribution: "Integrated an intelligent screening robot featuring autonomous navigation and language interaction.",
    tags: ["Social robotics", "Autonomous navigation", "Human-robot interaction"],
    featured: false,
  },
];

export const publication = {
  slug: "elastoplastic-manipulation",
  title:
    "Manipulating Elasto-Plastic Objects With 3D Occupancy and Learning-Based Predictive Control",
  shortTitle: "Manipulating Elasto-Plastic Objects",
  date: "Sep 2024 – Feb 2025",
  venue: "IEEE Robotics and Automation Letters (RA-L), 2025 · ICRA 2026 Transfer",
  citation: "Vol. 10, No. 7, pp. 7222–7229",
  conference: "ICRA 2026 Transfer",
  doi: "10.1109/LRA.2025.3575308",
  paperUrl:
    "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11018411",
  videoUrl: "/videos/ral2025icra2026.mp4",
  videoPoster: "/videos/ral2025icra2026-poster.jpg",
  authors:
    "Zhen Zhang, Xiangyu Chu, Yunxi Tang, Lulu Zhao, Jing Huang, Zhongliang Jiang, and K. W. Samuel Au",
};

export const publications = [
  {
    year: "2025 / 2026",
    title: "Manipulating Elasto-Plastic Objects With 3D Occupancy and Learning-Based Predictive Control",
    authors: "Zhen Zhang, Xiangyu Chu, Yunxi Tang, Lulu Zhao, Jing Huang, Zhongliang Jiang, and K. W. Samuel Au",
    venue: "IEEE RA-L 2025 · ICRA 2026 Transfer",
    doi: "10.1109/LRA.2025.3575308",
    links: [
      { label: "Paper", url: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11018411" },
      { label: "Project note", url: "/research/elastoplastic-manipulation" },
    ],
  },
  {
    year: "2023",
    title: "T1 and T2 Mapping Reconstruction Based on Conditional DDPM",
    authors: "Yansong Li, Lulu Zhao, Yun Tian, and Shifeng Zhao",
    venue: "MICCAI 2023 CMRxRecon Challenge",
    links: [
      { label: "Paper", url: "https://link.springer.com/chapter/10.1007/978-3-031-52448-6_29" },
    ],
  },
];
