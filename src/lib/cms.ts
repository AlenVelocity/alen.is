import { promises as fs } from 'fs'
import path from 'path'
import { Experience, Project, PersonalInfo, SocialLink } from '@/types/cms'

const DATA_DIR = path.join(process.cwd(), 'src/data')

// Cache for static generation
let dataCache: {
  experiences?: Experience[]
  projects?: Project[]
  personalInfo?: PersonalInfo
  socialLinks?: SocialLink[]
} = {}

// Generic function to read JSON files
async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename)
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

// Get all experiences
export async function getExperiences(): Promise<Experience[]> {
  if (dataCache.experiences) {
    return dataCache.experiences
  }
  
  const experiences = await readJsonFile<Experience[]>('experiences.json')
  const published = experiences
    .filter(exp => exp.published)
    .sort((a, b) => a.order - b.order)
  
  dataCache.experiences = published
  return published
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  if (dataCache.projects) {
    return dataCache.projects
  }
  
  const projects = await readJsonFile<Project[]>('projects.json')
  const published = projects
    .filter(project => project.published)
    .sort((a, b) => a.order - b.order)
  
  dataCache.projects = published
  return published
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.featured)
}

// Get personal info
export async function getPersonalInfo(): Promise<PersonalInfo> {
  if (dataCache.personalInfo) {
    return dataCache.personalInfo
  }
  
  const personalInfo = await readJsonFile<PersonalInfo>('personal-info.json')
  dataCache.personalInfo = personalInfo
  return personalInfo
}

// Get social links
export async function getSocialLinks(): Promise<SocialLink[]> {
  if (dataCache.socialLinks) {
    return dataCache.socialLinks
  }
  
  const socialLinks = await readJsonFile<SocialLink[]>('social-links.json')
  const published = socialLinks
    .filter(link => link.published)
    .sort((a, b) => a.order - b.order)
  
  dataCache.socialLinks = published
  return published
}

// Get a specific experience by ID
export async function getExperienceById(id: string): Promise<Experience | null> {
  const experiences = await getExperiences()
  return experiences.find(exp => exp.id === id) || null
}

// Get a specific project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find(project => project.id === id) || null
}

// Clear cache (useful for development)
export function clearCache(): void {
  dataCache = {}
}

// Get all data for static generation
export async function getAllCMSData() {
  const [experiences, projects, personalInfo, socialLinks] = await Promise.all([
    getExperiences(),
    getProjects(),
    getPersonalInfo(),
    getSocialLinks()
  ])
  
  return {
    experiences,
    projects,
    personalInfo,
    socialLinks
  }
} 