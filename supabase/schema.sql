-- ================================================================
-- Portfolio Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ================================================================

-- ---------------------------------------------------------------
-- 1. PROFILE
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL DEFAULT 'Muhamad Reza Muktasib',
  short_name  text        DEFAULT 'Reza',
  tagline     text        DEFAULT 'Fullstack Engineer · Software Engineer',
  bio         text,
  avatar_url  text,
  email       text        DEFAULT 'reza.muktasib@gmail.com',
  github_url  text        DEFAULT 'https://github.com/reza1290',
  linkedin_url text       DEFAULT 'https://linkedin.com/in/m-rezamuktasib',
  location    text        DEFAULT 'Indonesia 🇮🇩',
  toeic       text        DEFAULT '840',
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Auth write profile" ON profile FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO profile (name, short_name, tagline, bio, email, github_url, linkedin_url, location, toeic)
VALUES (
  'Muhamad Reza Muktasib',
  'Reza',
  'Fullstack Engineer · Software Engineer',
  'Experienced Fullstack Engineer building and maintaining scalable web applications using JavaScript, Python, PHP, Go, Java, Laravel, and Next.js. Proven in cloud (AWS, GCP) and Docker deployments along with CI/CD pipeline implementation. I create responsive UI/UX from Figma designs and apply Agile Development and Product Owner principles for effective, goal-aligned project delivery.',
  'reza.muktasib@gmail.com',
  'https://github.com/reza1290',
  'https://linkedin.com/in/m-rezamuktasib',
  'Indonesia 🇮🇩',
  '840'
) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 2. SKILLS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  category    text    CHECK (category IN ('language', 'framework', 'tool')),
  icon_url    text,
  proficiency int     CHECK (proficiency BETWEEN 0 AND 100) DEFAULT 80,
  sort_order  int     DEFAULT 0
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Auth write skills" ON skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO skills (name, category, proficiency, sort_order) VALUES
  ('JavaScript',   'language',  95, 1),
  ('TypeScript',   'language',  85, 2),
  ('PHP',          'language',  88, 3),
  ('Python',       'language',  78, 4),
  ('Go (Golang)',  'language',  72, 5),
  ('Java',         'language',  75, 6),
  ('C (STM32)',    'language',  65, 7),
  ('React',        'framework', 92, 8),
  ('Next.js',      'framework', 90, 9),
  ('Laravel',      'framework', 90, 10),
  ('Node.js',      'framework', 87, 11),
  ('Flutter',      'framework', 78, 12),
  ('Remix',        'framework', 72, 13),
  ('GraphQL',      'framework', 70, 14),
  ('Docker',       'tool',      85, 15),
  ('AWS',          'tool',      80, 16),
  ('GCP',          'tool',      72, 17),
  ('PostgreSQL',   'tool',      85, 18),
  ('MongoDB',      'tool',      82, 19),
  ('Firebase',     'tool',      78, 20),
  ('CI/CD',        'tool',      83, 21),
  ('WebRTC',       'tool',      75, 22)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 3. JOURNEY
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text    NOT NULL,
  description text,
  year        int,
  end_year    int,
  type        text    CHECK (type IN ('education', 'work', 'milestone')),
  sort_order  int     DEFAULT 0
);

