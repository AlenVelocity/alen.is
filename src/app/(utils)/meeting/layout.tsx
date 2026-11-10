// page.tsx is a client component (the Cal embed), so the page's metadata is put on it from here.
export { metadata } from './metadata'

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
