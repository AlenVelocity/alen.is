/**
 * The current segment of the breadcrumb. After a page change it comes up out
 * of a blur, like something surfacing; on a direct load it is simply there.
 *
 * It used to type itself in, a letter at a time. That is how a terminal says
 * a word, and this is not a terminal any more. Before that it had a blinking
 * cursor, which was more than the nav needed.
 *
 * The entrance is CSS (`.crumb-in` in globals.css) and only runs once the body
 * has `ufo-navigated`, the class a page change leaves behind. The inner span
 * is keyed on the text, so a new segment is a new element and plays it again.
 */
export function CurrentCrumb({ text, className }: { text: string; className?: string }) {
    return (
        <span className={`inline-block whitespace-nowrap text-accent ${className ?? ''}`}>
            <span key={text} className="crumb-in inline-block">
                {text}
            </span>
        </span>
    )
}
