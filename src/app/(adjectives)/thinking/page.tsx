import { PageTransition } from "@/components/ui/page-transition";
import Image from "next/image";

export default function Thinking() {
    return <PageTransition>
        <div className="flex flex-col items-center justify-center gap-8 py-12 pt-24">
            <Image 
                src="/thinking.gif" 
                alt="Thinking" 
                width={500} 
                height={500}
                className="md:max-w-[500px] max-w-[250px] h-auto"
                priority
            />
        </div>
    </PageTransition>
}
