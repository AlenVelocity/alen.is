export interface Experience {
  id: string
  company: string
  position: string
  period: string
  location: string
  workType: 'remote' | 'onsite' | 'hybrid'
  description: string[]
  current: boolean
  order: number
  published: boolean
  link: string
}

export interface Project {
  id: string
  title: string
  period: string
  description: string
  link: string
  type: string
  technologies: string[]
  featured: boolean
  order: number
  published: boolean
}

export interface PersonalInfo {
  hero_title: string
  hero_description: string
  about_me_paragraph_1: string
  about_me_paragraph_2: string
  contact_description: string
  signature_name: string
  meta_title: string
  meta_description: string
  job_title: string
  company: string
  skills: string[]
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  order: number
  published: boolean
}

export interface CMSData {
  experiences: Experience[]
  projects: Project[]
  personalInfo: PersonalInfo
  socialLinks: SocialLink[]
} 