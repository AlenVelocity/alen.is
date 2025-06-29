import { PrismaClient } from '@prisma/client'
import { Experience, Project, SocialLink } from '@prisma/client'
import { PersonalInfo } from '@/types/cms'
import { Effect } from 'effect'

const prisma = new PrismaClient()

// Database-based CMS functions (alternative to JSON-based cms.ts)

type RT<T> = Omit<T, 'createdAt' | 'updatedAt'>

// Database errors
class DatabaseError extends Error {
  readonly _tag = 'DatabaseError'
}

// Get all experiences from database
export const getExperiencesFromDB = Effect.tryPromise({
  try: async (): Promise<RT<Experience>[]> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch experiences: ${error}`)
})

// Get all projects from database
export const getProjectsFromDB = Effect.tryPromise({
  try: async (): Promise<RT<Project>[]> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch projects: ${error}`)
})

// Get featured projects from database
export const getFeaturedProjectsFromDB = Effect.gen(function* () {
  const projects = yield* getProjectsFromDB
  return projects.filter(project => project.featured)
})

// Get personal info from database
export const getPersonalInfoFromDB = Effect.tryPromise({
  try: async (): Promise<PersonalInfo> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch personal info: ${error}`)
})

// Get social links from database
export const getSocialLinksFromDB = Effect.tryPromise({
  try: async (): Promise<RT<SocialLink>[]> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch social links: ${error}`)
})

// Get experience by ID from database
export const getExperienceByIdFromDB = (id: string) => Effect.tryPromise({
  try: async (): Promise<RT<Experience> | null> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch experience by ID: ${error}`)
})

// Get project by ID from database
export const getProjectByIdFromDB = (id: string) => Effect.tryPromise({
  try: async (): Promise<RT<Project> | null> => {
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
  },
  catch: (error: unknown) => new DatabaseError(`Failed to fetch project by ID: ${error}`)
})

// Get all CMS data from database
export const getAllCMSDataFromDB = Effect.gen(function* () {
  const experiences = yield* getExperiencesFromDB
  const projects = yield* getProjectsFromDB
  const personalInfo = yield* getPersonalInfoFromDB
  const socialLinks = yield* getSocialLinksFromDB
  
  return {
    experiences,
    projects,
    personalInfo,
    socialLinks
  }
})

// Cleanup function
export const disconnectDB = Effect.tryPromise({
  try: async () => {
    await prisma.$disconnect()
  },
  catch: (error: unknown) => new DatabaseError(`Failed to disconnect database: ${error}`)
})

// Helper functions to run effects
export const runGetExperiences = () => Effect.runPromise(getExperiencesFromDB)
export const runGetProjects = () => Effect.runPromise(getProjectsFromDB)
export const runGetFeaturedProjects = () => Effect.runPromise(getFeaturedProjectsFromDB)
export const runGetPersonalInfo = () => Effect.runPromise(getPersonalInfoFromDB)
export const runGetSocialLinks = () => Effect.runPromise(getSocialLinksFromDB)
export const runGetExperienceById = (id: string) => Effect.runPromise(getExperienceByIdFromDB(id))
export const runGetProjectById = (id: string) => Effect.runPromise(getProjectByIdFromDB(id))
export const runGetAllCMSData = () => Effect.runPromise(getAllCMSDataFromDB)
export const runDisconnectDB = () => Effect.runPromise(disconnectDB) 