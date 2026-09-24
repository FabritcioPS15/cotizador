'use client'

import { useRef, useState } from 'react'
import { Cuboid, Move, RotateCcw, Ruler } from 'lucide-react'
import { layoutFor, planFractions, cellRects, ramp, LEGS_X } from '@/lib/furniture'

const num = (v: string) => Number(v) || 0

export type FurnitureMapProps = {
  type: string
  dimensions: { width: string; height: string; depth: string }
  material: { name: string; brand: string; swatch?: string }
  selected: { drawers: boolean; handles: boolean; led: boolean; hinges: boolean; legs: boolean; rod: boolean; shelves: boolean }
}

const INK = '#17232d'
const DARK = '#33444f'
const ACCENT = '#1d7a63'
const METAL = '#8ea0ac'

function bevel(x: number, y: number, w: number, h: number) {
  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={w} height={Math.max(2, h * 0.03)} fill="#ffffff" opacity={0.3} />
      <rect x={x} y={y + h - Math.max(2, h * 0.03)} width={w} height={Math.max(2, h * 0.03)} fill="#000000" opacity={0.12} />
      <rect x={x} y={y} width={Math.max(2, w * 0.02)} height={h} fill="#ffffff" opacity={0.22} />
      <rect x={x + w - Math.max(2, w * 0.02)} y={y} width={Math.max(2, w * 0.02)} height={h} fill="#000000" opacity={0.1} />
    </g>
  )
}

function HL({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const lw = label.length * 7.8 + 14
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke="#33444f" strokeWidth={1.3} />
      <rect x={(x1 + x2) / 2 - lw / 2} y={y - 22} width={lw} height={18} rx={4} fill="#ffffff" stroke="#d3dce2" />
      <text x={(x1 + x2) / 2} y={y - 9.5} textAnchor="middle" fontSize={13} fontWeight={800} fill={ACCENT}>{label}</text>
    </g>
  )
}

function VL({ y1, y2, x, label }: { y1: number; y2: number; x: number; label: string }) {
  const mid = (y1 + y2) / 2
  const lw = label.length * 7.8 + 14
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke="#33444f" strokeWidth={1.3} />
      <g transform={`rotate(-90 ${x} ${mid})`}>
        <rect x={x - lw / 2} y={mid - 9} width={lw} height={18} rx={4} fill="#ffffff" stroke="#d3dce2" />
        <text x={x} y={mid + 4.5} textAnchor="middle" fontSize={13} fontWeight={800} fill={ACCENT}>{label}</text>
      </g>
    </g>
  )
}

function CAPT({ x, y, t }: { x: number; y: number; t: string }) {
  return (
    <g>
      <text x={x} y={y} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{t}</text>
      <rect x={x - 34} y={y + 7} width={68} height={3} rx={1.5} fill={ACCENT} />
    </g>
  )
}

