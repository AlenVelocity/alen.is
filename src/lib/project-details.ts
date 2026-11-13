import details from '@/data/project-details.json'

/**
 * What the projects page knows about a project beyond its CMS row.
 *
 * The row (title, description, link, stack) lives in the database and
 * src/data/projects.json. These extras ship with the code, keyed by project
 * id, the same way Ban's overlay does, so adding a detail never needs a
 * schema change. A project with no entry here simply has none.
 *
 * The numbers in `facts` are hand-copied from GitHub and npm and were last
 * read on 14 November 2026. They are rounded on purpose, so they stay true
 * for a while, but they do go stale: refresh them when you touch this file.
 */
export interface ProjectDetails {
    /** The source, when the main link goes to a live site or a package page */
    repo?: string
    /** Short hard facts: stars, downloads, commits */
    facts?: string[]
    /** A post on this site about how it was made */
    writeup?: string
    /** The site it lived on is gone, so the title is not a link */
    offline?: boolean
}

const all = details as Record<string, ProjectDetails>

export function projectDetails(id: string): ProjectDetails {
    return all[id] ?? {}
}
