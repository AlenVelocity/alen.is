export default function AdjectivesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 top-20 overflow-hidden flex items-center justify-center">
            {children}
        </div>
    )
}