ALTER TABLE journey ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read journey" ON journey FOR SELECT USING (true);
CREATE POLICY "Auth write journey" ON journey FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO journey (title, description, year, end_year, type, sort_order) VALUES
  ('Associate Degree · PENS', 'Enrolled in Informatics Engineering at Politeknik Elektronika Negeri Surabaya. Graduated with a GPA of 3.94/4.00 — top of class.', 2022, 2025, 'education', 1),
  ('Freelance Web Developer · Cipta Kode', 'Completed 10+ freelance projects using React, Laravel, Python, and AI technologies — delivering tailored web solutions for diverse client needs.', 2022, null, 'work', 2),
  ('Web Developer · PT. Digital Solusi Master', 'Maintained Diakademik, used by 2,000+ students. Converted Figma designs to Tailwind CSS interfaces achieving 95% user satisfaction score.', 2023, 2024, 'work', 3),
  ('Product Owner & Flutter Dev · BudgetIn App', 'Led a 5-person team using Agile methodologies to develop and launch the BudgetIn App — now on the Play Store with a 4.8+ star rating.', 2024, 2024, 'milestone', 4),
  ('Backend + DevOps · Pens MyToefl App', 'Built a Duolingo-style TOEFL quiz app with a 9-person team. Achieved 50ms average response time using Laravel + MongoDB + Docker microservices.', 2024, 2024, 'work', 5),
  ('IISMA Scholar · Hanyang University', 'Awarded the prestigious IISMA scholarship for a student exchange at Hanyang University, South Korea. Achieved 93.3/100 GPA.', 2024, 2025, 'education', 6),
  ('Marketing & Growth · ZEP Co., Ltd', 'Grew ZEP Indonesia''s social media to 3,000+ followers in 2 months. Built automation scripts reducing manual reporting time by 80%.', 2024, 2025, 'work', 7),
  ('Backend & DevOps · Mutio App', 'Maintained the Mutio App serving 4,100 daily active users. Optimized API performance and database queries on AWS infrastructure.', 2025, null, 'work', 8),
  ('Fullstack Engineer · Exzam.id', 'Built a multi-tenant online exam platform used by teachers and lecturers. Achieved stable performance for 120+ concurrent users.', 2025, 2025, 'milestone', 9),
  ('Backend Engineer · PT Paragon × Sobat Kreasi', 'Migrated Batch Management across 24+ active warehouses for a large enterprise WMS. Built SAP integration modules for real-time synchronization.', 2025, null, 'work', 10)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 4. PROJECTS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id               uuid      DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text      NOT NULL,
  subtitle         text,
  description      text,
  long_description text,
  highlights       text[]    DEFAULT '{}',
  image_url        text,
  tech_stack       text[]    DEFAULT '{}',
  demo_url         text,
  repo_url         text,
  featured         boolean   DEFAULT false,
  sort_order       int       DEFAULT 0,
  gradient         text,
  period           text,
  role             text
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO projects (title, subtitle, description, long_description, highlights, tech_stack, demo_url, repo_url, featured, sort_order, gradient, period, role) VALUES
  (
    'Procspy',
    'Open-Source Anti-Cheating Proctoring System',
    'Procspy is an open-source automated proctoring application designed to uphold academic integrity during online assessments. Built as my final university graduation project at PENS.',
    'Procspy is a full-featured anti-cheating proctoring platform that combines a Chrome Extension, WebRTC server, and a Next.js dashboard to enable real-time monitoring during online exams. The system handles 30 concurrent users with only 20% CPU usage on a dual-core CPU — a benchmark I am particularly proud of.',
    ARRAY['Handles 30 concurrent users with only 20% CPU usage on dual-core hardware', 'Built with TypeScript + Express using Hexagonal Architecture for maintainability', 'WebRTC server using WebSockets + Mediasoup for real-time media streaming', 'Custom socket protocol for secure Chrome Extension ↔ Next.js dashboard communication', 'Open-sourced the WebRTC component as a Chrome Extension', 'Integrated as the proctoring engine for Exzam.id'],
    ARRAY['TypeScript', 'Next.js', 'MongoDB', 'WebRTC', 'Mediasoup', 'WebSockets', 'Chrome Extension', 'Express'],
    'https://docs.procspy.link',
    'https://github.com/reza1290',
    true, 1, 'linear-gradient(135deg, #1a0a3d, #4a1fa8)', 'Jun 2024 – Present', 'Fullstack Engineer (Lead)'
  ),
  (
    'Exzam.id',
    'Multi-Tenant Online Examination Platform',
    'A multi-tenant online examination platform used by elementary school teachers and university lecturers to conduct secure digital exams with automated proctoring.',
    'Exzam.id is a production SaaS product serving both school teachers and university lecturers. I built the entire frontend using React with a custom internal UI component library, and the backend with Laravel managing multi-tenant workflows. Integrated Procspy as the proctoring engine and Midtrans for payments.',
    ARRAY['Multi-tenant architecture supporting both schools and universities', 'Custom internal UI component library — reduced development time by 40%', 'Stable performance for 120+ concurrent exam users', 'Automated proctoring via Procspy integration', 'Midtrans payment gateway for subscriptions and institutional licensing', 'Subscription-based access with feature gating logic'],
    ARRAY['React', 'Laravel', 'PHP', 'MySQL', 'Midtrans', 'Procspy', 'Tailwind CSS'],
    'https://exzam.id',
    'https://github.com/reza1290',
    true, 2, 'linear-gradient(135deg, #0a2a1a, #1a7a4a)', 'Jun 2025 – Aug 2025', 'Fullstack Engineer'
  ),
  (
    'CV Evaluator',
    'AI-Powered Resume Analysis with Semantic Search',
    'An AI-powered CV evaluation application leveraging Next.js, OpenAI, LangChain, and Pinecone vector search to provide intelligent resume insights and job matching.',
    'I engineered this AI-powered tool to evaluate CVs using advanced language models. The system uses Pinecone for semantic search, OpenAI + LangChain for NLP processing, AWS S3 for file storage, and NeonDB with DrizzleORM as the database layer — all orchestrated in a clean Next.js full-stack architecture.',
    ARRAY['Semantic search using Pinecone vector database for highly relevant insights', 'OpenAI + LangChain for advanced NLP and CV analysis', 'AWS S3 for secure file storage and management', 'NeonDB (serverless Postgres) + DrizzleORM as the data layer', 'Real-time feedback on CV quality and job matching scores'],
    ARRAY['Next.js', 'OpenAI', 'LangChain', 'Pinecone', 'AWS S3', 'NeonDB', 'DrizzleORM', 'TypeScript'],
    null,
    'https://github.com/reza1290',
    true, 3, 'linear-gradient(135deg, #1a1500, #7a5a00)', 'Apr 2025 – May 2025', 'Fullstack Engineer'
  ),
  (
    'BudgetIn App',
    'Personal Finance App — Play Store 4.8★',
    'A personal budget management app built with Flutter, now live on the Play Store with a 4.8+ star rating. Led a 5-person team using Agile methodologies.',
    'As both Product Owner and lead Flutter developer, I managed the full development lifecycle of BudgetIn — from requirement gathering to Play Store deployment. I applied Scrum methodologies to ensure efficient sprint delivery and stakeholder alignment throughout.',
    ARRAY['4.8+ star rating on Google Play Store', 'Led a 5-person team as Product Owner', 'Full Agile/Scrum implementation across the development lifecycle', 'Built intuitive Flutter UI with responsive layouts', 'Successfully deployed to Play Store within the project timeline'],
    ARRAY['Flutter', 'Dart', 'Firebase', 'Agile/Scrum'],
    null,
    'https://github.com/reza1290',
    false, 4, 'linear-gradient(135deg, #1a0d2a, #6a1a9a)', 'Mar 2024 – Jun 2024', 'Product Owner & Flutter Developer'
  ),
  (
    'Pens MyToefl App',
    'Duolingo-Style TOEFL Quiz Platform',
    'A collaborative TOEFL preparation app built with a 9-person team. Features Duolingo-style leveling gameplay with a 50ms average API response time.',
    'I contributed as Backend Engineer, DevOps, and Flutter developer on this 9-person team project. The app replicates the gamified Duolingo experience for TOEFL preparation, complete with scoring, authentication, and Docker-deployed microservices on DigitalOcean.',
    ARRAY['50ms average API response time after optimization', 'Microservices architecture with Docker on DigitalOcean', 'CI/CD pipelines automating testing and deployment', 'Laravel backend for quiz service with auth + score processing', 'MongoDB for efficient TOEFL data storage and retrieval', 'Flutter UI with Duolingo-style leveling game mechanics'],
    ARRAY['Laravel', 'Flutter', 'MongoDB', 'Docker', 'DigitalOcean', 'CI/CD'],
    null,
    'https://github.com/reza1290',
    false, 5, 'linear-gradient(135deg, #001a2a, #006699)', 'Apr 2024 – Jun 2024', 'Backend Engineer & Flutter Developer'
  ),
  (
    'Warehouse Management System',
    'Enterprise WMS for PT Paragon — 24+ Warehouses',
    'Contributed to a large-scale enterprise WMS integrated with an ERP ecosystem for PT Paragon Technology. Migrated Batch Management across 24+ active warehouses.',
    'This is one of the most impactful projects I worked on — a large enterprise Warehouse Management System handling tens of thousands of monthly transactions across 24+ warehouses. I built the SAP integration modules for real-time synchronization and led the Batch Management migration.',
    ARRAY['Batch Management migration across 24+ active warehouses', 'SAP integration modules for real-time data synchronization', 'Improved traceability and inventory accuracy across all locations', 'High reliability system for tens of thousands of monthly transactions', 'Cross-functional collaboration with enterprise stakeholders'],
    ARRAY['Java', 'SAP Integration', 'Enterprise WMS', 'PostgreSQL'],
    null,
    null,
    false, 6, 'linear-gradient(135deg, #1a0a0a, #7a2020)', 'Aug 2025 – Present', 'Backend Engineer & DevOps'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 5. AWARDS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awards (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text    NOT NULL,
  org         text,
  year        int,
  icon        text,
  sort_order  int     DEFAULT 0
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read awards" ON awards FOR SELECT USING (true);
CREATE POLICY "Auth write awards" ON awards FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO awards (title, org, year, icon, sort_order) VALUES
  ('IISMA Awardee 2024', 'Hanyang University, South Korea', 2024, '🏆', 1),
  ('Silver Medal — IYSAA, WSEEC', 'International Competition', 2023, '🥈', 2),
  ('1st Place — Business Plan', 'Fasilkomfest 2023 · UPN Jawa Timur', 2023, '🥇', 3),
  ('2nd Place — IE FAIR 17th', 'ITS · Business Plan Competition', 2023, '🥈', 4),
  ('3rd Place — UI/UX Competition', 'Fasilkomfest 2023 · UPN Jawa Timur', 2023, '🥉', 5),
  ('3rd Place — Cerdas Cermat', 'SMA Awards · Jawa Pos', 2023, '🥉', 6)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 6. CERTIFICATIONS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  issuer      text,
  year        int,
  sort_order  int     DEFAULT 0
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read certs" ON certifications FOR SELECT USING (true);
CREATE POLICY "Auth write certs" ON certifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO certifications (name, issuer, year, sort_order) VALUES
  ('Next.js (JS/TS) Course', 'Udemy', 2025, 1),
  ('Golang Course', 'Udemy', 2025, 2),
  ('Docker & Kubernetes', 'Udemy', 2025, 3),
  ('Junior Web Developer', 'BNSP', 2023, 4),
  ('JavaScript Fundamental', 'Dicoding', 2023, 5),
  ('SQL Fundamental', 'Dicoding', 2023, 6),
  ('Project Management', 'Dicoding', 2023, 7),
  ('Programming Basic with C', 'Dicoding', 2023, 8)
ON CONFLICT DO NOTHING;