function MapPlan({ dimensions, material, selected, type }: FurnitureMapProps) {
  const W = Math.max(40, num(dimensions.width))
  const H = Math.max(40, num(dimensions.height))
  const D = Math.max(30, num(dimensions.depth))
  const lay = layoutFor(type, selected, { width: W, height: H, depth: D })
  const shelvesOn = ['Personalizado', 'Estantería', 'Zapatero', 'Vitrina'].includes(type) || selected.shelves
  const f = planFractions(lay, selected)
  const rects = cellRects(lay, selected)
  const c = ramp(material.swatch && material.swatch.startsWith('#') ? material.swatch : '#c9a27a')
  const tex = material.swatch && !material.swatch.startsWith('#') ? material.swatch : null

  const sf = Math.min(380 / W, 460 / H)
  const fw = W * sf, fh = H * sf
  const fx = 250 - fw / 2, fy = 380 - fh / 2

  const ss = Math.min(260 / D, 190 / H)
  const sideW = D * ss, sideH = H * ss
  const sx = 770 - sideW / 2, sy = 235 - sideH / 2

  const st = Math.min(280 / W, 170 / D)
  const topW = W * st, topH = D * st
  const tx = 770 - topW / 2, ty = 500 - topH / 2

  const px = (fr: number) => fx + fr * fw
  const py = (fr: number) => fy + fr * fh
  const ledTop = py(f.counter)
  const ledH = f.led * fh
  const socTop = py(1 - f.socle)
  const legH = f.socle * fh
  const openBand = (() => {
    const sr = rects.find(r => r.kind === 'shelf')
    if (sr) return sr
    return rects.find(r => r.kind === 'open' && r.right - r.left > 0.66) ?? null
  })()

  return (
    <svg viewBox="0 0 1000 700" className="plan-svg" role="img" aria-label={`Plano 2D de ${lay.label}`}>
      <defs>
        <pattern id="plan-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 H0 V100" fill="none" stroke="#e7edf0" strokeWidth="1" />
        </pattern>
        <pattern id="plan-grain" width={tex ? 210 : 70} height={tex ? 210 : 70} patternUnits="userSpaceOnUse" patternTransform={tex ? 'scale(0.30)' : 'rotate(14)'}>
          {tex ? (
            <image href={tex} width="210" height="210" preserveAspectRatio="xMidYMid slice" opacity="0.88" />
          ) : (
            <>
              <path d="M0 18 Q 18 10 38 16 T 70 14" stroke={c.dark} strokeWidth="1.1" fill="none" opacity="0.18" />
              <path d="M0 40 Q 20 32 42 38 T 70 36" stroke={c.dark} strokeWidth="1.3" fill="none" opacity="0.15" />
              <path d="M0 62 Q 18 54 40 60 T 70 58" stroke={c.dark} strokeWidth="0.9" fill="none" opacity="0.16" />
            </>
          )}
        </pattern>
        <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.08" stopColor={c.base} />
          <stop offset="0.96" stopColor={c.deep} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id="gFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.18" stopColor={c.base} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <linearGradient id="gCounter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.35" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#f2f5f7" />
          <stop offset="0.45" stopColor="#b6c1ca" />
          <stop offset="0.55" stopColor="#8798a3" />
          <stop offset="1" stopColor="#edf1f4" />
        </linearGradient>
        <linearGradient id="gLED" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.5" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ffd465" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#17232d" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect x={24} y={24} width={952} height={652} rx={4} fill="#ffffff" stroke={DARK} strokeWidth={2.5} />
      <rect x={30} y={30} width={940} height={640} rx={2} fill="url(#plan-grid)" opacity={0.6} stroke="#d3dce2" strokeWidth="1" />

      <g>
        <rect x={30} y={32} width={266} height={40} rx={3} fill="#f5f8f7" stroke="#d3dce2" strokeWidth="1" filter="url(#soft)" />
        <text x={44} y={48} fontSize={15} fontWeight={800} fill={ACCENT}>MODIRU MUEBLES</text>
        <text x={44} y={66} fontSize={11.5} fill="#5b6b74" letterSpacing="1.5">PLANO DE FABRICACIÓN</text>
        <rect x={296} y={36} width={14} height={28} rx={3} fill={ACCENT} opacity={0.9} />
        <text x={303} y={46} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">S</text>
        <text x={303} y={59} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">C</text>
        <text x={316} y={53} fontSize={11} fill="#5b6b74">Escala gráfica aproximada · cm</text>
      </g>

      <CAPT x={250} y={104} t="VISTA FRONTAL" />
      <g>
        <ellipse cx={fx + fw / 2} cy={fy + fh + 3} rx={fw * 0.54} ry={Math.max(5, fw * 0.055)} fill="#17232d" opacity={0.13} />
        <ellipse cx={fx + fw / 2} cy={fy + fh + 3} rx={fw * 0.3} ry={Math.max(3, fw * 0.035)} fill="#17232d" opacity={0.15} />
        <rect x={fx} y={fy} width={fw} height={fh} rx={2.5} fill="url(#gWood)" stroke={DARK} strokeWidth={2.5} />
        <rect x={fx + 2} y={fy + 2} width={fw - 4} height={fh - 4} rx={2} fill="url(#plan-grain)" />
        <rect x={fx + 2.5} y={fy + 2} width={fw - 5} height={3} rx={1.5} fill="#ffffff" opacity={0.35} />

        {lay.counter && (() => {
          const cp = Math.max(3, fw * 0.022)
          return (
            <g>
              <rect x={fx - cp} y={fy} width={fw + cp * 2} height={f.counter * fh} rx={3} fill="url(#gCounter)" stroke={DARK} strokeWidth={1.8} />
              <line x1={fx - cp + 2} y1={fy + f.counter * fh} x2={fx + fw + cp - 2} y2={fy + f.counter * fh} stroke="#000" opacity={0.16} strokeWidth={1.4} />
              <rect x={fx - cp + 2} y={fy + 2} width={fw + cp * 2 - 4} height={Math.max(2, f.counter * fh * 0.42)} rx={1.2} fill="#ffffff" opacity={0.3} />
            </g>
          )
        })()}
        {f.led > 0 && (
          <g>
            <rect x={fx + 3} y={ledTop} width={fw - 6} height={ledH} rx={1.5} fill="url(#gLED)" stroke="#d9a520" strokeWidth={1} />
            <rect x={fx + 3} y={ledTop} width={fw - 6} height={2.5} fill="#ffffff" opacity={0.4} />
            <text x={fx + fw / 2} y={ledTop + ledH - 2.5} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#6b5a00" letterSpacing="1">LED</text>
          </g>
        )}
        {selected.legs ? (
          <g>
            {LEGS_X.map(t => {
              const lx = px(t)
              const lw = Math.max(5, fw * 0.013)
              return (
                <g key={t}>
                  <rect x={lx - lw / 2} y={socTop} width={lw} height={legH} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                  <rect x={lx - lw * 0.95} y={py(1) - Math.max(4, legH * 0.24)} width={lw * 1.9} height={Math.max(4, legH * 0.24)} rx={1.2} fill="#46575f" stroke={DARK} strokeWidth={0.7} />
                </g>
              )
            })}
          </g>
        ) : lay.socle && (
          <g>
            <rect x={fx} y={socTop} width={fw} height={fh * f.socle} fill={ACCENT} stroke={DARK} strokeWidth={1.4} />
            <rect x={fx + 2} y={socTop + 2} width={fw - 4} height={3} rx={1.5} fill="#ffffff" opacity={0.28} />
          </g>
        )}

        {selected.rod && openBand && (
          <g>
            {(() => {
              const ry = py(openBand.top + (openBand.bot - openBand.top) * 0.25)
              return (
                <>
                  <line x1={px(openBand.left) + 8} y1={ry} x2={px(openBand.right) - 8} y2={ry} stroke="url(#gMetal)" strokeWidth={4} strokeLinecap="round" />
                  <rect x={px(openBand.left) + 2} y={ry - 6} width={9} height={12} rx={2} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                  <rect x={px(openBand.right) - 11} y={ry - 6} width={9} height={12} rx={2} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                </>
              )
            })()}
          </g>
        )}

        {rects.map((r, i) => {
          const x0 = px(r.left), x1 = px(r.right), wcell = x1 - x0
          const y0 = py(r.top), y1 = py(r.bot), hcell = y1 - y0
          if (r.kind === 'open' || r.kind === 'shelf') {
            const shelfFracs = shelvesOn ? [0.34, 0.66] : [0.74]
            const shelfT = Math.max(3, hcell * 0.1)
            return (
              <g key={i}>
                <rect x={x0 + 3} y={y0 + 3} width={wcell - 6} height={hcell - 6} rx={3} fill={c.dark} opacity={0.24} stroke={c.dark} strokeWidth={1.1} strokeDasharray="3 2" />
                <rect x={x0 + 5} y={y0 + 5} width={wcell - 10} height={hcell * 0.62} rx={2} fill="#000000" opacity={0.07} />
                {shelfFracs.map(fr => (
                  <rect key={fr} x={x0 + 4} y={y0 + hcell * fr} width={wcell - 8} height={shelfT} rx={2} fill={c.base} opacity={0.95} stroke={c.deep} strokeWidth={0.9} />
                ))}
              </g>
            )
          }
          if (r.kind === 'drawer') {
            return (
              <g key={i}>
                <rect x={x0 + 2.5} y={y0 + 2.5} width={wcell - 5} height={hcell - 5} rx={2.5} fill="url(#gFront)" stroke={DARK} strokeWidth={1.2} filter="url(#soft)" />
                <rect x={x0 + 2.5} y={y0 + 2.5} width={wcell - 5} height={hcell - 5} rx={2.5} fill="url(#plan-grain)" />
                {bevel(x0 + 2.5, y0 + 2.5, wcell - 5, hcell - 5)}
                <rect x={x0 + 4} y={y0 + 4} width={Math.max(3, wcell * 0.055)} height={hcell - 8} fill="#ffffff" opacity={0.16} />
                <rect x={x1 - 4 - Math.max(3.5, wcell * 0.045)} y={y0 + 4} width={Math.max(3.5, wcell * 0.045)} height={hcell - 8} fill="#000000" opacity={0.08} />
                <line x1={x0 + 2.5} y1={y1 - 2.5} x2={x1 - 2.5} y2={y1 - 2.5} stroke="#000000" opacity={0.16} strokeWidth={1.2} />
                {selected.handles && (
                  <rect x={(x0 + x1) / 2 - Math.max(17, wcell * 0.17)} y={(y0 + y1) / 2 - 3.5} width={Math.max(34, wcell * 0.34)} height={7} rx={3.5} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                )}
              </g>
            )
          }
          const hx = r.col % 2 === 0 ? x1 - 26 : x0 + 20
          return (
            <g key={i}>
              <rect x={x0 + 2} y={y0 + 2} width={wcell - 4} height={hcell - 4} rx={2.5} fill="url(#gFront)" stroke={DARK} strokeWidth={1.3} filter="url(#soft)" />
              <rect x={x0 + 2} y={y0 + 2} width={wcell - 4} height={hcell - 4} rx={2.5} fill="url(#plan-grain)" />
              {bevel(x0 + 2, y0 + 2, wcell - 4, hcell - 4)}
              <rect x={x0 + 6} y={y0 + 6} width={wcell - 12} height={hcell - 12} rx={2} fill="none" stroke={c.deep} strokeWidth={1.1} opacity={0.5} />
              <rect x={x0 + 3.5} y={y0 + 3.5} width={Math.max(3, wcell * 0.055)} height={hcell - 7} fill="#ffffff" opacity={0.15} />
              <rect x={x1 - 3.5 - Math.max(3.5, wcell * 0.045)} y={y0 + 3.5} width={Math.max(3.5, wcell * 0.045)} height={hcell - 7} fill="#000000" opacity={0.08} />
              {shelvesOn && [0.38, 0.68].map(fr => (
                <line key={fr} x1={x0 + 8} y1={y0 + hcell * fr} x2={x1 - 8} y2={y0 + hcell * fr} stroke={c.dark} strokeWidth={1.1} strokeDasharray="4 3" opacity={0.55} />
              ))}
              {selected.hinges && [0.22, 0.5, 0.78].map(t => (
                <g key={t}>
                  <rect x={r.col % 2 === 0 ? x0 - 2 : x1 - 5} y={y0 + hcell * t - 3} width={7} height={10} rx={2} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                </g>
              ))}
              {selected.handles && (
                <rect x={hx} y={(y0 + y1) / 2 - 16} width={6} height={32} rx={3} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
              )}
            </g>
          )
        })}

        <HL x1={fx} x2={fx + fw} y={fy + fh + 24} label={`${W} cm`} />
        <VL y1={fy} y2={fy + fh} x={fx - 42} label={`${H} cm`} />
      </g>

      <CAPT x={770} y={104} t="VISTA LATERAL" />
      <g>
        <ellipse cx={sx + sideW / 2} cy={sy + sideH + 3} rx={sideW * 0.5} ry={Math.max(4, sideW * 0.06)} fill="#17232d" opacity={0.14} />
        <rect x={sx} y={sy} width={sideW} height={sideH} rx={2.5} fill="url(#gWood)" stroke={DARK} strokeWidth={2.5} />
        <rect x={sx + 2} y={sy + 2} width={sideW - 4} height={sideH - 4} rx={2} fill="url(#plan-grain)" />
        {lay.counter && (
          <g>
            <rect x={sx} y={sy} width={sideW} height={Math.max(3, sideH * f.counter)} fill="url(#gCounter)" stroke={DARK} strokeWidth={1} />
          </g>
        )}
        {f.led > 0 && (
          <rect x={sx + sideW * 0.06} y={sy + sideH * f.counter} width={sideW * 0.5} height={6} rx={1} fill="url(#gLED)" stroke="#d9a520" strokeWidth={0.8} />
        )}
        <rect x={sx + sideW - sideW * 0.055} y={sy} width={sideW * 0.055} height={sideH} fill={c.deep} opacity={0.65} />
        {selected.legs ? (
          <g>
            {[0.1, 0.9].map(t => {
              const lx = sx + sideW * t
              const lw = Math.max(4, sideW * 0.022)
              const lh = Math.max(5, sideH * f.socle)
              return (
                <g key={t}>
                  <rect x={lx - lw / 2} y={sy + sideH - lh} width={lw} height={lh} fill="url(#gMetal)" stroke={METAL} strokeWidth={0.8} />
                  <rect x={lx - lw * 0.9} y={sy + sideH - lh * 0.28} width={lw * 1.8} height={lh * 0.28} rx={1} fill="#46575f" />
                </g>
              )
            })}
          </g>
        ) : lay.socle && <rect x={sx} y={sy + sideH - Math.max(4, sideH * f.socle)} width={sideW} height={Math.max(4, sideH * f.socle)} fill={ACCENT} stroke={DARK} strokeWidth={1} />}
        {(() => {
          const rowFr = (f.bodyBot - f.bodyTop) / lay.rows
          return lay.rows > 1 && Array.from({ length: lay.rows - 1 }).map((_, k) => {
            const ry = sy + sideH * (f.bodyTop + (k + 1) * rowFr)
            return <line key={k} x1={sx + 1} y1={ry} x2={sx + sideW - 1} y2={ry} stroke={c.deep} strokeWidth={1} opacity={0.4} />
          })
        })()}
        {(() => {
          const rowFr = (f.bodyBot - f.bodyTop) / lay.rows
          return Array.from({ length: lay.rows }).map((_, k) => {
            const topFr = f.bodyTop + k * rowFr
            const botFr = topFr + rowFr
            const hasShelf = rects.some(r => r.row === k && (r.kind === 'open' || r.kind === 'shelf'))
            if (!hasShelf) return null
            const fr = shelvesOn ? 0.5 : 0.72
            const z = topFr + (botFr - topFr) * fr
            return <rect key={k} x={sx + 2.5} y={sy + sideH * z} width={sideW - 5} height={Math.max(2.5, sideH * rowFr * 0.1)} rx={1.5} fill={c.base} opacity={0.95} stroke={c.deep} strokeWidth={0.9} />
          })
        })()}
        <line x1={sx + sideW * 0.5} y1={sy + sideH * 0.12} x2={sx + sideW * 0.5} y2={sy + sideH * 0.94} stroke={c.dark} strokeWidth={1.8} opacity={0.7} />
        <rect x={sx + sideW * 0.5 - 3} y={sy + sideH * 0.12} width={6} height={sideH * 0.82} fill="url(#gFront)" stroke={DARK} strokeWidth={0.8} opacity={0.9} />
        <HL x1={sx} x2={sx + sideW} y={sy + sideH + 24} label={`${D} cm`} />
        <VL y1={sy} y2={sy + sideH} x={sx - 40} label={`${H} cm`} />
      </g>

      <CAPT x={770} y={366} t="PLANTA" />
      <g>
        <rect x={tx} y={ty} width={topW} height={topH} rx={3} fill="url(#gWood)" stroke={DARK} strokeWidth={2.5} />
        <rect x={tx + 5} y={ty + 5} width={topW - 10} height={topH - 10} rx={2} fill="url(#plan-grain)" />
        <rect x={tx + 3} y={ty + 3} width={topW - 6} height={3} rx={1.5} fill="#ffffff" opacity={0.3} />
        <rect x={tx + 3} y={ty + topH - 6} width={topW - 6} height={3} rx={1.5} fill="#000000" opacity={0.14} />
        {lay.counter && <rect x={tx + 3.5} y={ty + 3.5} width={topW - 7} height={topH - 7} rx={2} fill="none" stroke={c.deep} strokeWidth={1.2} opacity={0.5} />}
        {selected.legs && (
          <g>
            {[0.12, 0.88].flatMap(txL => [0.2, 0.8].map(tyL => {
              const lx = tx + topW * txL
              const ly = ty + topH * tyL
              return <circle key={`${txL}-${tyL}`} cx={lx} cy={ly} r={Math.max(2.5, topW * 0.012)} fill="#46575f" stroke={DARK} strokeWidth={0.7} />
            }))}
          </g>
        )}
        {f.led > 0 && (
          <g>
            <rect x={tx + 4} y={ty + 3} width={Math.max(9, topW * 0.4)} height={Math.max(8, topH * 0.11)} rx={1.5} fill="url(#gLED)" stroke="#d9a520" strokeWidth={1} />
            <text x={tx + 7} y={ty + 11} fontSize={8} fill="#8a6d00">LED</text>
          </g>
        )}
        <HL x1={tx} x2={tx + topW} y={ty + topH + 32} label={`${W} cm`} />
        <VL y1={ty} y2={ty + topH} x={tx - 40} label={`${D} cm`} />
      </g>

      <g>
        <text x={46} y={660} fontSize={12} fontWeight={700} fill={INK}>MEDIDAS</text>
        <text x={112} y={660} fontSize={12} fill="#5b6b74">{W} × {D} × {H} cm (Ancho × Fondo × Alto)</text>
        <text x={652} y={660} fontSize={12} fontWeight={700} fill={INK}>MATERIAL</text>
        <text x={716} y={660} fontSize={12} fill="#5b6b74">{material.name} · {material.brand}</text>
      </g>
    </svg>
  )
}

