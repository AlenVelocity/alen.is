'use client'

import { useEffect, useRef } from 'react'

/**
 * Where the visitor ends up after the abduction: low orbit. A full-screen GLSL
 * view — parallax starfield, drifting nebula, the odd meteor, and a planet limb
 * along the bottom edge with an atmospheric rim light.
 *
 * Raw WebGL on purpose. This is one page's set piece and doesn't justify
 * pulling a 3D library into the bundle.
 *
 * `visible` cross-fades the whole thing via a uniform rather than CSS opacity,
 * so the starfield keeps drifting while it arrives and leaves.
 */

const VERT = `
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
/** 0 = fully transparent, 1 = full orbit view */
uniform float uFade;
uniform vec3  uAccent;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

/** Parallax star layers — nearer layers are bigger, brighter and drift faster */
float starfield(vec2 p, float time) {
    float acc = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float scale = 8.0 + fi * 11.0;
        vec2 gv = p * scale + vec2(time * (0.012 + fi * 0.010) * scale, fi * 23.4);
        vec2 id = floor(gv);
        vec2 f = fract(gv) - 0.5;
        float h = hash(id + fi * 41.0);
        // Only a sparse fraction of cells hold a star
        float present = step(0.90, h);
        vec2 off = (vec2(hash(id + 3.1), hash(id + 8.7)) - 0.5) * 0.55;
        float d = length(f - off);
        float twinkle = 0.65 + 0.35 * sin(time * 1.4 + h * 60.0);
        acc += present * twinkle * smoothstep(0.055 - fi * 0.012, 0.0, d) * (1.0 - fi * 0.22);
    }
    return acc;
}

/** A meteor streaking across on its own slow cycle */
float meteor(vec2 p, float time, float seed) {
    float cycle = 9.0;
    float phase = time * 0.55 + seed * 4.7;
    float local = mod(phase, cycle);
    float idx = floor(phase / cycle);
    float prog = clamp(local / 1.1, 0.0, 1.0);
    float alive = step(local, 1.1);

    vec2 start = vec2(0.55 + hash(vec2(idx, seed)) * 0.5, 0.30 + hash(vec2(idx + 7.0, seed)) * 0.28);
    vec2 dir = normalize(vec2(-0.88, -0.48));
    vec2 head = start + dir * prog * 1.7;
    vec2 tail = head - dir * 0.18;

    vec2 pa = p - tail;
    vec2 ba = head - tail;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
    float d = length(pa - ba * h);

    // Fades in and out over its flight so it never pops
    float envelope = sin(prog * 3.14159);
    return smoothstep(0.010, 0.0, d) * h * alive * envelope;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // Deep space base — near black, faintly blue
    vec3 col = vec3(0.004, 0.010, 0.014);

    /* ── Nebula ──────────────────────────────────────────────────────── */
    vec2 nq = p * 1.5 + vec2(uTime * 0.008, uTime * 0.003);
    float n1 = fbm(nq * 2.0);
    float n2 = fbm(nq * 3.6 + 4.7);
    // Accent green bleeding into a cold violet, so it reads cosmic not swampy
    vec3 neb = mix(uAccent * 0.5, vec3(0.28, 0.12, 0.55), n2);
    col += neb * pow(n1, 3.0) * 1.1;

    /* ── Stars + meteors ─────────────────────────────────────────────── */
    float stars = starfield(p, uTime);
    col += vec3(0.85, 0.95, 1.0) * stars;
    float streaks = meteor(p, uTime, 0.0) + meteor(p, uTime, 2.3);
    col += mix(vec3(1.0), uAccent, 0.35) * streaks * 1.3;

    /* ── Planet limb along the bottom ────────────────────────────────── */
    vec2 centre = vec2(0.05, -1.42);
    float radius = 1.18;
    float d = length(p - centre);
    float disc = smoothstep(radius, radius - 0.006, d);

    // Surface: banded cloud/landmass noise, lit from the upper left
    vec2 sp = (p - centre) / radius;
    float surf = fbm(sp * 3.2 + vec2(uTime * 0.012, 0.0));
    vec3 land = mix(vec3(0.03, 0.11, 0.17), uAccent * 0.60, smoothstep(0.40, 0.68, surf));
    float lambert = clamp(dot(normalize(vec3(sp, 0.75)), normalize(vec3(-0.45, 0.7, 0.55))), 0.0, 1.0);
    vec3 planet = land * (0.10 + 0.95 * lambert);

    col = mix(col, planet, disc);

    // Atmosphere: a thin rim outside the disc, brightest where the sun grazes it
    float rim = smoothstep(radius + 0.085, radius, d) * (1.0 - disc);
    float sunSide = clamp(dot(normalize(p - centre), normalize(vec2(-0.45, 0.7))), 0.0, 1.0);
    col += mix(uAccent, vec3(0.4, 0.7, 1.0), 0.5) * rim * (0.25 + 0.9 * sunSide);

    /* ── Grain + vignette ────────────────────────────────────────────── */
    col += (hash(gl_FragCoord.xy + fract(uTime) * 71.3) - 0.5) * 0.022;
    col *= smoothstep(1.45, 0.30, length(vec2(p.x, p.y) * 1.25));

    gl_FragColor = vec4(col, uFade);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[space-shader]', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

/** Site accent (152 100% 48%) as rgb for the shader */
const ACCENT_RGB = [0.0, 0.96, 0.51]

export function SpaceShader({ visible }: { visible: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const visibleRef = useRef(visible)

    // The render loop reads this ref, so toggling never restarts WebGL
    useEffect(() => {
        visibleRef.current = visible
    }, [visible])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
        if (!gl) return

        const vs = compile(gl, gl.VERTEX_SHADER, VERT)
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
        if (!vs || !fs) return

        const program = gl.createProgram()
        if (!program) return
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('[space-shader]', gl.getProgramInfoLog(program))
            return
        }
        gl.useProgram(program)

        // Full-screen triangle
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
        const aPos = gl.getAttribLocation(program, 'aPos')
        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

        const uRes = gl.getUniformLocation(program, 'uRes')
        const uTime = gl.getUniformLocation(program, 'uTime')
        const uFade = gl.getUniformLocation(program, 'uFade')
        const uAccent = gl.getUniformLocation(program, 'uAccent')

        gl.uniform3f(uAccent, ACCENT_RGB[0], ACCENT_RGB[1], ACCENT_RGB[2])
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0)

        // Decorative full-screen pass — not worth 3x pixels on a phone
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const resize = () => {
            const w = Math.floor(canvas.clientWidth * dpr)
            const h = Math.floor(canvas.clientHeight * dpr)
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w
                canvas.height = h
                gl.viewport(0, 0, w, h)
            }
            gl.uniform2f(uRes, canvas.width, canvas.height)
        }
        resize()
        window.addEventListener('resize', resize)

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let raf = 0
        let fade = 0
        let last = performance.now()
        const start = last

        const render = (now: number) => {
            raf = requestAnimationFrame(render)
            const dt = Math.min((now - last) / 1000, 0.1)
            last = now

            // Arrive quickly — orbit has to be there as the page is beamed back
            // down — but leave more gently.
            const target = visibleRef.current ? 1 : 0
            fade += (target - fade) * (1 - Math.exp(-dt * (target > fade ? 6.5 : 2.2)))

            // Nothing to draw and nothing fading — skip the GPU work entirely
            if (fade < 0.002 && target === 0) return
            if (document.hidden) return

            resize()
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000)
            gl.uniform1f(uFade, fade)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
        raf = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
            gl.deleteBuffer(buffer)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
}
