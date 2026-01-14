import Image from "next/image"
import { Metadata } from "next"
import { CenteredPage } from "@/components/ui/centered-page"

export const metadata: Metadata = {
    title: 'thinking',
    description: 'Thinking about stuff'
}

export default function Thinking() {
    return (
        <CenteredPage>
            <Image 
                src="/thinking.gif" 
                alt="Thinking" 
                width={400} 
                height={400}
                className="max-w-[250px] md:max-w-[400px] h-auto rounded-2xl"
                priority
            />
        </CenteredPage>
    )
}
