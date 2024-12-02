import Image from 'next/image'

export const metadata = {
    title: 'Cool',
    description: 'Am I?'
}

export default function Cool() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            <Image src="/rinu-cool.webp" alt="Rinu Cool" width={300} height={300} className="rounded-lg" priority />
            <p className="text-xl font-medium text-muted-foreground">am I?</p>
        </div>
    )
}
