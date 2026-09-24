export type CellKind = 'door' | 'drawer' | 'shelf' | 'open'

export type Cell = { kind: CellKind; col: number; row: number; span?: number }

export type Layout = {
  id: string
  label: string
  cols: number
  rows: number
  cells: Cell[]
  socle: boolean
  counter: boolean
  counterOverhang: number
}

export type Selections = {
  drawers: boolean
  handles: boolean
  led: boolean
  hinges: boolean
  legs: boolean
  rod: boolean
  shelves: boolean
}

const C = (kind: CellKind, row: number, col: number, span?: number): Cell => ({ kind, col, row, span: span ?? 1 })
const doorsOf = (row: number, cols: number): Cell[] => Array.from({ length: cols }, (_, col) => C('door', row, col, 1))
const opensOf = (row: number, cols: number): Cell[] => Array.from({ length: cols }, (_, col) => C('open', row, col, 1))

function baseLayout(type: string, dims?: { width: number; height: number; depth: number }): Layout {
  switch (type) {
    case 'Mueble bajo':
      return { id: 'bajo', label: 'Mueble bajo', cols: 4, rows: 1, cells: doorsOf(0, 4), socle: true, counter: true, counterOverhang: 0.6 }
    case 'Mueble alto':
      return { id: 'alto', label: 'Mueble alto', cols: 4, rows: 1, cells: doorsOf(0, 4), socle: false, counter: false, counterOverhang: 0.3 }
    case 'Clóset':
      return { id: 'closet', label: 'Clóset', cols: 3, rows: 2, cells: [C('shelf', 0, 0, 3), ...doorsOf(1, 3)], socle: false, counter: false, counterOverhang: 0 }
    case 'Rack TV':
      return { id: 'rack', label: 'Rack / TV', cols: 3, rows: 2, cells: [...opensOf(0, 3), ...opensOf(1, 3)], socle: false, counter: true, counterOverhang: 0.4 }
    case 'Estantería':
      return { id: 'estanteria', label: 'Estantería', cols: 3, rows: 3, cells: [...opensOf(0, 3), ...opensOf(1, 3), ...opensOf(2, 3)], socle: true, counter: false, counterOverhang: 0 }
    case 'Escritorio':
      return { id: 'escritorio', label: 'Escritorio', cols: 4, rows: 1, cells: opensOf(0, 4), socle: false, counter: true, counterOverhang: 1.2 }
    case 'Zapatero':
      return { id: 'zapatero', label: 'Zapatero', cols: 4, rows: 2, cells: [...opensOf(0, 4), ...opensOf(1, 4)], socle: true, counter: false, counterOverhang: 0 }
    case 'Vitrina':
      return { id: 'vitrina', label: 'Vitrina', cols: 3, rows: 2, cells: [...opensOf(0, 3), ...doorsOf(1, 3)], socle: false, counter: false, counterOverhang: 0 }
    case 'Isla de cocina':
      return { id: 'isla', label: 'Isla de cocina', cols: 4, rows: 1, cells: doorsOf(0, 4), socle: true, counter: true, counterOverhang: 1.4 }
    default: {
      const W = dims?.width ?? 200
      const H = dims?.height ?? 90
      const cols = Math.max(1, Math.min(8, Math.round(W / 70)))
      const rows = Math.max(1, Math.min(6, Math.ceil(H / 55)))
      const cells: Cell[] = []
      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) cells.push(C('open', r, col, 1))
      return { id: 'pers', label: 'Mueble personalizado', cols, rows, cells, socle: true, counter: false, counterOverhang: 0 }
    }
  }
}

function addDrawerBand(l: Layout): Layout {
  const drawerCells: Cell[] = l.cols >= 4
    ? [C('drawer', 0, 0, 2), C('drawer', 0, 2, 2)]
    : l.cols === 3
      ? [C('drawer', 0, 0, 1), C('drawer', 0, 1, 1), C('drawer', 0, 2, 1)]
      : [C('drawer', 0, 0, l.cols)]
  return { ...l, rows: l.rows + 1, cells: [...drawerCells, ...l.cells.map(c => ({ ...c, row: c.row + 1 }))] }
}

export function layoutFor(type: string, s: Selections, dims?: { width: number; height: number; depth: number }): Layout {
  let l = baseLayout(type, dims)
  if (s.drawers && !l.cells.some(c => c.row === 0 && c.kind === 'drawer')) l = addDrawerBand(l)
  return l
}

export function planFractions(l: Layout, s: Selections): { socle: number; counter: number; led: number; bodyTop: number; bodyBot: number } {
  const socle = s.legs ? 0.05 : l.socle ? 0.055 : 0
  const counter = l.counter ? 0.085 : 0
  const ledH = s.led ? 0.05 : 0
  const bodyTop = counter + ledH
  const bodyBot = 1 - socle
  return { socle, counter, led: ledH, bodyTop, bodyBot }
}

export type CellRect = { kind: CellKind; col: number; row: number; left: number; right: number; top: number; bot: number }

export function cellRects(l: Layout, s: Selections): CellRect[] {
  const f = planFractions(l, s)
  const rowFr = (f.bodyBot - f.bodyTop) / l.rows
  const colFr = 1 / l.cols
  return l.cells.map(c => {
    const top = f.bodyTop + c.row * rowFr
    const bot = top + rowFr
    const left = c.col * colFr
    return { kind: c.kind, col: c.col, row: c.row, left, right: left + (c.span ?? 1) * colFr, top, bot }
  })
}

export function ramp(hex: string) {
  const h = hex.startsWith('#') ? hex : '#c9a27a'
  const n = parseInt(h.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const sh = (pct: number) => '#' + [r, g, b].map(v => Math.round(Math.min(255, Math.max(0, v + 255 * pct))).toString(16).padStart(2, '0')).join('')
  return { light: sh(0.16), base: h, deep: sh(-0.15), dark: sh(-0.3) }
}

export function isoVectors(rot: number, k = 1) {
  const rad = ((rot % 360) * Math.PI) / 180
  const cs = Math.cos(rad), sn = Math.sin(rad)
  const rv = (x: number, y: number) => [x * cs - y * sn, x * sn + y * cs] as [number, number]
  const ex = rv(0.8660254, 0.5)
  const ey = rv(-0.8660254, 0.5)
  return { ex: [ex[0], ex[1] * k] as [number, number], ey: [ey[0], ey[1] * k] as [number, number] }
}

export const LEGS_X: number[] = [0.12, 0.39, 0.61, 0.88];