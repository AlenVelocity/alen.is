import { PrismaClient } from '@prisma/client'
import { Experience, Project, SocialLink } from '@prisma/client'
import { PersonalInfo } from '@/types/cms'

const prisma = new PrismaClient()

// Database-based CMS functions (alternative to JSON-based cms.ts)

// Get all experiences from database

type RT<T> = Omit<T, 'createdAt' | 'updatedAt'>

export async function getExperiencesFromDB(): Promise<RT<Experience>[]> {
  const experiences = await prisma.experience.findMany({
    where: { published: true },
    orderBy: { order: 'asc' }
  })
  
  return experiences.map(exp => ({
    id: exp.id,
    company: exp.company,
    position: exp.position,
    period: exp.period,
    location: exp.location,
    description: exp.description,
    current: exp.current,
    order: exp.order,
    published: exp.published
  }))
}

// Get all projects from database
export async function getProjectsFromDB(): Promise<RT<Project>[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' }
  })
    
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    period: project.period,
    description: project.description,
    link: project.link,
    type: project.type,
    image: project.image,
    icon: project.icon,
    technologies: project.technologies,
    featured: project.featured,
    order: project.order,
    published: project.published
  }))
}

// Get featured projects from database
export async function getFeaturedProjectsFromDB(): Promise<RT<Project>[]> {
  const projects = await getProjectsFromDB()
  return projects.filter(project => project.featured)
}

// Get personal info from database
export async function getPersonalInfoFromDB(): Promise<PersonalInfo> {
  const items = await prisma.personalInfo.findMany({
    where: { published: true }
  })
  
  const personalInfo: any = {}
  
  for (const item of items) {
    if (item.type === 'json') {
      personalInfo[item.key] = JSON.parse(item.value)
    } else {
      personalInfo[item.key] = item.value
    }
  }
  
  return personalInfo as PersonalInfo
}

// Get social links from database
export async function getSocialLinksFromDB(): Promise<RT<SocialLink>[]> {
  const links = await prisma.socialLink.findMany({
    where: { published: true },
    orderBy: { order: 'asc' }
  })
  
  return links.map(link => ({
    id: link.id,
    name: link.name,
    url: link.url,
    icon: link.icon || '',
    order: link.order,
    published: link.published
  }))
}

// Get experience by ID from database
export async function getExperienceByIdFromDB(id: string): Promise<RT<Experience> | null> {
  const experience = await prisma.experience.findUnique({
    where: { id, published: true }
  })
  
  if (!experience) return null
  
  return {
    id: experience.id,
    company: experience.company,
    position: experience.position,
    period: experience.period,
    location: experience.location,
    description: experience.description,
    current: experience.current,
    order: experience.order,
    published: experience.published
  }
}

// Get project by ID from database
export async function getProjectByIdFromDB(id: string): Promise<RT<Project> | null> {
  const project = await prisma.project.findUnique({
    where: { id, published: true }
  })
  
  if (!project) return null
  
  return {
    id: project.id,
    title: project.title,
    period: project.period,
    description: project.description,
    link: project.link,
    type: project.type,
    image: project.image,
    icon: project.icon,
    technologies: project.technologies,
    featured: project.featured,
    order: project.order,
    published: project.published
  }
}

// Get all CMS data from database
export async function getAllCMSDataFromDB() {
  const [experiences, projects, personalInfo, socialLinks] = await Promise.all([
    getExperiencesFromDB(),
    getProjectsFromDB(),
    getPersonalInfoFromDB(),
    getSocialLinksFromDB()
  ])
  
  return {
    experiences,
    projects,
    personalInfo,
    socialLinks
  }
}

// Cleanup function
export async function disconnectDB() {
  await prisma.$disconnect()
} 