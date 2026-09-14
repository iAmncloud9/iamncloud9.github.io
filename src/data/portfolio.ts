export type BlogLanguage = "en" | "vi";

export type BlogContent = {
  title: string;
  readTime: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
};

export type BlogPost = {
  slug: string;
  date: string;
  tags: string[];
  translations: Record<BlogLanguage, BlogContent>;
};

export type Experience = {
  organization: string;
  startDate: string;
  endDate: string;
  role: string;
  description: string;
  highlights: string[];
  current: boolean;
};

/**
 * Files exposed by the virtual terminal.
 * Add future static filenames here once; ls, tree, and path autocomplete all
 * derive their entries from this registry. Blog files are derived from blogs.
 */
export const portfolioFiles = {
  information: ["profile.txt"],
  experiences: ["career.tree"],
  contact: ["socials.txt"],
  achievements: ["pwned.txt", "certifications.txt"],
  path: ["journey.tree"],
} as const;

/** Files available directly under the virtual root directory. */
export const rootFiles = {
  "angel.txt": {
    content: "aWFtbmNsb3VkOXtINHYzX0BfOTAwZF9kNHlfISEhfQ==",
    link: null,
  },
  "devil.txt": {
    content: "You found my secret. Continue ",
    link: {
      label: "here",
      href: "https://youtu.be/dQw4w9WgXcQ?si=MYGaL_W9A68wDQa1",
    },
  },
} as const;

// TODO: Replace every value marked [PLACEHOLDER] with your real information.
export const profile = {
  name: "NGUYEN VAN CHIEN",
  alias: "iamncloud9",
  role: "Cybersecurity Enthusiast / Penetration Tester / Web Security",
  location: "Hanoi, Vietnam",
  workplace: "Viettel Software (VTIT)",
  bio: "I break things to understand them, then build them back safer.",
};

export const contacts = [
  { label: "email", value: "vanchien.work@gmail.com", href: "mailto:vanchien.work@gmail.com" },
  { label: "github", value: "github.com/iAmncloud9", href: "https://github.com/iAmncloud9" },
  { label: "linkedin", value: "linkedin.com/in/iamncloud9", href: "https://www.linkedin.com/in/iamncloud9/" },
  { label: "facebook", value: "[SECURE]", href: "https://facebook.com" },
  { label: "x", value: "[SECURE]", href: "https://x.com" },
];

export const journey = [
  {
    period: "PAST",
    title: "HCMUS - Ho Chi Minh University of Science",
    description: "[LEARNING] Information Technology · Information Security · Graduated",
    current: false,
  },
  {
    period: "NOW",
    title: "Penetration Tester / Security Engineer",
    description: "[WORKING] Pentesting · Building Security Systems · Building Automation Security Tools",
    current: true,
  },
  {
    period: "FUTURE",
    title: "Become Expert in Cybersecurity",
    description: "[DEVELOPING] Low-Level Security · System Security · Security Architecture",
    current: false,
  },
];

// TODO: Replace these sample entries with your real work history.
// Keep newest/current experience first for easier scanning in the terminal.
export const experiences: Experience[] = [
  {
    organization: "CYEYES",
    startDate: "10/2025",
    endDate: "Now",
    role: "Developer",
    description: "Researching and developing AI-first systems for cybersecurity.",
    highlights: [
      "[RESEARCH] Exploring practical applications of AI in cybersecurity.",
      "[BUILD] Contributing to multi-agent systems that support and automate penetration-testing workflows.",
    ],
    current: true,
  },
  {
    organization: "Viettel Digital Services - VDS",
    startDate: "05/2026",
    endDate: "08/2026",
    role: "Cybersecurity Trainee",
    description: "Developed a foundation in cybersecurity while building AI-assisted capabilities for blockchain penetration testing and security audits.",
    highlights: [
      "[LEARN] Built a strong foundation in core cybersecurity concepts and industry practices.",
      "[RESEARCH] Analyzed common vulnerabilities in blockchain systems, with a focus on smart contracts and the EVM.",
      "[BUILD] Developed AI-assisted security capabilities for blockchain penetration testing and audits.",
    ],
    current: true,
  },
  {
    organization: "Viettel Software - VTIT",
    startDate: "08/2026",
    endDate: "Now",
    role: "Security Engineer",
    description: "Building, supporting, and maintaining security systems across the organization.",
    highlights: [
      "[RESEARCH] Reviewing and analyzing vulnerabilities in Secure Workspace, a platform for hybrid work, and developing remediations for identified security issues.",
      "[RESEARCH] Designing a custom security solution for the internal EDR platform.",
      "[BUILD] Contributing to the development of internal security systems.",
    ],
    current: false,
  },
];

