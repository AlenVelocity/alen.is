import type { PersonalInfo } from '@/types/cms'
import banExperiences from '@/data/ban/experiences.json'
import banProjects from '@/data/ban/projects.json'
import banPersonalInfo from '@/data/ban/personal-info.json'

/**
 * Ban's side of the CMS content.
 *
 * Ban does not get his own copy of the data. He gets an overlay: for each
 * experience or project id, only the fields he tells differently (his bullets,
 * his description, sometimes his job title). Dates, companies, links and stacks
 * are facts and stay Alen's. An entry Ban has nothing to say about yet shows
 * Alen's words, so adding a job only ever needs one edit to stay correct.
 *
 * The overlay lives in src/data/ban/*.json and never touches the database.
 */

type ExperienceOverlay = { position?: string; description?: string[] }
type ProjectOverlay = { description?: string }

/** The same jobs, as Ban tells them. */
export function asBanExperiences<T extends { id: string; position: string; description: string[] }>(
    experiences: T[]
): T[] {
    const overlay = banExperiences as Record<string, ExperienceOverlay>
    return experiences.map((experience) => ({ ...experience, ...(overlay[experience.id] ?? {}) }))
}

/** The same projects, as Ban tells them. */
export function asBanProjects<T extends { id: string; description: string }>(projects: T[]): T[] {
    const overlay = banProjects as Record<string, ProjectOverlay>
    return projects.map((project) => ({ ...project, ...(overlay[project.id] ?? {}) }))
}

/**
 * Ban's hero, about and contact text over Alen's. Same keys as
 * personal-info.json and the same link syntax. His `hero_title` may also strike
 * a word out with `~~word~~`; only the home page reads that.
 */
export function asBanPersonalInfo(info: PersonalInfo): PersonalInfo {
    return { ...info, ...(banPersonalInfo as Partial<PersonalInfo>) }
}
