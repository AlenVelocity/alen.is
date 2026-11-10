/**
 * Bring the CMS rows in line with src/data/*.json, row by row.
 *
 *   pnpm cms:sync            show what would change, write nothing
 *   pnpm cms:sync --apply    write it
 *
 * The database behind this is the live one. This script is the safe way to
 * publish a copy edit: it upserts each row by id (or key) and never deletes,
 * where `pnpm cms:seed` empties every table and re-creates it. A row that is
 * in the database but not in the JSON is reported and left alone.
 *
 * Ban's overlay (src/data/ban) is not part of this: it ships with the code.
 */
import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

const prisma = new PrismaClient()
const apply = process.argv.includes('--apply')

async function readJson<T>(filename: string): Promise<T> {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data', filename), 'utf8'))
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

/** The fields of `wanted` whose value in `current` differs */
function changedFields(current: Record<string, unknown>, wanted: Record<string, unknown>): string[] {
    return Object.keys(wanted).filter((field) => !same(current[field], wanted[field]))
}

function report(table: string, id: string, fields: string[], before: Record<string, unknown> | null) {
    if (!before) {
        console.log(`  + ${table} ${id}: new row`)
        return
    }
    console.log(`  ~ ${table} ${id}: ${fields.join(', ')}`)
}

let pending = 0

async function syncExperiences() {
    const rows = await readJson<Record<string, any>[]>('experiences.json')
    const existing = new Map((await prisma.experience.findMany()).map((row) => [row.id, row]))
    for (const row of rows) {
        const data = {
            company: row.company,
            position: row.position,
            period: row.period,
            location: row.location,
            workType: row.workType ?? 'remote',
            description: row.description,
            link: row.link ?? null,
            current: row.current,
            order: row.order,
            published: row.published
        }
        const before = existing.get(row.id) ?? null
        const fields = before ? changedFields(before, data) : Object.keys(data)
        existing.delete(row.id)
        if (before && fields.length === 0) continue
        pending += 1
        report('experience', row.id, fields, before)
        if (apply)
            await prisma.experience.upsert({ where: { id: row.id }, update: data, create: { id: row.id, ...data } })
    }
    for (const id of existing.keys()) console.log(`  ? experience ${id}: in the database, not in the JSON (left alone)`)
}

async function syncProjects() {
    const rows = await readJson<Record<string, any>[]>('projects.json')
    const existing = new Map((await prisma.project.findMany()).map((row) => [row.id, row]))
    for (const row of rows) {
        const data = {
            title: row.title,
            period: row.period,
            description: row.description,
            link: row.link,
            type: row.type,
            technologies: row.technologies,
            image: row.image ?? null,
            icon: row.icon ?? null,
            featured: row.featured,
            order: row.order,
            published: row.published
        }
        const before = existing.get(row.id) ?? null
        const fields = before ? changedFields(before, data) : Object.keys(data)
        existing.delete(row.id)
        if (before && fields.length === 0) continue
        pending += 1
        report('project', row.id, fields, before)
        if (apply) await prisma.project.upsert({ where: { id: row.id }, update: data, create: { id: row.id, ...data } })
    }
    for (const id of existing.keys()) console.log(`  ? project ${id}: in the database, not in the JSON (left alone)`)
}

async function syncPersonalInfo() {
    const info = await readJson<Record<string, unknown>>('personal-info.json')
    const existing = new Map((await prisma.personalInfo.findMany()).map((row) => [row.key, row]))
    for (const [key, raw] of Object.entries(info)) {
        const data = {
            value: typeof raw === 'string' ? raw : JSON.stringify(raw),
            type: typeof raw === 'string' ? 'text' : 'json'
        }
        const before = existing.get(key) ?? null
        // JSON values are compared parsed, so key order and spacing in the stored string do not count as a change
        const unchanged =
            before &&
            before.type === data.type &&
            (data.type === 'json' ? same(JSON.parse(before.value), raw) : before.value === data.value)
        existing.delete(key)
        if (unchanged) continue
        pending += 1
        report('personal-info', key, ['value'], before)
        if (apply) {
            await prisma.personalInfo.upsert({
                where: { key },
                update: data,
                create: { key, ...data, published: true }
            })
        }
    }
    for (const key of existing.keys())
        console.log(`  ? personal-info ${key}: in the database, not in the JSON (left alone)`)
}

async function syncSocialLinks() {
    const rows = await readJson<Record<string, any>[]>('social-links.json')
    const existing = new Map((await prisma.socialLink.findMany()).map((row) => [row.id, row]))
    for (const row of rows) {
        const data = {
            name: row.name,
            url: row.url,
            icon: row.icon ?? null,
            order: row.order,
            published: row.published
        }
        const before = existing.get(row.id) ?? null
        const fields = before ? changedFields(before, data) : Object.keys(data)
        existing.delete(row.id)
        if (before && fields.length === 0) continue
        pending += 1
        report('social-link', row.id, fields, before)
        if (apply)
            await prisma.socialLink.upsert({ where: { id: row.id }, update: data, create: { id: row.id, ...data } })
    }
    for (const id of existing.keys())
        console.log(`  ? social-link ${id}: in the database, not in the JSON (left alone)`)
}

async function main() {
    console.log(apply ? 'Syncing CMS rows from src/data (writing):' : 'CMS rows that differ from src/data (dry run):')
    await syncExperiences()
    await syncProjects()
    await syncPersonalInfo()
    await syncSocialLinks()
    if (pending === 0) console.log('  nothing to do, the database matches the JSON')
    else if (apply) console.log(`Done. ${pending} row(s) written.`)
    else console.log(`${pending} row(s) would change. Run again with --apply to write them.`)
}

main()
    .catch((error) => {
        console.error('Sync failed:', error)
        process.exitCode = 1
    })
    .finally(() => prisma.$disconnect())