export const blogs: BlogPost[] = [
  {
    slug: "hello-world",
    date: "2026-09-01",
    tags: ["personal", "terminal", "web"],
    translations: {
      en: {
        title: "Hello, World — Why I Built This Terminal",
        readTime: "3 min read",
        summary: "A short introduction to this portfolio and the ideas behind it.",
        sections: [
          {
            heading: "The beginning",
            body: [
              "[PLACEHOLDER] Tell readers how your interest in technology and security began.",
              "This terminal is more than a visual theme: it is a small, interactive map of the things I learn, build, and care about.",
            ],
          },
          {
            heading: "What comes next",
            body: [
              "[PLACEHOLDER] Share what you are learning now and what you plan to publish here.",
            ],
          },
        ],
      },
      vi: {
        title: "Xin chào, thế giới — Vì sao tôi xây dựng terminal này",
        readTime: "3 phút đọc",
        summary: "Một lời giới thiệu ngắn về portfolio này và những ý tưởng đằng sau nó.",
        sections: [
          {
            heading: "Khởi đầu",
            body: [
              "[PLACEHOLDER] Hãy chia sẻ cách bạn bắt đầu quan tâm đến công nghệ và an toàn thông tin.",
              "Terminal này không chỉ là một giao diện trực quan; nó là một bản đồ tương tác nhỏ về những điều tôi học, xây dựng và quan tâm.",
            ],
          },
          {
            heading: "Điều gì sẽ đến tiếp theo",
            body: [
              "[PLACEHOLDER] Hãy chia sẻ những gì bạn đang học và dự định xuất bản tại đây.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "first-box-pwned",
    date: "2026-08-20",
    tags: ["ctf", "writeup", "learning"],
    translations: {
      en: {
        title: "Notes From My First Pwned Box",
        readTime: "6 min read",
        summary: "Lessons learned from enumeration, exploitation, and documenting the path.",
        sections: [
          {
            heading: "Enumeration first",
            body: [
              "[PLACEHOLDER] Describe the lab or CTF box without exposing flags or restricted solutions.",
              "The useful lesson was simple: patient enumeration consistently beats random exploitation.",
            ],
          },
          {
            heading: "Takeaways",
            body: [
              "[PLACEHOLDER] Add your technical findings, tools used, and remediation notes.",
            ],
          },
        ],
      },
      vi: {
        title: "Ghi chép từ cỗ máy đầu tiên tôi khai thác thành công",
        readTime: "6 phút đọc",
        summary: "Những bài học từ quá trình enumeration, khai thác và ghi lại toàn bộ hướng tiếp cận.",
        sections: [
          {
            heading: "Enumeration là bước đầu tiên",
            body: [
              "[PLACEHOLDER] Hãy mô tả bài lab hoặc máy CTF mà không tiết lộ flag hay lời giải bị hạn chế.",
              "Bài học quan trọng rất đơn giản: enumeration kiên nhẫn luôn hiệu quả hơn việc thử khai thác một cách ngẫu nhiên.",
            ],
          },
          {
            heading: "Bài học rút ra",
            body: [
              "[PLACEHOLDER] Hãy bổ sung các phát hiện kỹ thuật, công cụ đã sử dụng và khuyến nghị khắc phục.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "learning-roadmap",
    date: "2026-08-08",
    tags: ["roadmap", "career", "security"],
    translations: {
      en: {
        title: "My Cybersecurity Learning Roadmap",
        readTime: "4 min read",
        summary: "The past, present, and future milestones on my security journey.",
        sections: [
          {
            heading: "Building foundations",
            body: [
              "[PLACEHOLDER] Add the networking, Linux, programming, and security fundamentals you have completed.",
            ],
          },
          {
            heading: "The road ahead",
            body: [
              "[PLACEHOLDER] Add the role you are aiming for and the skills you want to develop next.",
            ],
          },
        ],
      },
      vi: {
        title: "Lộ trình học an toàn thông tin của tôi",
        readTime: "4 phút đọc",
        summary: "Những cột mốc trong quá khứ, hiện tại và tương lai trên hành trình an toàn thông tin của tôi.",
        sections: [
          {
            heading: "Xây dựng nền tảng",
            body: [
              "[PLACEHOLDER] Hãy bổ sung những kiến thức nền tảng về mạng, Linux, lập trình và an toàn thông tin mà bạn đã hoàn thành.",
            ],
          },
          {
            heading: "Chặng đường phía trước",
            body: [
              "[PLACEHOLDER] Hãy bổ sung vai trò bạn đang hướng tới và những kỹ năng muốn phát triển tiếp theo.",
            ],
          },
        ],
      },
    },
  },
];

export const achievements = {
  pwned: [
    "[PLACEHOLDER] Hack The Box / TryHackMe machine or rank",
    "[PLACEHOLDER] CTF competition and result",
    "[PLACEHOLDER] Security research milestone",
  ],
  certifications: [
    "[TheSecOps Group] CAP — Verified, year",
    "[HackTheBox] CWES ~ Certificate Web Exploitation Specialist — On going, 2026",
    "[HackTheBox] CPTS — Certified Penetration Tester Specialist — On going, 2027",
    "[PortSwiger]",
    "[OffSec] OSCP — Offensive Security Certified Professional — Planned, 2027",
    "[OffSec] OSWE — Offensive Security Web Expert — Planned, 2027/2028",
  ],
};
