import { LinkButton } from "@/components/ui/link-button"
import { PageTransition } from "@/components/ui/page-transition"
import { DiscordCopy } from "@/components/ui/discord-copy"
import { Signature } from "@/components/ui/signature"

export default function Home() {
  return (
    <PageTransition>
      <div className="container py-12 max-w-4xl">
        <section className="space-y-6 pb-4 pt-6 md:pb-12 md:pt-10 lg:py-16">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Hi, I'm Alen
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                I build <LinkButton href="/cool" className="text-lg">cool</LinkButton> stuff.
              </p>
              <div className="flex gap-4">

                <LinkButton href="mailto:alenyohannan71@gmail.com">Email</LinkButton>
                <LinkButton href="https://www.linkedin.com/in/alen-%F0%9F%8E%B6-yohannan-6794a81ba/" target="_blank">LinkedIn</LinkButton>
                <LinkButton href="https://github.com/AlenVelocity" target="_blank">GitHub</LinkButton>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-8 border-muted" />
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
          <p className="text-muted-foreground">
            I mostly work on web applications, AI related projects, and cloud infrastructure. 
            I would say I'm proficient in TS (both server and client w/ NextJS and Vue), Rust, anyhing LLMs and Transformers related, AWS and GCP.
            I'm currently working as an Engineer at <LinkButton href="https://frappe.io" target="_blank" className="text-base">Frappe</LinkButton>, in the <LinkButton href="https://frappe.cloud" target="_blank" className="text-base">Frappe Cloud</LinkButton> team.
          </p>
          <p className="text-muted-foreground">
            As for my personal life, I'm a huge fan of video games. If I'm not working, I'd be playing some <LinkButton href="https://en.wikipedia.org/wiki/Role-playing_video_game#Japanese_role-playing_games" target="_blank" className="text-base">JRPG</LinkButton>, <LinkButton href="https://overwatch.blizzard.com" target="_blank" className="text-base">Overwatch</LinkButton> or listening to <LinkButton href="https://en.wikipedia.org/wiki/Sumika_(band)" target="_blank" className="text-base">sumika</LinkButton>, or all of them at the same time (don't ask me how or why).
            I'm currently playing <LinkButton href="https://www.atlus.com/smt5v/" target="_blank" className="text-base">SMTV:V</LinkButton> if you're interested.
          </p>
          <div className="flex justify-start mt-6 mb-2 pr-4">
            <Signature name="Alen" />
          </div>
        </section>

        <hr className="my-8 border-muted" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
          <div className="space-y-2 text-muted-foreground">
            The easiest way to reach me is via <LinkButton href="https://wa.me/919744375687" target="_blank" className="text-base">Whatsapp</LinkButton> or <DiscordCopy username="notalen" className="text-base">Discord</DiscordCopy>.
            Otherwise, you can reach me via <LinkButton href="mailto:alenyohannan71@gmail.com" className="text-base">email</LinkButton>.
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
