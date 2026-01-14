import Image from "next/image"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'thinking',
    description: 'Thinking about stuff'
}

export default function Thinking() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
            <Image 
                src="/thinking.gif" 
                alt="Thinking" 
                width={400} 
                height={400}
                className="max-w-[250px] md:max-w-[400px] h-auto rounded-2xl"
                priority
            />
        </div>
    )
}