function MapIso({ dimensions, material, selected, type, rot, k, drag = false }: { rot: number; k: number; drag?: boolean } & FurnitureMapProps) {
  const W = Math.max(40, num(dimensions.width))
  const H = Math.max(40, num(dimensions.height))
  const D = Math.max(30, num(dimensions.depth))
  const lay = layoutFor(type, selected, { width: W, height: H, depth: D })
  const shelvesOn = ['Personalizado', 'Estantería', 'Zapatero', 'Vitrina'].includes(type) || selected.shelves
  const f = planFractions(lay, selected)
  const rects = cellRects(lay, selected)
  const c = ramp(material.swatch && material.swatch.startsWith('#') ? material.swatch : '#c9a27a')
  const tex = material.swatch && !material.swatch.startsWith('#') ? material.swatch : null
  const rad = ((rot % 360) * Math.PI) / 180
  const cs = Math.cos(rad), sn = Math.sin(rad)
  const ex: [number, number] = [0.8660254, 0.5]
  const ey: [number, number] = [-0.8660254, 0.5 * k]
  const rot2 = (x: number, y: number) => ([x * cs - y * sn, x * sn + y * cs] as [number, number])

  const corners: [number, number, number][] = [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H]]
  const raw = corners.map(c => { const [xr, yr] = rot2(c[0], c[1]); return [ex[0] * xr + ey[0] * yr, ex[1] * xr + ey[1] * yr - c[2]] })
  const xs = raw.map(p => p[0]), ys = raw.map(p => p[1])
  const spanX = Math.max(...xs) - Math.min(...xs)
  const spanY = Math.max(...ys) - Math.min(...ys)
  const scl = Math.min(500 / spanX, 440 / spanY)
  const proj = (x: number, y: number, z: number) => { const [xr, yr] = rot2(x, y); return [(ex[0] * xr + ey[0] * yr) * scl, (ex[1] * xr + ey[1] * yr - z) * scl] as [number, number] }
  const projPts = corners.map(c => proj(c[0], c[1], c[2]))
  const cx0 = (Math.min(...projPts.map(p => p[0])) + Math.max(...projPts.map(p => p[0]))) / 2
  const cy0 = (Math.min(...projPts.map(p => p[1])) + Math.max(...projPts.map(p => p[1]))) / 2

  const nearC = [[0, 0], [W, 0], [W, D], [0, D]].reduce((a, b) => proj(b[0], b[1], 0)[1] > proj(a[0], a[1], 0)[1] ? b : a)
  const frontY = nearC[1]
  const backY = frontY === D ? 0 : D
  const sideX = nearC[0]
  const insetY = frontY + (backY - frontY) * 0.02

  const P = (x: number, y: number, z: number) => proj(x, y, z).map(n => n.toFixed(1)).join(',')
  const area2 = (pts: [number, number, number][]) => {
    const p = pts.map(pt => proj(pt[0], pt[1], pt[2]))
    let a = 0
    for (let i = 0; i < p.length; i++) { const j = (i + 1) % p.length; a += p[i][0] * p[j][1] - p[j][0] * p[i][1] }
    return Math.abs(a) / 2
  }
  const q = (pts: [number, number, number][], fill: string, sw = 1.4, op = 1) => (
    area2(pts) < 60 ? null : <polygon points={pts.map(p => P(p[0], p[1], p[2])).join(' ')} fill={fill} stroke={DARK} strokeWidth={sw} strokeLinejoin="round" opacity={op} />
  )
  const line = (a: [number, number, number], b: [number, number, number], stroke: string, w: number) => (
    <line x1={P(a[0], a[1], a[2]).split(',')[0]} y1={P(a[0], a[1], a[2]).split(',')[1]} x2={P(b[0], b[1], b[2]).split(',')[0]} y2={P(b[0], b[1], b[2]).split(',')[1]} stroke={stroke} strokeWidth={w} strokeLinecap="round" />
  )
  const IsoDim = ({ a, b, label, vertical = false }: { a: [number, number, number]; b: [number, number, number]; label: string; vertical?: boolean }) => {
    const A = proj(a[0], a[1], a[2]), B = proj(b[0], b[1], b[2])
    const dx = B[0] - A[0], dy = B[1] - A[1]
    let ux = 0, uy = 0
    if (vertical) {
      ux = 1
    } else if (Math.abs(dy) > Math.abs(dx)) {
      ux = dy > 0 ? -1 : 1
    } else {
      uy = 1
    }
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2
    const cxm = proj(W / 2, D / 2, H / 2)[0], cym = proj(W / 2, D / 2, H / 2)[1]
    if (ux * (cxm - mx) + uy * (cym - my) > 0) { ux = -ux; uy = -uy }
    const off = 42
    const p1 = [A[0] + ux * off, A[1] + uy * off], p2 = [B[0] + ux * off, B[1] + uy * off]
    const lw = label.length * 7.8 + 12
    return (
      <g>
        <line x1={A[0]} y1={A[1]} x2={p1[0]} y2={p1[1]} stroke="#33444f" strokeWidth={0.9} opacity={0.55} />
        <line x1={B[0]} y1={B[1]} x2={p2[0]} y2={p2[1]} stroke="#33444f" strokeWidth={0.9} opacity={0.55} />
        <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#33444f" strokeWidth={1.3} />
        <line x1={p1[0] - ux * 6} y1={p1[1] - uy * 6} x2={p1[0] + ux * 6} y2={p1[1] + uy * 6} stroke="#33444f" strokeWidth={1.3} />
        <line x1={p2[0] - ux * 6} y1={p2[1] - uy * 6} x2={p2[0] + ux * 6} y2={p2[1] + uy * 6} stroke="#33444f" strokeWidth={1.3} />
        <rect x={(p1[0] + p2[0]) / 2 - lw / 2} y={(p1[1] + p2[1]) / 2 - 9.5} width={lw} height={18} rx={4} fill="#ffffff" stroke="#d3dce2" />
        <text x={(p1[0] + p2[0]) / 2} y={(p1[1] + p2[1]) / 2 + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{label}</text>
      </g>
    )
  }

  const o = lay.counterOverhang
  const socH = H * f.socle
  const baseShadow = `${P(0, 0, 0)} ${P(W, 0, 0)} ${P(W, D, 0)} ${P(0, D, 0)}`
  const openBand = (() => {
    const sr = rects.find(r => r.kind === 'shelf')
    if (sr) return sr
    return rects.find(r => r.kind === 'open' && r.right - r.left > 0.66) ?? null
  })()

  return (
    <svg viewBox="0 0 1000 700" className="plan-svg" role="img" aria-label={`Vista 3D isométrica de ${lay.label}`}>
      <defs>
        <pattern id="isoGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 H0 V100" fill="none" stroke="#e7edf0" strokeWidth="1" />
        </pattern>
        <pattern id="isoGrain" width={tex ? 1 : 70} height={tex ? 1 : 70} patternUnits="objectBoundingBox">
          {tex ? (
            <image href={tex} x={0} y={0} width="1" height="1" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
          ) : (
            <>
              <path d="M0 18 Q 18 10 38 16 T 70 14" stroke={c.dark} strokeWidth="1.1" fill="none" opacity="0.2" />
              <ellipse cx="52" cy="16" rx="3" ry="1.6" fill={c.dark} opacity="0.2" />
            </>
          )}
        </pattern>
        <linearGradient id="isoFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.25" stopColor={c.base} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <linearGradient id="isoSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.base} />
          <stop offset="0.4" stopColor={c.deep} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id="isoCounter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.3" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id="isoMetal" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#f2f5f7" />
          <stop offset="0.45" stopColor="#b6c1ca" />
          <stop offset="0.55" stopColor="#8798a3" />
          <stop offset="1" stopColor="#edf1f4" />
        </linearGradient>
        <linearGradient id="isoLED" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="1" stopColor="#ffd465" />
        </linearGradient>
        <radialGradient id="isoBg" cx="50%" cy="42%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#f3f7f6" />
          <stop offset="1" stopColor="#dce7eb" />
        </radialGradient>
        <filter id="isoBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

<rect x={24} y={24} width={952} height={652} rx={4} fill="#ffffff" stroke={DARK} strokeWidth={2.5} />
        <rect x={30} y={30} width={940} height={640} rx={2} fill="url(#isoBg)" />
        <rect x={30} y={30} width={940} height={640} rx={2} fill="url(#isoGrid)" opacity={0.45} stroke="#d3dce2" strokeWidth="1" />

      <text x={500} y={64} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{lay.label.toUpperCase()} · VISTA 3D</text>
      <text x={500} y={82} textAnchor="middle" fontSize={11.5} fill="#5b6b74">Arrastra la vista para girar · medidas actualizadas en tiempo real</text>

      <g transform={`translate(${500 - cx0} ${345 - cy0})`}>
        <polygon points={baseShadow} fill="#101d26" opacity={0.26} transform="translate(14 18)" filter="url(#isoBlur)" />
        <polygon points={baseShadow} fill="#101d26" opacity={0.14} transform="translate(4 6)" filter="url(#isoBlur)" />

        {q([[sideX, 0, 0], [sideX, D, 0], [sideX, D, H], [sideX, 0, H]], 'url(#isoSide)')}
        <polygon points={`${P(sideX, 0, 0)} ${P(sideX, D, 0)} ${P(sideX, D, H)} ${P(sideX, 0, H)}`} fill="url(#isoGrain)" />
        {!selected.legs && lay.socle && q([[sideX, 0, 0], [sideX, D, 0], [sideX, D, socH], [sideX, 0, socH]], ACCENT, 1.2)}
        {lay.counter && q([[sideX, 0, H], [sideX, D, H], [sideX, D, H - H * f.counter], [sideX, 0, H - H * f.counter]], 'url(#isoCounter)', 1.2)}

        {q([[0, frontY, 0], [W, frontY, 0], [W, frontY, H], [0, frontY, H]], 'url(#isoFront)')}
        <polygon points={`${P(0, frontY, 0)} ${P(W, frontY, 0)} ${P(W, frontY, H)} ${P(0, frontY, H)}`} fill="url(#isoGrain)" />
        {!selected.legs && lay.socle && q([[0, frontY, 0], [W, frontY, 0], [W, frontY, socH], [0, frontY, socH]], ACCENT, 1.2)}

        {selected.legs && (() => {
          const legH = socH
          const corners = [[0.06, 0.06], [0.94, 0.06], [0.06, 0.94], [0.94, 0.94]]
          return (
            <g>
              {corners.map(([fx, fz], idx) => {
                const lx = fx * W, ly = fz * D
                return (
                  <g key={idx}>
                    {q([[lx - 0.5, ly, 0], [lx + 0.5, ly, 0], [lx + 0.5, ly, legH], [lx - 0.5, ly, legH]], '#67797f', 0.9)}
                    {q([[lx - 1.1, ly, 0], [lx + 1.1, ly, 0], [lx + 1.1, ly, Math.min(1.4, legH * 0.3)], [lx - 1.1, ly, Math.min(1.4, legH * 0.3)]], '#2d3b44', 0.9)}
                  </g>
                )
              })}
            </g>
          )
        })()}

        <line x1={P(0, frontY, 0).split(',')[0]} y1={P(0, frontY, 0).split(',')[1]} x2={P(W, frontY, 0).split(',')[0]} y2={P(W, frontY, 0).split(',')[1]} stroke={c.dark} strokeWidth={2.6} opacity={0.3} />
        <line x1={P(sideX, 0, 0).split(',')[0]} y1={P(sideX, 0, 0).split(',')[1]} x2={P(sideX, D, 0).split(',')[0]} y2={P(sideX, D, 0).split(',')[1]} stroke={c.dark} strokeWidth={2.2} opacity={0.24} />

        {rects.map((r, i) => {
          const x0 = r.left * W, x1 = r.right * W
          const zTop = H * (1 - r.top), zBot = H * (1 - r.bot)
          if (r.kind === 'open' || r.kind === 'shelf') {
            const frs = shelvesOn ? [0.3, 0.6, 0.9] : [0.85]
            return (
              <g key={i}>
                {q([[x0 + 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zTop - 1.2], [x0 + 1.6, insetY, zTop - 1.2]], c.dark, 1, 0.3)}
                {frs.map(fr => {
                  const z = zTop - (zTop - zBot) * fr
                  return <g key={fr}>{line([x0 + 2, frontY, z], [x1 - 2, frontY, z], c.deep, 3)}{line([x0 + 2, frontY, z + 0.6], [x1 - 2, frontY, z + 0.6], '#ffffff', 1.1)}</g>
                })}
              </g>
            )
          }
          if (r.kind === 'drawer') {
            const zMid = (zTop + zBot) / 2
            return (
              <g key={i}>
                {q([[x0 + 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zTop - 1.2], [x0 + 1.6, insetY, zTop - 1.2]], 'url(#isoFront)', 1.1)}
                {line([x0 + 1.6, frontY, zBot + 1.6], [x1 - 1.6, frontY, zBot + 1.6], '#000000', 1.2)}
                {selected.handles && line([(x0 + x1) / 2 - Math.min(17, (x1 - x0) * 0.16), frontY, zMid], [(x0 + x1) / 2 + Math.min(17, (x1 - x0) * 0.16), frontY, zMid], 'url(#isoMetal)', 5)}
              </g>
            )
          }
          const hx = r.col % 2 === 0 ? x1 - 4 : x0 + 4
          return (
            <g key={i}>
              {q([[x0 + 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zBot + 1.2], [x1 - 1.6, insetY, zTop - 1.2], [x0 + 1.6, insetY, zTop - 1.2]], 'url(#isoFront)', 1.1)}
              <g opacity={0.28}>{line([x0 + 1.6, insetY, zTop - 1.2], [x1 - 1.6, insetY, zTop - 1.2], '#ffffff', 2.4)}</g>
              {line([x0 + 1.6, frontY, zBot + 1.6], [x1 - 1.6, frontY, zBot + 1.6], '#000000', 1.2)}
              {shelvesOn && [0.32, 0.62].map(fr => {
                const z = zTop - (zTop - zBot) * fr
                return <line key={fr} x1={P(x0 + 3, frontY, z).split(',')[0]} y1={P(x0 + 3, frontY, z).split(',')[1]} x2={P(x1 - 3, frontY, z).split(',')[0]} y2={P(x1 - 3, frontY, z).split(',')[1]} stroke={c.dark} strokeWidth={1.1} strokeDasharray="4 3" opacity={0.5} />
              })}
              {selected.handles && line([hx, frontY, zBot + (zTop - zBot) * 0.3], [hx, frontY, zTop - (zTop - zBot) * 0.3], 'url(#isoMetal)', 5)}
            </g>
          )
        })}

        {selected.rod && openBand && (() => {
          const zTopB = H * (1 - openBand.top)
          const zBotB = H * (1 - openBand.bot)
          const zRod = zTopB - (zTopB - zBotB) * 0.25
          const rx0 = openBand.left * W + 2, rx1 = openBand.right * W - 2
          return (
            <g>
              {line([rx0, frontY, zRod], [rx1, frontY, zRod], '#93a6b0', 3)}
              {line([rx0, frontY, zRod + 0.35], [rx1, frontY, zRod + 0.35], '#ffffff', 1)}
            </g>
          )
        })()}

        {f.led > 0 && (() => {
          const zc = H * (1 - f.counter - f.led / 2)
          return (
            <g>
              {line([2, frontY, zc], [W - 2, frontY, zc], '#ffd465', 6)}
              {line([2, frontY, zc], [W - 2, frontY, zc], '#ffe9a8', 3)}
              {line([2, frontY, zc], [W - 2, frontY, zc], '#fff6cf', 1.6)}
            </g>
          )
        })()}

        {lay.counter ? (
          <g>
            {q([[-o, -o, H], [W + o, -o, H], [W + o, D + o, H], [-o, D + o, H]], 'url(#isoCounter)', 1.6)}
            <polygon points={`${P(-o, -o, H)} ${P(W + o, -o, H)} ${P(W + o, D + o, H)} ${P(-o, D + o, H)}`} fill="url(#isoGrain)" opacity={0.9} />
            <polygon points={`${P(-o, -o, H)} ${P(W + o, -o, H)} ${P(W + o, D + o, H)} ${P(-o, D + o, H)}`} fill={c.light} opacity={0.14} />
          </g>
        ) : (
          <g>
            {q([[0, 0, H], [W, 0, H], [W, D, H], [0, D, H]], c.base, 1.6)}
            <polygon points={`${P(0, 0, H)} ${P(W, 0, H)} ${P(W, D, H)} ${P(0, D, H)}`} fill="url(#isoGrain)" />
            <polygon points={`${P(0, 0, H)} ${P(W, 0, H)} ${P(W, D, H)} ${P(0, D, H)}`} fill={c.light} opacity={0.16} />
          </g>
        )}

        <g style={{ opacity: drag ? 0 : 1, transition: 'opacity .2s ease', pointerEvents: 'none' }}>
          <IsoDim a={[0, frontY, 0]} b={[W, frontY, 0]} label={`${W} cm`} />
          <IsoDim a={[sideX, 0, 0]} b={[sideX, D, 0]} label={`${D} cm`} />
          <IsoDim a={[0, frontY, 0]} b={[0, frontY, H]} label={`${H} cm`} vertical />
        </g>
      </g>

      <g>
        <text x={46} y={660} fontSize={12} fontWeight={700} fill={INK}>MEDIDAS</text>
        <text x={112} y={660} fontSize={12} fill="#5b6b74">{W} × {D} × {H} cm (Ancho × Fondo × Alto)</text>
        <text x={652} y={660} fontSize={12} fontWeight={700} fill={INK}>MATERIAL</text>
        <text x={716} y={660} fontSize={12} fill="#5b6b74">{material.name} · {material.brand}</text>
      </g>
    </svg>
  )
}

