/**
 * Ban's stamp, on his own sheet. Where Alen's home page has the ship, Ban's
 * has this: a rubber stamp in his red, brought down across the corner of the
 * masthead once the page has landed.
 *
 * The filter is what makes it a stamp and not a red box. It roughens the
 * edges (a displacement by fine noise) and takes ink away in patches (a
 * second, coarser noise used as the alpha), the way a stamp that was not
 * pressed evenly prints. The slam is CSS (`.ban-stamp` in globals.css).
 *
 * Decorative, so it is hidden from screen readers: the joke is in how it
 * looks, and the sheet reads complete without it.
 */
export function BanStamp({ children = 'Not sorry' }: { children?: string }) {
    return (
        <div className="ban-stamp" aria-hidden="true">
            <svg className="absolute w-0 h-0" focusable="false">
                <defs>
                    <filter id="ban-stamp-ink" x="-6%" y="-12%" width="112%" height="124%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="grain" />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="grain"
                            scale="2.4"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="rough"
                        />
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.03 0.06"
                            numOctaves="3"
                            seed="11"
                            result="blotch"
                        />
                        {/* Alpha from the red channel of the coarse noise: solid over
                            most of it, thinning out where the noise runs high */}
                        <feColorMatrix
                            in="blotch"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.9 0 0 0 1.95"
                            result="ink"
                        />
                        <feComposite in="rough" in2="ink" operator="in" />
                    </filter>
                </defs>
            </svg>
            <div className="ban-stamp-mark">{children}</div>
        </div>
    )
}
