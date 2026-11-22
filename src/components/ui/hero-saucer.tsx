import { SaucerShip } from './saucer'

/**
 * The ship, parked at the top of the home page with its beam on and the
 * contact links hanging in it.
 *
 * It is the same drawing as the ship that changes the page (SaucerShip), and
 * on this page it is the same ship: when you leave, this one lifts off and
 * does the abducting, and when you come back it flies down and parks here
 * again (ufo-abduction.tsx measures `.hero-saucer-ship` to do that, and the
 * `ufo-hero-away` rules in globals.css hide this copy while the flying one is
 * out). An earlier version was a glassy, lit-up thing of its own. It looked
 * like a different ship from the one that then arrived and took it away.
 *
 * Two things move, both slowly: it bobs, and motes drift up the beam. Each is
 * a transform or an opacity on its own layer. Decorative: the links in the
 * beam are the content.
 */
export function HeroSaucer({ className }: { className?: string }) {
    return (
        <div className={`hero-saucer ${className ?? ''}`} aria-hidden="true">
            {/* The beam. The blur is on the outside, the cone is cut on the
                inside: a filter is applied before a clip, so one element
                could not have a soft edge and a cone shape at once */}
            <div className="hero-saucer-beam">
                <div />
            </div>
            {/* Motes being drawn up the beam */}
            <div className="hero-saucer-motes">
                <span />
                <span />
                <span />
                <span />
            </div>

            {/* Brighter light, for when "person" gives itself away */}
            <div className="hero-saucer-flare" />
            <div className="hero-saucer-ship">
                <SaucerShip className="w-full h-auto" />
            </div>
        </div>
    )
}
