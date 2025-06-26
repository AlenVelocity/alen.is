import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'src/data', filename)
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

async function migrateExperiences() {
  console.log('🔄 Migrating experiences...')
  
  const experiences = await readJsonFile<any[]>('experiences.json')
  
  // Clear existing experiences
  await prisma.experience.deleteMany()
  
  // Insert new experiences
  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        id: exp.id,
        company: exp.company,
        position: exp.position,
        period: exp.period,
        location: exp.location,
        description: exp.description,
        current: exp.current,
        order: exp.order,
        published: exp.published,
      }
    })
  }
  
  console.log(`✅ Migrated ${experiences.length} experiences`)
}

async function migrateProjects() {
  console.log('🔄 Migrating projects...')
  
  const projects = await readJsonFile<any[]>('projects.json')
  
  // Clear existing projects
  await prisma.project.deleteMany()
  
  // Insert new projects
  for (const project of projects) {
    await prisma.project.create({
      data: {
        id: project.id,
        title: project.title,
        period: project.period,
        description: project.description,
        link: project.link,
        type: project.type,
        technologies: project.technologies,
        featured: project.featured,
        order: project.order,
        published: project.published,
        image: project.image,
        icon: project.icon,
      }
    })
  }
  
  console.log(`✅ Migrated ${projects.length} projects`)
}

async function migratePersonalInfo() {
  console.log('🔄 Migrating personal info...')
  
  const personalInfo = await readJsonFile<Record<string, any>>('personal-info.json')
  
  // Clear existing personal info
  await prisma.personalInfo.deleteMany()
  
  // Insert personal info as key-value pairs
  for (const [key, value] of Object.entries(personalInfo)) {
    await prisma.personalInfo.create({
      data: {
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        type: typeof value === 'string' ? 'text' : 'json',
        published: true,
      }
    })
  }
  
  console.log(`✅ Migrated ${Object.keys(personalInfo).length} personal info items`)
}

async function migrateSocialLinks() {
  console.log('🔄 Migrating social links...')
  
  const socialLinks = await readJsonFile<any[]>('social-links.json')
  
  // Clear existing social links
  await prisma.socialLink.deleteMany()
  
  // Insert new social links
  for (const link of socialLinks) {
    await prisma.socialLink.create({
      data: {
        id: link.id,
        name: link.name,
        url: link.url,
        icon: link.icon,
        order: link.order,
        published: link.published,
      }
    })
  }
  
  console.log(`✅ Migrated ${socialLinks.length} social links`)
}

async function main() {
  try {
    console.log('🚀 Starting CMS data migration...')
    
    await migrateExperiences()
    await migrateProjects()
    await migratePersonalInfo()
    await migrateSocialLinks()
    
    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 