export function FurnitureMap(props: FurnitureMapProps) {
  const [mode, setMode] = useState<'2d' | '3d'>('3d')
  const [az, setAz] = useState(0)
  const [tilt, setTilt] = useState(1)
  const [rotating, setRotating] = useState(false)
  const drag = useRef<{ x: number; y: number } | null>(null)

  const reset = () => { setAz(0); setTilt(1) }
  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== '3d') return
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    setRotating(true)
  }
  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || e.buttons === 0) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    drag.current = { x: e.clientX, y: e.clientY }
    if (Math.abs(dx) + Math.abs(dy) > 0) {
      setAz(a => (a + dx * 0.55) % 360)
      setTilt(t => Math.min(1.15, Math.max(0.4, t + dy * 0.004)))
    }
  }
  const endDrag = () => { drag.current = null; setRotating(false) }

  return (
    <div>
      <div className="plan-tabs">
        <button className={mode === '3d' ? 'active' : ''} onClick={() => setMode('3d')}><Cuboid size={16} /> Vista 3D<span className="plan-tag">3D</span></button>
        <button className={mode === '2d' ? 'active' : ''} onClick={() => setMode('2d')}><Ruler size={16} /> Plano 2D</button>
        {mode === '3d' && (
          <span className="iso-toolbar">
            <button onClick={() => setAz(a => (a - 90) % 360)} title="Girar 90°"><Move size={14} /> ⟲</button>
            <button onClick={() => setAz(a => (a + 90) % 360)} title="Girar 90°"><Move size={14} /> ⟳</button>
            <button onClick={reset} title="Reiniciar vista" disabled={az === 0 && tilt === 1}><RotateCcw size={14} /></button>
          </span>
        )}
      </div>
      <div className={`plan-wrap${mode === '3d' ? ' iso-drag' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        {mode === '2d' ? <MapPlan {...props} /> : <MapIso {...props} rot={az} k={tilt} drag={rotating} />}
        {mode === '3d' && <div className="iso-hint"><Move size={12} /> Arrastra para girar</div>}
      </div>
    </div>
  )
}