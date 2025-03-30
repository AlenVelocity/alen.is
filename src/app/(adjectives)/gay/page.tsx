import { api } from '@/trpc/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gay',
    description: 'Am I gay?'
}

export default async function Gay() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 py-12 pt-24">
            <div className="flex flex-col items-center mb-8">
                <div className="flex w-full justify-center">
                    <div className="flex flex-col w-[120px]">
                        <div className="w-full h-2 bg-[#D60270] rounded-tl-md"></div>
                        <div className="w-full h-2 bg-[#9B4F96]"></div>
                        <div className="w-full h-2 bg-[#0038A8] rounded-bl-md"></div>
                    </div>
                    <div className="flex flex-col w-[120px]">
                        <div className="w-full h-2 bg-[#FF218C] rounded-tr-md"></div>
                        <div className="w-full h-2 bg-[#FFD800]"></div>
                        <div className="w-full h-2 bg-[#21B1FF] rounded-br-md"></div>
                    </div>
                </div>
                <div className="mt-6 text-2xl font-bold">
                    <span className="bg-gradient-to-r from-[#D60270] via-[#9B4F96] to-[#0038A8] bg-clip-text text-transparent">
                        I don't{' '}
                    </span>
                    <span className="bg-gradient-to-r from-[#FF218C] via-[#FFD800] to-[#21B1FF] bg-clip-text text-transparent">
                        discriminate
                    </span>
                </div>
            </div>
        </div>
    )
}
