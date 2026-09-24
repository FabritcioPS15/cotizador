'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import {
  Bell, BookOpen, Box, Calculator, Check, ChevronDown, ClipboardList,
  FileDown, FileText, FolderKanban, Menu, Package, Plus, Search,
  Send, Settings, SlidersHorizontal, Sparkles, Upload, UserRound, Users, X, Building2, Cuboid, Move, Ruler
} from 'lucide-react'
import { categories, customers, formatMoney, products, projects, quotes, type Customer, type ProductCategory } from '@/data/mock'
import { HiOutlineArrowTrendingUp, HiOutlineBanknotes, HiOutlineClipboardDocumentList, HiOutlineCube, HiOutlineCurrencyDollar, HiOutlinePercentBadge, HiOutlineReceiptPercent, HiOutlineShoppingBag } from 'react-icons/hi2'

type Module = 'Cotizador' | 'Base de precios' | 'Clientes' | 'Proyectos' | 'Cotizaciones' | 'Configuración'
const nav: { label: Module; icon: typeof Calculator }[] = [
  { label: 'Cotizador', icon: Calculator },
  { label: 'Base de precios', icon: BookOpen },
  { label: 'Clientes', icon: Users },
  { label: 'Proyectos', icon: FolderKanban },
  { label: 'Cotizaciones', icon: FileText },
  { label: 'Configuración', icon: Settings },
]
const tone = (status: string) => `status status-${status.toLowerCase().replaceAll(' ', '-').replaceAll('ó', 'o')}`
const moneyInput = (v: string) => Number(v) || 0

function Status({ children }: { children: string }) { return <span className={tone(children)}><i />{children}</span> }
function Button({ children, primary = false, onClick, className = '', disabled = false }: { children: React.ReactNode; primary?: boolean; onClick?: () => void; className?: string; disabled?: boolean }) { return <button className={`app-button ${primary ? 'app-button-primary' : ''} ${className}`} onClick={onClick} disabled={disabled}>{children}</button> }
function Card({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) { return <section className={`app-card ${className}`} id={id}>{children}</section> }
function CardHeader({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) { return <div className="app-card-header"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div> }
function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`form-field ${className}`}><span>{label}</span>{children}</label> }
function Select({ children, value, onChange }: { children: React.ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) { return onChange ? <select value={value} onChange={onChange}>{children}</select> : <select defaultValue={value}>{children}</select> }

function Sidebar({ active, setActive, open, setOpen }: { active: Module; setActive: (m: Module) => void; open: boolean; setOpen: (v: boolean) => void }) {
  return <><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-brand"><img className="sidebar-brand-logo" src="/modiru.png" alt="MODIRU" /><div><b>MODIRU</b><span>Muebles que hacen espacios</span></div><button className="sidebar-close" onClick={() => setOpen(false)}><X size={17} /></button></div><div className="sidebar-label">GESTIÓN COMERCIAL</div><nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setOpen(false) }}><Icon size={17} /><span>{label}</span>{label === 'Cotizador' && <em>Nuevo</em>}</button>)}</nav><div className="sidebar-footer"><div className="avatar">AT</div><div><b>Ana Torres</b><span>Asesora comercial</span></div><ChevronDown size={15} /></div></aside>{open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}</>
}
function Header({ active, onMenu, query = '', onQuery = () => {}, results = [], onPick = () => {} }: { active: Module; onMenu: () => void; query?: string; onQuery?: (v: string) => void; results?: { id: string; label: string; sub: string; to: Module }[]; onPick?: (to: Module) => void }) {
  return (
    <header className="admin-header">
      <button className="menu-button" onClick={onMenu}><Menu size={20} /></button>
      <div className="breadcrumbs"><span>MODIRU</span><i>/</i><b>{active}</b></div>
      <div className="header-actions">
        <div className="global-search">
          <Search size={15} />
          <input placeholder="Buscar en MODIRU..." value={query} onChange={e => onQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') onQuery('') }} onBlur={() => { if (!document.activeElement?.closest('.search-results')) onQuery('') }} />
          {query.trim() !== '' && (
            <div className="search-results">
              {results.length === 0 ? <div className="search-empty">Sin resultados para “{query}”</div> : results.map(r => (
                <button key={r.id} className="search-result" onMouseDown={e => e.preventDefault()} onClick={() => onPick(r.to)}>
                  <b>{r.label}</b>
                  <span>{r.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="icon-button"><Bell size={18} /><i /></button>
        <div className="header-user"><div className="avatar small">AT</div><span>Ana Torres</span><ChevronDown size={14} /></div>
      </div>
    </header>
  );
}

function QuoteTable({ compact = false }: { compact?: boolean }) { return <div className="table-scroll"><table><thead><tr><th>N.º</th><th>Cliente</th><th>Proyecto</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Asesor</th><th /></tr></thead><tbody>{quotes.map(q => <tr key={q.id}><td><b className="table-id">{q.id}</b></td><td>{q.customer}</td><td>{q.project}</td><td>{q.date}</td><td><b>{formatMoney(q.total)}</b></td><td><Status>{q.status}</Status></td><td>{q.advisor}</td><td><button className="row-more">•••</button></td></tr>)}</tbody></table>{!compact && <div className="pagination"><span>Mostrando 1–4 de 24 cotizaciones</span><div><button>‹</button><button className="current">1</button><button>2</button><button>3</button><button>›</button></div></div>}</div> }

function Section({ title, detail, children, number, icon: Icon, id }: { title: string; detail?: string; children: React.ReactNode; number?: string; icon?: typeof Calculator; id?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <Card className={`quote-section${open ? '' : ' collapsed'}`} id={id}>
      <button type="button" className="quote-section-head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <div>{Icon && <span className="section-icon"><Icon size={15} /></span>}{number && <span className="section-number">{number}</span>}<div><h2>{title}</h2>{detail && <p>{detail}</p>}</div></div>
        <ChevronDown size={16} />
      </button>
      {open && children}
    </Card>
  );
}
function CheckRow({ label, checked, price, onChange }: { label: string; checked: boolean; price: string; onChange: () => void }) { return <label className="check-option"><input type="checkbox" checked={checked} onChange={onChange} /><span className="fake-check"><Check size={12} /></span><span>{label}</span><b>{price}</b></label> }

type LeadUnit = 'día' | 'semana' | 'mes';
const leadPlural: Record<LeadUnit, string> = { día: 'días', semana: 'semanas', mes: 'meses' };
function LeadTime({ qty, unit, onQty, onUnit }: { qty: string; unit: LeadUnit; onQty: (v: string) => void; onUnit: (u: LeadUnit) => void }) { return <span className="lead-time"><input type="number" min="1" value={qty} onChange={e => onQty(e.target.value)} /><select value={unit} onChange={e => onUnit(e.target.value as LeadUnit)}><option value="día">Días</option><option value="semana">Semanas</option><option value="mes">Meses</option></select></span> }

function FurniturePlan({ dimensions, material, selected }: {
  dimensions: { width: string; height: string; depth: string };
  material: typeof products[number];
  selected: { drawers: boolean; handles: boolean; led: boolean; hinges: boolean };
}) {
  const W = Math.max(40, moneyInput(dimensions.width));
  const H = Math.max(40, moneyInput(dimensions.height));
  const D = Math.max(30, moneyInput(dimensions.depth));
  const sw = material.swatch && material.swatch.startsWith('#') ? material.swatch : '#c9a27a';
  const ink = '#17232d';
  const dark = '#33444f';
  const accent = '#1d7a63';
  const metal = '#8ea0ac';

  const hx = (v: string) => { const n = parseInt(v.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return (ch: number, s: number) => '#' + [r + 255 * s, g + 255 * s + 20 * ch, b + 255 * s - 30 * ch].map(c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join(''); };
  const tone = hx(sw);
  const cLight = tone(0, 0.16);
  const cBase = tone(0, 0);
  const cDeep = tone(0, -0.16);
  const cDark = tone(0, -0.3);

  const sf = Math.min(430 / W, 480 / H);
  const fw = W * sf, fh = H * sf;
  const fx = 250 - fw / 2, fy = 350 - fh / 2;
  const ct = Math.max(16, fh * 0.07);
  const ledH = selected.led ? Math.max(10, fh * 0.05) : 0;
  const drawersH = selected.drawers ? Math.max(30, fh * 0.34) : 0;
  const doorY = fy + ct + ledH + drawersH;
  const doorH = fy + fh - doorY;

  const ss = Math.min(280 / D, 230 / H);
  const sideW = D * ss, sideH = H * ss;
  const sx = 770 - sideW / 2, sy = 175 - sideH / 2;

  const st = Math.min(270 / W, 235 / D);
  const topW = W * st, topH = D * st;
  const tx = 770 - topW / 2, ty = 505 - topH / 2;

  const bevel = (x: number, y: number, w: number, h: number) => (
    <g pointerEvents="none">
      <rect x={x} y={y} width={w} height={Math.max(2, h * 0.03)} fill="#ffffff" opacity={0.3} />
      <rect x={x} y={y + h - Math.max(2, h * 0.03)} width={w} height={Math.max(2, h * 0.03)} fill="#000000" opacity={0.12} />
      <rect x={x} y={y} width={Math.max(2, w * 0.02)} height={h} fill="#ffffff" opacity={0.22} />
      <rect x={x + w - Math.max(2, w * 0.02)} y={y} width={Math.max(2, w * 0.02)} height={h} fill="#000000" opacity={0.1} />
    </g>
  );

  const HL = ({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) => (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke="#33444f" strokeWidth={1.3} />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke="#33444f" strokeWidth={1.3} />
      <rect x={(x1 + x2) / 2 - 36} y={y - 21} width={72} height={17} rx={4} fill="#ffffff" stroke="#d3dce2" />
      <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={ink}>{label}</text>
    </g>
  );
  const VL = ({ y1, y2, x, label }: { y1: number; y2: number; x: number; label: string }) => {
    const mid = (y1 + y2) / 2;
    return (
      <g>
        <line x1={x} y1={y1} x2={x} y2={y2} stroke="#33444f" strokeWidth={1.3} />
        <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke="#33444f" strokeWidth={1.3} />
        <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke="#33444f" strokeWidth={1.3} />
        <g transform={`rotate(-90 ${x} ${mid})`}>
          <rect x={x - 36} y={mid - 8.5} width={72} height={17} rx={4} fill="#ffffff" stroke="#d3dce2" />
          <text x={x} y={mid + 4} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={ink}>{label}</text>
        </g>
      </g>
    );
  };
  const CAPT = ({ x, y, t }: { x: number; y: number; t: string }) => (
    <g>
      <text x={x} y={y} textAnchor="middle" fontSize={17} fontWeight={800} fill={ink}>{t}</text>
      <rect x={x - 34} y={y + 7} width={68} height={3} rx={1.5} fill={accent} />
    </g>
  );

  return (
    <div className="plan-wrap">
      <svg viewBox="0 0 1000 700" className="plan-svg" role="img" aria-label="Plano de fabricación del mueble a medida">
        <defs>
          <pattern id="plan-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M100 0 H0 V100" fill="none" stroke="#e7edf0" strokeWidth="1" />
          </pattern>
          <pattern id="plan-grain" width="70" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
            <path d="M0 18 Q 18 10 38 16 T 70 14" stroke={cDark} strokeWidth="1.1" fill="none" opacity="0.18" />
            <path d="M0 40 Q 20 32 42 38 T 70 36" stroke={cDark} strokeWidth="1.3" fill="none" opacity="0.15" />
            <path d="M0 62 Q 18 54 40 60 T 70 58" stroke={cDark} strokeWidth="0.9" fill="none" opacity="0.16" />
            <ellipse cx="52" cy="16" rx="3.2" ry="1.7" fill={cDark} opacity="0.2" />
            <ellipse cx="16" cy="48" rx="2.6" ry="1.5" fill={cDark} opacity="0.16" />
          </pattern>
          <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={cLight} />
            <stop offset="0.08" stopColor={cBase} />
            <stop offset="0.96" stopColor={cDeep} />
            <stop offset="1" stopColor={cDark} />
          </linearGradient>
          <linearGradient id="gFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={cLight} />
            <stop offset="0.18" stopColor={cBase} />
            <stop offset="1" stopColor={cDeep} />
          </linearGradient>
          <linearGradient id="gCounter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={cLight} />
            <stop offset="0.35" stopColor={cBase} />
            <stop offset="1" stopColor={cDark} />
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

        <rect x={24} y={24} width={952} height={652} rx={4} fill="#ffffff" stroke={dark} strokeWidth={2.5} />
        <rect x={30} y={30} width={940} height={640} rx={2} fill="url(#plan-grid)" opacity={0.6} stroke="#d3dce2" strokeWidth="1" />

        <g>
          <rect x={30} y={32} width={266} height={40} rx={3} fill="#f5f8f7" stroke="#d3dce2" strokeWidth="1" filter="url(#soft)" />
          <text x={44} y={48} fontSize={15} fontWeight={800} fill={accent}>MODIRU MUEBLES</text>
          <text x={44} y={66} fontSize={11.5} fill="#5b6b74" letterSpacing="1.5">PLANO DE FABRICACIÓN</text>
          <rect x={296} y={36} width={14} height={28} rx={3} fill={accent} opacity={0.9} />
          <text x={303} y={46} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">S</text>
          <text x={303} y={59} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">C</text>
          <text x={316} y={53} fontSize={11} fill="#5b6b74">Escala gráfica aproximada · cm</text>
        </g>

        <CAPT x={250} y={104} t="VISTA FRONTAL" />
        <g>
          <rect x={fx + 5} y={fy + fh + 3} width={fw} height={5} rx={2.5} fill="#17232d" opacity={0.12} />
          <rect x={fx} y={fy} width={fw} height={fh} rx={2.5} fill="url(#gWood)" stroke={dark} strokeWidth={2.5} />
          <rect x={fx + 2} y={fy + 2} width={fw - 4} height={fh - 4} rx={2} fill="url(#plan-grain)" />
          <rect x={fx} y={fy} width={fw} height={ct} rx={2.5} fill="url(#gCounter)" stroke={dark} strokeWidth={2} />
          <rect x={fx + 2.5} y={fy + 2} width={fw - 5} height={3} rx={1.5} fill="#ffffff" opacity={0.35} />
          {selected.led && (
            <g>
              <rect x={fx + 3} y={fy + ct} width={fw - 6} height={ledH} rx={1.5} fill="url(#gLED)" stroke="#d9a520" strokeWidth={1} />
              <rect x={fx + 3} y={fy + ct} width={fw - 6} height={2.5} fill="#ffffff" opacity={0.4} />
              <text x={fx + fw / 2} y={fy + ct + ledH - 2.5} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#6b5a00" letterSpacing="1">LED</text>
            </g>
          )}
          {drawersH > 0 && (
            <g>
              {[0, 1].map(i => {
                const dy = fy + ct + ledH + drawersH * i * 0.5;
                const dh = drawersH / 2 - 2;
                return (
                  <g key={i}>
                    <rect x={fx + 2} y={dy} width={fw - 4} height={dh} rx={2.5} fill="url(#gFront)" stroke={dark} strokeWidth={1.4} filter="url(#soft)" />
                    <rect x={fx + 2} y={dy} width={fw - 4} height={dh} rx={2.5} fill="url(#plan-grain)" />
                    {bevel(fx + 2, dy, fw - 4, dh)}
                    <line x1={fx + 2} y1={dy + dh} x2={fx + fw - 2} y2={dy + dh} stroke="#000000" opacity={0.16} strokeWidth={1.2} />
                    {selected.handles && (
                      <rect x={fx + fw / 2 - 27} y={dy + dh / 2 - 3.5} width={54} height={7} rx={3.5} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
                    )}
                  </g>
                );
              })}
            </g>
          )}
          {doorH > 0 && (
            <g>
              {[0, 1].map(i => {
                const dx = fx + (fw / 2) * i;
                const dw = fw / 2 - 2;
                return (
                  <g key={i}>
                    <rect x={dx + 1.5} y={doorY} width={dw} height={doorH} rx={2.5} fill="url(#gFront)" stroke={dark} strokeWidth={1.4} filter="url(#soft)" />
                    <rect x={dx + 1.5} y={doorY} width={dw} height={doorH} rx={2.5} fill="url(#plan-grain)" />
                    {bevel(dx + 1.5, doorY, dw, doorH)}
                    {selected.handles && (
                      <rect x={dx + (i === 0 ? dw - 30 : 24)} y={doorY + doorH / 2 - 16} width={6} height={32} rx={3} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
                    )}
                  </g>
                );
              })}
              <line x1={fx + fw / 2} y1={doorY} x2={fx + fw / 2} y2={doorY + doorH} stroke="#000000" opacity={0.15} strokeWidth={1.6} />
              {selected.hinges && [0.18, 0.5, 0.82].map(t => (
                <g key={t}>
                  <rect x={fx - 2} y={doorY + doorH * t - 3} width={7} height={10} rx={2} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
                  <rect x={fx + fw - 5} y={doorY + doorH * t - 3} width={7} height={10} rx={2} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
                </g>
              ))}
            </g>
          )}
          <HL x1={fx} x2={fx + fw} y={fy - 40} label={`${W} cm`} />
          <VL y1={fy} y2={fy + fh} x={fx - 42} label={`${H} cm`} />
        </g>

        <CAPT x={770} y={104} t="VISTA LATERAL" />
        <g>
          <rect x={sx + 5} y={sy + sideH + 3} width={sideW} height={5} rx={2.5} fill="#17232d" opacity={0.12} />
          <rect x={sx} y={sy} width={sideW} height={sideH} rx={2.5} fill="url(#gWood)" stroke={dark} strokeWidth={2.5} />
          <rect x={sx} y={sy + sideH - Math.max(11, sideH * 0.05)} width={sideW} height={Math.max(11, sideH * 0.05)} rx={2} fill={accent} stroke={dark} strokeWidth={1.4} />
          <rect x={sx + 2} y={sy + 2} width={sideW - 4} height={sideH - 4} rx={2} fill="url(#plan-grain)" />
          <rect x={sx + sideW - sideW * 0.055} y={sy} width={sideW * 0.055} height={sideH} fill={cDeep} opacity={0.65} />
          <line x1={sx + sideW * 0.5} y1={sy + sideH * 0.18} x2={sx + sideW * 0.5} y2={sy + sideH * 0.92} stroke={cDark} strokeWidth={1.8} opacity={0.7} />
          <rect x={sx + sideW * 0.5 - 3} y={sy + sideH * 0.18} width={6} height={sideH * 0.74} fill="url(#gFront)" stroke={dark} strokeWidth={0.8} opacity={0.9} />
          {selected.led && <rect x={sx + sideW * 0.06} y={sy + sideH * 0.11} width={sideW * 0.5} height={6} rx={1} fill="url(#gLED)" stroke="#d9a520" strokeWidth={0.8} />}
          <HL x1={sx} x2={sx + sideW} y={sy - 34} label={`${D} cm`} />
          <VL y1={sy} y2={sy + sideH} x={sx - 40} label={`${H} cm`} />
        </g>

        <CAPT x={770} y={366} t="PLANTA" />
        <g>
          <rect x={tx} y={ty} width={topW} height={topH} rx={3} fill="url(#gWood)" stroke={dark} strokeWidth={2.5} />
          <rect x={tx + 5} y={ty + 5} width={topW - 10} height={topH - 10} rx={2} fill="url(#plan-grain)" />
          <rect x={tx + 3} y={ty + 3} width={topW - 6} height={3} rx={1.5} fill="#ffffff" opacity={0.3} />
          <rect x={tx + 3} y={ty + topH - 6} width={topW - 6} height={3} rx={1.5} fill="#000000" opacity={0.14} />
          {selected.led && (
            <g>
              <rect x={tx + 4} y={ty + 5} width={topW - 8} height={Math.max(9, topH * 0.1)} rx={1.5} fill="url(#gLED)" stroke="#d9a520" strokeWidth={1} />
              <text x={tx + 6} y={ty + 11} fontSize={8} fill="#8a6d00">LED</text>
            </g>
          )}
          {selected.handles && (
            <g>
              <rect x={tx + topW / 2 - 4} y={ty + topH / 2 - 18} width={8} height={14} rx={2} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
              <rect x={tx + topW / 2 + 5} y={ty + topH / 2 - 18} width={8} height={14} rx={2} fill="url(#gMetal)" stroke={metal} strokeWidth={0.8} />
            </g>
          )}
          <HL x1={tx} x2={tx + topW} y={ty + topH + 32} label={`${W} cm`} />
          <VL y1={ty} y2={ty + topH} x={tx - 40} label={`${D} cm`} />
        </g>

        <g>
          <text x={46} y={660} fontSize={12} fontWeight={700} fill={ink}>MEDIDAS</text>
          <text x={112} y={660} fontSize={12} fill="#5b6b74">{W} × {D} × {H} cm (Ancho × Fondo × Alto)</text>
          <text x={652} y={660} fontSize={12} fontWeight={700} fill={ink}>MATERIAL</text>
          <text x={716} y={660} fontSize={12} fill="#5b6b74">{material.name} · {material.brand}</text>
        </g>
      </svg>
      <div className="plan-legend">
        <span><i style={{ background: sw, border: '1px solid #33444f' }} />Melamina {material.name}</span>
        <span><i style={{ background: '#ffe08a', border: '1px solid #d9a520' }} />Iluminación LED</span>
        <span><i style={{ background: dark }} />Estructura / tapacanto</span>
        <span><i style={{ background: accent }} />Zócalo</span>
        <span><i style={{ background: '#c9b08c', border: '1px solid #33444f' }} />Veteado natural</span>
      </div>
    </div>
  );
}

function FurnitureIso({ dimensions, material, selected, rot }: {
  dimensions: { width: string; height: string; depth: string };
  material: typeof products[number];
  selected: { drawers: boolean; handles: boolean; led: boolean; hinges: boolean };
  rot: number;
}) {
  const W = Math.max(40, moneyInput(dimensions.width));
  const H = Math.max(40, moneyInput(dimensions.height));
  const D = Math.max(30, moneyInput(dimensions.depth));
  const sw = material.swatch && material.swatch.startsWith('#') ? material.swatch : '#c9a27a';
  const ink = '#17232d';
  const dark = '#33444f';
  const accent = '#1d7a63';

  const tone = (pct: number) => '#' + sw.slice(1).match(/../g)!.map(h => Math.round(Math.min(255, Math.max(0, parseInt(h, 16) * (1 + pct)))).toString(16).padStart(2, '0')).join('');
  const cLight = tone(0.18), cBase = sw, cDeep = tone(-0.16), cDark = tone(-0.3);

  const rad = ((rot % 360) * Math.PI) / 180;
  const cs = Math.cos(rad), sn = Math.sin(rad);
  const rv = (x: number, y: number) => [x * cs - y * sn, x * sn + y * cs] as [number, number];
  const ex = rv(0.8660254, 0.5);
  const ey = rv(-0.8660254, 0.5);

  const corners: [number, number, number][] = [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H]];
  const raw = corners.map(c => [ex[0] * c[0] + ey[0] * c[1], ex[1] * c[0] + ey[1] * c[1] - c[2]]);
  const xs = raw.map(p => p[0]), ys = raw.map(p => p[1]);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const scl = Math.min(500 / spanX, 440 / spanY);
  const proj = (x: number, y: number, z: number) => [(ex[0] * x + ey[0] * y) * scl, (ex[1] * x + ey[1] * y - z) * scl] as [number, number];
  const projPts = corners.map(c => proj(c[0], c[1], c[2]));
  const cx0 = (Math.min(...projPts.map(p => p[0])) + Math.max(...projPts.map(p => p[0]))) / 2;
  const cy0 = (Math.min(...projPts.map(p => p[1])) + Math.max(...projPts.map(p => p[1]))) / 2;

  const visX = ex[1] >= 0;
  const visY = ey[1] >= 0;
  const xf = visX ? W : 0;
  const yf = visY ? D : 0;
  const bkY = visY ? 0 : D;

  const ctM = Math.max(6, H * 0.08);
  const ledM = selected.led ? Math.max(5, H * 0.05) : 0;
  const drM = selected.drawers ? Math.max(12, H * 0.34) : 0;
  const dLow = Math.max(0, H - ctM - ledM - drM);
  const plM = Math.max(4, H * 0.05);

  const P = (x: number, y: number, z: number) => proj(x, y, z).map(n => n.toFixed(1)).join(',');
  const q = (pts: [number, number, number][], fill: string, sw = 1.4, op = 1) => (
    <polygon points={pts.map(p => P(p[0], p[1], p[2])).join(' ')} fill={fill} stroke={dark} strokeWidth={sw} strokeLinejoin="round" opacity={op} />
  );
  const line = (a: [number, number, number], b: [number, number, number], stroke: string, w: number) => (
    <line x1={P(a[0], a[1], a[2]).split(',')[0]} y1={P(a[0], a[1], a[2]).split(',')[1]} x2={P(b[0], b[1], b[2]).split(',')[0]} y2={P(b[0], b[1], b[2]).split(',')[1]} stroke={stroke} strokeWidth={w} strokeLinecap="round" />
  );
  const IsoDim = ({ a, b, label, vertical = false }: { a: [number, number, number]; b: [number, number, number]; label: string; vertical?: boolean }) => {
    const A = proj(a[0], a[1], a[2]), B = proj(b[0], b[1], b[2]);
    const dx = B[0] - A[0], dy = B[1] - A[1];
    let ux: number, uy: number;
    if (vertical) {
      ux = A[0] >= 0 ? 1 : -1;
      uy = 0;
    } else {
      const up = (dy !== 0 || dx !== 0) ? ([-dy, dx] as [number, number]) : ([0, -1] as [number, number]);
      ux = up[1] <= 0 ? up[0] : -up[0];
      uy = up[1] <= 0 ? up[1] : -up[1];
    }
    const len = Math.hypot(ux, uy) || 1;
    ux /= len; uy /= len;
    const off = 34;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    const tx = mx + ux * off, ty = my + uy * off;
    return (
      <g>
        <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#33444f" strokeWidth={1.3} />
        <circle cx={A[0]} cy={A[1]} r={2.4} fill="#ffffff" stroke="#33444f" strokeWidth={1.2} />
        <circle cx={B[0]} cy={B[1]} r={2.4} fill="#ffffff" stroke="#33444f" strokeWidth={1.2} />
        <rect x={tx - 35} y={ty - 9.5} width={70} height={17} rx={4} fill="#ffffff" stroke="#d3dce2" />
        <text x={tx} y={ty + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={ink}>{label}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 1000 700" className="plan-svg" role="img" aria-label="Vista 3D del mueble a medida">
      <defs>
        <pattern id="isoGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 H0 V100" fill="none" stroke="#e7edf0" strokeWidth="1" />
        </pattern>
        <pattern id="isoGrain" width="70" height="70" patternUnits="objectBoundingBox">
          <path d="M0 18 Q 18 10 38 16 T 70 14" stroke={cDark} strokeWidth="1.1" fill="none" opacity="0.2" />
          <path d="M0 40 Q 20 32 42 38 T 70 36" stroke={cDark} strokeWidth="1.3" fill="none" opacity="0.16" />
          <ellipse cx="52" cy="16" rx="3" ry="1.6" fill={cDark} opacity="0.2" />
        </pattern>
        <linearGradient id="isoWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cLight} />
          <stop offset="0.12" stopColor={cBase} />
          <stop offset="0.95" stopColor={cDeep} />
          <stop offset="1" stopColor={cDark} />
        </linearGradient>
        <linearGradient id="isoCounter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cLight} />
          <stop offset="0.3" stopColor={cBase} />
          <stop offset="1" stopColor={cDark} />
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
      </defs>

      <rect x={24} y={24} width={952} height={652} rx={4} fill="#ffffff" stroke={dark} strokeWidth={2.5} />
      <rect x={30} y={30} width={940} height={640} rx={2} fill="url(#isoGrid)" opacity={0.6} stroke="#d3dce2" strokeWidth="1" />

      <text x={500} y={64} textAnchor="middle" fontSize={17} fontWeight={800} fill={ink}>VISTA 3D ISOMÉTRICA</text>
      <text x={500} y={82} textAnchor="middle" fontSize={11.5} fill="#5b6b74">Gira el mueble con los botones · medidas actualizadas en tiempo real</text>

      <g transform={`translate(${500 - cx0} ${345 - cy0})`}>
        {q([[xf, 0, 0], [xf, D, 0], [xf, D, H], [xf, 0, H]], 'url(#isoWood)', 1.4)}
        <polygon points={`${P(xf, 0, 0)} ${P(xf, D, 0)} ${P(xf, D, H)} ${P(xf, 0, H)}`} fill="url(#isoGrain)" />
        <polygon points={`${P(xf, bkY, 0)} ${P(xf, bkY + Math.max(0.35, D * 0.02), 0)} ${P(xf, bkY + Math.max(0.35, D * 0.02), H)} ${P(xf, bkY, H)}`} fill={cDeep} opacity={0.5} />
        {q([[xf, 0, H], [xf, D, H], [xf, D, H - ctM], [xf, 0, H - ctM]], 'url(#isoCounter)', 1.4)}
        {q([[xf, 0, 0], [xf, D, 0], [xf, D, plM], [xf, 0, plM]], accent, 1.2)}

        {q([[0, yf, 0], [W, yf, 0], [W, yf, H], [0, yf, H]], 'url(#isoWood)', 1.4)}
        <polygon points={`${P(0, yf, 0)} ${P(W, yf, 0)} ${P(W, yf, H)} ${P(0, yf, H)}`} fill="url(#isoGrain)" />
        {q([[0, yf, H], [W, yf, H], [W, yf, H - ctM], [0, yf, H - ctM]], 'url(#isoCounter)', 1.4)}
        {q([[0, yf, 0], [W, yf, 0], [W, yf, plM], [0, yf, plM]], accent, 1.2)}

        {selected.led && ledM > 0 && q([[0, yf, H - ctM], [W, yf, H - ctM], [W, yf, H - ctM - ledM], [0, yf, H - ctM - ledM]], 'url(#isoLED)', 1.2)}
        {selected.led && <polygon points={`${P(0, yf, H - ctM)} ${P(W, yf, H - ctM)} ${P(W, yf, H - ctM - ledM)} ${P(0, yf, H - ctM - ledM)}`} fill="#ffffff" opacity={0.25} />}

        {drM > 0 && (
          <g>
            {[0, 1].map(i => {
              const zm = H - ctM - ledM - drM / 2 * (i + 1);
              const zt = H - ctM - ledM - drM / 2 * i;
              const ym = yf;
              return (
                <g key={i}>
                  {q([[0, ym, zt], [W, ym, zt], [W, ym, zm], [0, ym, zm]], 'url(#isoWood)', 1.2)}
                  {selected.handles && line([W / 2 - 22, ym, (zt + zm) / 2], [W / 2 + 22, ym, (zt + zm) / 2], 'url(#isoMetal)', 5)}
                </g>
              );
            })}
          </g>
        )}
        {dLow > 0 && (
          <g>
            {q([[0, yf, dLow], [W / 2, yf, dLow], [W / 2, yf, 0], [0, yf, 0]], 'url(#isoWood)', 1.2)}
            {q([[W / 2, yf, dLow], [W, yf, dLow], [W, yf, 0], [W / 2, yf, 0]], 'url(#isoWood)', 1.2)}
            {line([W / 2, yf, dLow], [W / 2, yf, 0], cDark, 1.6)}
            {selected.handles && (
              <g>
                {line([W / 2 - 4, yf, dLow * 0.72], [W / 2 - 4, yf, dLow * 0.28], 'url(#isoMetal)', 5)}
                {line([W / 2 + 4, yf, dLow * 0.72], [W / 2 + 4, yf, dLow * 0.28], 'url(#isoMetal)', 5)}
              </g>
            )}
            {selected.hinges && [0.25, 0.5, 0.75].map(t => (
              <g key={t}>
                <circle cx={Number(P(0, yf, dLow * t).split(',')[0])} cy={Number(P(0, yf, dLow * t).split(',')[1])} r={2.6} fill={cDark} />
                <circle cx={Number(P(W, yf, dLow * t).split(',')[0])} cy={Number(P(W, yf, dLow * t).split(',')[1])} r={2.6} fill={cDark} />
              </g>
            ))}
          </g>
        )}
        <polygon points={`${P(0, 0, H)} ${P(W, 0, H)} ${P(W, D, H)} ${P(0, D, H)}`} fill={cBase} stroke={dark} strokeWidth={1.6} />
        <polygon points={`${P(0, 0, H)} ${P(W, 0, H)} ${P(W, D, H)} ${P(0, D, H)}`} fill="url(#isoGrain)" />
        <polygon points={`${P(0, 0, H)} ${P(W, 0, H)} ${P(W, D, H)} ${P(0, D, H)}`} fill={cLight} opacity={0.16} />
        <polygon points={`${P(2, 0, H)} ${P(W - 2, 0, H)} ${P(W - 2, D, H)} ${P(2, D, H)}`} fill="none" stroke={cDark} strokeWidth={0.8} opacity={0.8} />
        {selected.led && (
          <g>
            {line([2, yf, H - 0.5], [W - 2, yf, H - 0.5], '#ffd465', 5)}
            {line([2, yf, H - 2], [W - 2, yf, H - 2], '#fff3c4', 3)}
          </g>
        )}

        <IsoDim a={[0, yf, H]} b={[W, yf, H]} label={`${W} cm`} />
        <IsoDim a={[xf, 0, H]} b={[xf, D, H]} label={`${D} cm`} />
        <IsoDim a={[0, yf, 0]} b={[0, yf, H]} label={`${H} cm`} />
      </g>

      <g>
        <text x={46} y={660} fontSize={12} fontWeight={700} fill={ink}>MEDIDAS</text>
        <text x={112} y={660} fontSize={12} fill="#5b6b74">{W} × {D} × {H} cm (Ancho × Fondo × Alto)</text>
        <text x={652} y={660} fontSize={12} fontWeight={700} fill={ink}>MATERIAL</text>
        <text x={716} y={660} fontSize={12} fill="#5b6b74">{material.name} · {material.brand}</text>
      </g>
    </svg>
  );
}

function PlanView({ dimensions, material, selected }: {
  dimensions: { width: string; height: string; depth: string };
  material: typeof products[number];
  selected: { drawers: boolean; handles: boolean; led: boolean; hinges: boolean };
}) {
  const [mode, setMode] = useState<'2d' | '3d'>('3d');
  const [rot, setRot] = useState(0);
  return (
    <div>
      <div className="plan-tabs">
        <button className={mode === '3d' ? 'active' : ''} onClick={() => setMode('3d')}><Cuboid size={16} /> Vista 3D<span className="plan-tag">3D</span></button>
        <button className={mode === '2d' ? 'active' : ''} onClick={() => setMode('2d')}><Ruler size={16} /> Plano 2D</button>
        {mode === '3d' && (
          <span className="iso-toolbar">
            <button onClick={() => setRot(r => r - 90)}><Move size={14} /> ⟲</button>
            <button onClick={() => setRot(r => r + 90)}>⟳</button>
          </span>
        )}
      </div>
      {mode === '2d' ? (
        <FurniturePlan dimensions={dimensions} material={material} selected={selected} />
      ) : (
        <FurnitureIso dimensions={dimensions} material={material} selected={selected} rot={rot} />
      )}
    </div>
  );
}

function PdfTemplate({ client, material, dimensions, calc, notes, selected, meta, overrideTotal }: {
  client: typeof customers[number];
  material: typeof products[number];
  dimensions: { width: string; height: string; depth: string; quantity: string };
  calc: { area: number; edge: number; direct: number; cost: number; beforeTax: number; igv: number; total: number; qty: number };
  notes: string;
  selected?: { hinges: boolean; slides: boolean; handles: boolean; led: boolean; drawers: boolean; delivery: boolean; installation: boolean; survey: boolean; removal: boolean };
  meta: { number: string; date: string; validity: string; status: string; address: string; projectName: string; environment: string; furnitureType: string; advisor: string; leadDays: string; tapacanto: string; paymentTerms: string; guarantee: string; curSymbol?: string; curRate?: number };
  overrideTotal?: number | null;
}) {
  const money = (value: number) => (meta.curSymbol || 'S/ ') + (value * (meta.curRate || 1)).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const hasDelivery = selected?.delivery ?? true;
  const hasInstallation = selected?.installation ?? true;
  const hasSurvey = selected?.survey ?? false;
  const hasRemoval = selected?.removal ?? false;
  const hasServices = hasDelivery || hasInstallation || hasSurvey || hasRemoval;

  const serviceList = [
    hasDelivery && 'Despacho a domicilio',
    hasInstallation && 'Instalación y montaje',
    hasSurvey && 'Visita técnica y medición',
    hasRemoval && 'Retiro de muebles antiguos'
  ].filter(Boolean).join(', ');

  const servicesNet = hasServices ? Math.round(((hasDelivery ? 80 : 0) + (hasInstallation ? 220 : 0) + (hasSurvey ? 60 : 0) + (hasRemoval ? 120 : 0)) * 1.35 * 1.08 * 100) / 100 : 0;
  const furnitureNet = Math.max(0, calc.beforeTax - servicesNet);
  const unitFurnitureNet = furnitureNet / Math.max(1, calc.qty);
  const finalTotal = overrideTotal != null && overrideTotal > 0 ? overrideTotal : calc.total;
  const igvToShow = overrideTotal != null && overrideTotal > 0 ? Math.max(0, overrideTotal - calc.beforeTax) : calc.igv;

  const accessoriesList = [
    selected?.hinges && 'Bisagras cierre suave',
    selected?.slides && 'Correderas telescópicas pesadas',
    selected?.handles && 'Tiradores estándar de perfil',
    selected?.drawers && 'Cajones interiores reforzados',
    selected?.led && 'Iluminación LED cálida integrada'
  ].filter(Boolean).join(', ') || 'Herrajes estándar';

  return (
    <section id="pdf-template" aria-label="Cotización para impresión">
      <div className="pdf-header">
        <div className="pdf-company-wrap">
          <div className="pdf-brand">
            <img className="pdf-brand-mark" src="/modiru.png" alt="MODIRU" />
          </div>
        </div>
        <div className="pdf-quote">
          <span className="pdf-quote-label">COTIZACIÓN</span>
          <strong>N° {meta.number}</strong>
          <span>Fecha de emisión: {meta.date}</span>
          <span>Estado: {meta.status}</span>
          <span className="pdf-quote-badge">Válida por {meta.validity}</span>
        </div>
      </div>

      <div className="pdf-block">
        <div className="pdf-block-title">DATOS DEL CLIENTE Y PROYECTO</div>
        <div className="pdf-info-grid">
          <div>
            <p><b>Cliente:</b> {client.name}</p>
            <p><b>RUC / DNI:</b> {client.taxId}</p>
            <p><b>Contacto:</b> {client.name}</p>
            <p><b>Teléfono:</b> {client.phone}</p>
            <p><b>Email:</b> {client.email}</p>
          </div>
          <div>
            <p><b>Proyecto:</b> {meta.projectName}</p>
            <p><b>Ambiente:</b> {meta.environment} / {meta.furnitureType}</p>
            <p><b>Dirección:</b> {meta.address}</p>
            <p><b>Medidas:</b> {dimensions.width} cm (ancho) × {dimensions.height} cm (alto) × {dimensions.depth} cm (fondo)</p>
            <p><b>Plazo estimado:</b> {meta.leadDays}</p>
            <p><b>Asesor comercial:</b> {meta.advisor}</p>
          </div>
        </div>
      </div>

      <table className="pdf-table-ref">
        <thead>
          <tr>
            <th className="col-detalle">Detalle</th>
            <th className="col-cant">Cant.</th>
            <th className="col-uni">Uni.</th>
            <th className="col-neto">Neto</th>
            <th className="col-total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="col-detalle">
              <div className="item-name">Fabricación de Mueble en Melamina a Medida</div>
              <div className="item-description">
                <p><b>{material.name}</b> ({material.brand} · {material.detail}) 18 mm. Ancho {dimensions.width} × Alto {dimensions.height} × Fondo {dimensions.depth} cm. Área: {calc.area.toFixed(2)} m², {calc.edge.toFixed(2)} ml {meta.tapacanto.toLowerCase()}.</p>
                <p>Incluye: {accessoriesList}. Plazo: {meta.leadDays}. No incluye modificaciones civiles ni eléctricas.</p>
              </div>
            </td>
            <td className="col-cant">{calc.qty}</td>
            <td className="col-uni">UNID</td>
            <td className="col-neto">{money(unitFurnitureNet)}</td>
            <td className="col-total">{money(furnitureNet)}</td>
          </tr>

          {hasServices && (
            <tr>
              <td className="col-detalle">
                <div className="item-name">Servicios complementarios</div>
                <div className="item-description">
                  <p>Traslado en unidad acondicionada con embalaje protector, montaje, nivelación y fijación por técnico calificado. Se entrega área limpia y operativa.</p>
                  <p>Incluye: {serviceList}.</p>
                </div>
              </td>
              <td className="col-cant">1</td>
              <td className="col-uni">GLB</td>
              <td className="col-neto">{money(servicesNet)}</td>
              <td className="col-total">{money(servicesNet)}</td>
            </tr>
          )}

          <tr className="pdf-summary-row">
            <td colSpan={2} className="pdf-disclaimer-cell">
              <p className="pdf-disclaimer-text">
                Precios sujetos a cambio sin previo aviso. Variaciones en tipo de cambio o materias primas pueden afectar valores cotizados.
              </p>
              {notes && (
                <p className="pdf-notes-text">
                  <b>Obs.:</b> {notes}
                </p>
              )}
              <p className="pdf-terms-text">
                <b>Condiciones:</b> {meta.paymentTerms}. Validez: {meta.validity}.
              </p>
            </td>
            <td colSpan={3} className="pdf-totals-cell">
              <table className="pdf-nested-totals">
                <tbody>
                  <tr>
                    <td className="tot-lbl">Neto:</td>
                    <td className="tot-val">{money(calc.beforeTax)}</td>
                  </tr>
                  <tr>
                    <td className="tot-lbl">IGV (18%):</td>
                    <td className="tot-val">{money(igvToShow)}</td>
                  </tr>
                  <tr className="tot-final-row">
                    <td className="tot-lbl">Total:</td>
                    <td className="tot-val">{money(finalTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="pdf-auth-section">
        <div className="pdf-auth-col">
          <div className="pdf-signature-line" />
          <b>MODIRU MUEBLES S.A.C.</b>
          <span>Ana Torres · Asesora Comercial</span>
          <small>Firma y sello autorizado</small>
        </div>
        <div className="pdf-auth-col">
          <div className="pdf-signature-line" />
          <b>Aceptación del Cliente</b>
          <span>{client.name}</span>
          <small>DNI / RUC: {client.taxId} · Fecha: ____/____/2026</small>
        </div>
      </div>
      <div className="pdf-bottom-bar">
        <div className="pdf-bottom-address">
          <b>MODIRU MUEBLES S.A.C.</b>
          <span>RUC 20601234567 · Av. Principal 123, Lima – Perú · +51 987 654 321 · hola@modiru.pe · www.modiru.pe</span>
        </div>
        <div className="pdf-bottom-grid">
          <div className="pdf-bottom-col">
            <b>Condiciones generales</b>
            <p><span>Forma de pago:</span> {meta.paymentTerms}.</p>
            <p><span>Validez de la oferta:</span> {meta.validity}.</p>
            <p><span>Plazo de entrega:</span> {meta.leadDays}.</p>
            <p><span>Garantía:</span> {meta.guarantee}.</p>
          </div>
          <div className="pdf-bottom-col">
            <b>Contacto comercial</b>
            <p><span>Nombre:</span> Ana Torres</p>
            <p><span>Cargo:</span> Asesora comercial</p>
            <p><span>Teléfono:</span> +51 987 654 321</p>
            <p><span>Correo:</span> surco@modiru.pe</p>
          </div>
          <div className="pdf-bottom-col">
            <b>Cuentas para depósito</b>
            <p><span>BCP (S/):</span> 305-1234567-0-89</p>
            <p><span>CCI BCP:</span> 002-305-001234567089-17</p>
            <p><span>Interbank (S/):</span> 200-3001234567-8</p>
            <p><span>CCI Interbank:</span> 003-200-003001234567-89</p>
          </div>
        </div>
        <div className="pdf-bottom-line">
          MODIRU MUEBLES S.A.C. &nbsp;·&nbsp; RUC 20601234567 &nbsp;·&nbsp; Av. Principal 123, Lima &nbsp;·&nbsp; www.modiru.pe &nbsp;·&nbsp; hola@modiru.pe
        </div>
      </div>
    </section>
  );
}

const tapacantos = [
  { id: 'blanco1', label: 'PVC Blanco 1 mm', price: 7.5 },
  { id: 'roble2', label: 'PVC Roble 2 mm', price: 11 },
];

type Currency = { code: string; label: string; symbol: string; rate: number };
const currencies: Currency[] = [
  { code: 'PEN', label: 'Sol peruano', symbol: 'S/ ', rate: 1 },
  { code: 'USD', label: 'Dólar US', symbol: 'US$ ', rate: 1 / 3.72 },
  { code: 'EUR', label: 'Euro', symbol: '€ ', rate: 1 / 4.02 },
];

const woodTexture = (hex: string): string => {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(h => parseInt(h, 16));
  const shade = (pct: number) => '#' + [r, g, b].map(v => Math.round(Math.min(255, Math.max(0, v + 255 * pct))).toString(16).padStart(2, '0')).join('');
  const dark = shade(-0.18);
  const light = shade(0.12);
  const veins = [
    'M0 22 C 34 14, 58 30, 96 20 S 152 10, 200 18',
    'M0 48 C 44 40, 70 56, 110 46 S 168 36, 200 44',
    'M0 76 C 40 68, 66 84, 104 74 S 162 64, 200 72',
    'M0 108 C 48 100, 74 116, 114 106 S 172 96, 200 104',
    'M0 138 C 38 130, 64 146, 102 136 S 160 126, 200 134',
  ];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='200' height='160' fill='${hex}'/>` +
    veins.map(d => `<path d='${d}' fill='none' stroke='${dark}' stroke-width='3' opacity='0.30'/>`).join('') +
    veins.map(d => `<path d='${d}' fill='none' stroke='${dark}' stroke-width='1.2' opacity='0.45' transform='translate(0 7)'/>`).join('') +
    `<path d='M0 96 C 40 88, 70 104, 108 94 S 166 84, 200 92' fill='none' stroke='${light}' stroke-width='2' opacity='0.5'/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function NewClientModal({ onClose, onSave }: { onClose: () => void; onSave: (f: { name: string; taxId: string; phone: string; email: string }) => void }) {
  const [type, setType] = useState<'persona' | 'empresa'>('persona');
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const isCompany = type === 'empresa';
  const canSave = name.trim() !== '' && taxId.trim() !== '';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div><h3>Nuevo cliente</h3><p>Registra una persona o una empresa</p></div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="type-toggle">
            <button className={type === 'persona' ? 'active' : ''} onClick={() => setType('persona')}><UserRound size={15} /> Persona natural</button>
            <button className={type === 'empresa' ? 'active' : ''} onClick={() => setType('empresa')}><Building2 size={15} /> Empresa</button>
          </div>
          <div className="form-grid two">
            <Field label={isCompany ? 'Razón social' : 'Nombre y apellidos'}><input value={name} onChange={e => setName(e.target.value)} placeholder={isCompany ? 'Ej. Constructora Los Andes' : 'Ej. María González'} /></Field>
            <Field label={isCompany ? 'RUC' : 'DNI'}><input value={taxId} onChange={e => setTaxId(e.target.value)} placeholder={isCompany ? 'Ej. 20123456789' : 'Ej. 45872136'} /></Field>
            <Field label="Teléfono"><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+51 999 999 999" /></Field>
            <Field label="Correo electrónico"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.pe" /></Field>
          </div>
        </div>
        <div className="modal-actions">
          <Button onClick={onClose}>Cancelar</Button>
          <Button primary disabled={!canSave} onClick={() => onSave({ name: name.trim(), taxId: taxId.trim(), phone: phone.trim(), email: email.trim() })}><Plus size={15} /> Guardar cliente</Button>
        </div>
      </div>
    </div>
  );
}

function Quoter({ customers, onAddCustomer }: { customers: Customer[]; onAddCustomer: (c: Customer) => void }) {
  const [client, setClient] = useState(customers[0]); const [step, setStep] = useState(0); const [margin, setMargin] = useState('35'); const [waste, setWaste] = useState('8'); const [dimensions, setDimensions] = useState({ width: '240', height: '90', depth: '60', quantity: '1' }); const [material, setMaterial] = useState(products[0]); const [tapacanto, setTapacanto] = useState(tapacantos[0]); const [selected, setSelected] = useState({ hinges: true, slides: false, handles: true, led: false, drawers: true, delivery: true, installation: true, survey: false, removal: false }); const [notes, setNotes] = useState('Considerar tomacorrientes existentes en muro posterior.'); const [quote, setQuote] = useState({ number: 'COT-2024-001', date: new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()), validity: '15 días', status: 'Borrador', address: 'Av. Caminos del Inca 345, Santiago de Surco', projectName: 'Fabricación de Muebles a Medida', environment: 'Cocina', furnitureType: 'Mueble bajo', advisor: 'Ana Torres (surco@modiru.pe)', leadDays: '15', paymentTerms: '50% adelanto · 50% contra entrega', guarantee: '12 meses' }); const [saved, setSaved] = useState(false); const [generatingPdf, setGeneratingPdf] = useState(false); const [customTotal, setCustomTotal] = useState(''); const [currency, setCurrency] = useState<Currency>(currencies[0]); const [leadQty, setLeadQty] = useState('15'); const [leadUnit, setLeadUnit] = useState<LeadUnit>('día'); const [showClientModal, setShowClientModal] = useState(false)
  const leadText = `${leadQty} ${moneyInput(leadQty) === 1 ? leadUnit : leadPlural[leadUnit]}`;
  const volume = (moneyInput(dimensions.width) * moneyInput(dimensions.height) * moneyInput(dimensions.depth)) / 1000000;
  const setQuoteField = (key: keyof typeof quote, value: string) => setQuote(q => ({ ...q, [key]: value }));
  const calc = useMemo(() => { const w = moneyInput(dimensions.width) / 100; const h = moneyInput(dimensions.height) / 100; const d = moneyInput(dimensions.depth) / 100; const qty = Math.max(1, moneyInput(dimensions.quantity)); const area = (w * d * 2 + w * h * 2 + d * h * 2) * qty; const edge = (w * 2 + h * 2 + d * 2) * qty; const direct = area * material.price + edge * tapacanto.price + (selected.hinges ? 48 : 0) + (selected.slides ? 96 : 0) + (selected.handles ? 54 : 0) + (selected.led ? 120 : 0) + (selected.drawers ? 170 : 0) + (selected.delivery ? 80 : 0) + (selected.installation ? 220 : 0) + (selected.survey ? 60 : 0) + (selected.removal ? 120 : 0); const cost = direct * (1 + moneyInput(waste) / 100); const beforeTax = cost / Math.max(.1, 1 - moneyInput(margin) / 100); const igv = beforeTax * .18; return { area, edge, direct, cost, beforeTax, igv, total: beforeTax + igv, qty } }, [dimensions, material, tapacanto, selected, margin, waste])
  const toggle = (key: keyof typeof selected) => setSelected(s => ({ ...s, [key]: !s[key] })); const updateDim = (key: keyof typeof dimensions, value: string) => setDimensions(d => ({ ...d, [key]: value }));
  const priceTotal = customTotal ? moneyInput(customTotal) : calc.total;
  const igvShown = customTotal ? Math.max(0, priceTotal - calc.beforeTax) : calc.igv;
  const subTotal = Math.max(0, priceTotal - igvShown);
  const marginAmt = Math.max(0, subTotal - calc.cost);
  const costPct = priceTotal > 0 ? (calc.cost / priceTotal) * 100 : 0;
  const marginPct = priceTotal > 0 ? (marginAmt / priceTotal) * 100 : 0;
  const igvPct = priceTotal > 0 ? (igvShown / priceTotal) * 100 : 0;
  const marginNum = moneyInput(margin);
  const profitTone = marginNum < 20 ? 'low' : marginNum > 45 ? 'high' : 'ok';
  const profitLabel = marginNum < 20 ? 'Margen bajo' : marginNum > 45 ? 'Precio a revisar' : 'Saludable';
  const fx = (v: number) => currency.symbol + (v * currency.rate).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const heroValue = customTotal ? Math.round(moneyInput(customTotal) * currency.rate) : Math.round(calc.total * currency.rate);
  const handleDownloadPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const original = document.getElementById('pdf-template');
    if (!original) return;
    setGeneratingPdf(true);
    const container = document.createElement('div');
    container.id = 'pdf-export-container';
    const A4_PX = 794; // A4 at 96 dpi
    container.style.cssText = `position:absolute;left:-9999px;top:0;width:${A4_PX}px;overflow:visible;background:#fff;`;
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.cssText = [
        'display:flex', 'flex-direction:column', 'justify-content:flex-start',
        `width:${A4_PX}px`, 'min-height:1123px', 'padding:20px',
        'box-sizing:border-box', 'background:#fff', 'margin:0',
        'overflow:visible', 'font-family:Arial,Helvetica,sans-serif', 'font-size:11px',
      ].join(';');
      container.appendChild(clone);
      document.body.appendChild(container);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: A4_PX,
        windowWidth: A4_PX,
      });
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();   // 210mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297mm
      // canvas.width == A4_PX * scale(2); logical width == A4_PX
      const mmPerPx = pageW / A4_PX;
      const drawW = pageW;  // always fill full width
      const logicalH = canvas.height / 2;
      const drawH = logicalH * mmPerPx;
      const imgData = canvas.toDataURL('image/png');
      if (drawH <= pageH) {
        // Fits in one page
        pdf.addImage(imgData, 'PNG', 0, 0, drawW, drawH);
      } else {
        // Multi-page: slice canvas vertically
        const sliceHeightPx = Math.floor((pageH / mmPerPx) * 2); // canvas pixels per page
        let yOffset = 0;
        while (yOffset < canvas.height) {
          if (yOffset > 0) pdf.addPage();
          const sliceH = Math.min(sliceHeightPx, canvas.height - yOffset);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceH;
          const ctx = sliceCanvas.getContext('2d')!;
          ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          const sliceDrawH = (sliceH / 2) * mmPerPx;
          pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, drawW, sliceDrawH);
          yOffset += sliceH;
        }
      }
      pdf.save('COT-2024-001.pdf');
    } catch (e) {
      console.error('Error generando PDF:', e);
    } finally {
      container.remove();
      setGeneratingPdf(false);
    }
  };
  const steps = [
    { n: 1, label: 'Información', hint: 'Datos de cotización', id: 'quote-sec-datos' },
    { n: 2, label: 'Cliente', hint: 'Cliente y proyecto', id: 'quote-sec-cliente' },
    { n: 3, label: 'Producto', hint: 'Medidas, materiales y herrajes', id: 'quote-sec-producto' },
    { n: 4, label: 'Precio', hint: 'Costos y condiciones', id: 'quote-sec-precio' },
  ];
  const goStep = (i: number) => { setStep(i); document.getElementById(steps[i].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <div className="module quote-module">
      <PdfTemplate client={client} material={material} dimensions={dimensions} calc={calc} notes={notes} selected={selected}
        meta={{ number: quote.number, date: quote.date, validity: quote.validity, status: quote.status, address: quote.address, projectName: quote.projectName, environment: quote.environment, furnitureType: quote.furnitureType, advisor: quote.advisor, leadDays: leadText, tapacanto: tapacanto.label, paymentTerms: quote.paymentTerms, guarantee: quote.guarantee, curSymbol: currency.symbol, curRate: currency.rate }} overrideTotal={customTotal ? moneyInput(customTotal) : null} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">VENTAS / COTIZADOR</span>
          <h1>Nueva cotización</h1>
          <p>Configura el mueble, calcula costos y comparte tu propuesta.</p>
        </div>
        <div className="heading-actions">
          <span className={saved ? 'save-note visible' : 'save-note'}><Check size={14} /> Guardado</span>
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}><FileText size={15} /> Guardar borrador</Button>
          <Button primary onClick={handleDownloadPDF} className={generatingPdf ? 'generating' : ''} disabled={generatingPdf}><FileDown size={15} /> {generatingPdf ? 'Generando...' : 'Generar PDF'}</Button>
        </div>
      </div>
      <div className="quote-stepper">
        <div className="stepper-track" style={{ ['--prog' as any]: `${(step / (steps.length - 1)) * 100}%` } as CSSProperties}>
          {steps.map((s, i) => (
            <button key={s.n} className={`stepper-item${step === i ? ' active' : ''}${step > i ? ' done' : ''}`} aria-current={step === i ? 'step' : undefined} onClick={() => goStep(i)}>
              <span className="stepper-dot">{step > i ? <Check size={11} /> : s.n}</span>
              <span className="stepper-label">{s.label}</span>
            </button>
          ))}
        </div>
        <span className="stepper-hint">Paso {step + 1} de {steps.length} · {steps[step].label}</span>
      </div>
      <div className="quote-layout" data-step={step}>
        <div className="quote-main">
          <div className="wiz-step" data-step="0">
          <Section number="01" id="quote-sec-datos" icon={FileText} title="Datos de cotización" detail="Número, fecha y vigencia de tu propuesta">
            <div className="form-grid four">
              <Field label="N.º de cotización"><input value={quote.number} onChange={e => setQuoteField('number', e.target.value)} /></Field>
              <Field label="Fecha de emisión"><input value={quote.date} onChange={e => setQuoteField('date', e.target.value)} /></Field>
              <Field label="Vigencia"><input value={quote.validity} onChange={e => setQuoteField('validity', e.target.value)} /></Field>
              <Field label="Estado"><Select value={quote.status} onChange={e => setQuoteField('status', e.target.value)}><option>Borrador</option><option>Enviada</option><option>Aprobada</option></Select></Field>
            </div>
          </Section>
          </div>
          <div className="wiz-step" data-step="1">
          <Section number="02" id="quote-sec-cliente" icon={UserRound} title="Cliente y proyecto" detail="Selecciona el cliente y define el alcance del trabajo">
            <div className="customer-select">
              <Field label="Cliente existente"><Select value={client.id} onChange={e => setClient(customers.find(c => c.id === e.target.value) || customers[0])}>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
              <Button onClick={() => setShowClientModal(true)}><Plus size={15} /> Nuevo cliente</Button>
            </div>
            <div className="client-info">
              <span><b>Cliente:</b>{client.name}</span>
              <span><b>DNI / RUC:</b>{client.taxId}</span>
              <span><b>Teléfono:</b>{client.phone}</span>
              <span><b>Correo:</b>{client.email}</span>
            </div>
            <div className="form-grid two">
              <Field label="Dirección del proyecto"><input value={quote.address} onChange={e => setQuoteField('address', e.target.value)} /></Field>
              <Field label="Plazo estimado de entrega"><LeadTime qty={leadQty} unit={leadUnit} onQty={setLeadQty} onUnit={setLeadUnit} /></Field>
            </div>
          </Section>
          </div>
          <div className="wiz-step" data-step="2">
          <Section number="03" id="quote-sec-producto" icon={Box} title="Ambiente, mueble y dimensiones" detail="Las medidas se expresan en centímetros">
            <div className="form-grid three">
              <Field label="Ambiente"><Select value={quote.environment} onChange={e => setQuoteField('environment', e.target.value)}><option>Cocina</option><option>Dormitorio</option><option>Sala</option><option>Oficina</option><option>Baño</option></Select></Field>
              <Field label="Tipo de mueble"><Select value={quote.furnitureType} onChange={e => setQuoteField('furnitureType', e.target.value)}><option>Mueble bajo</option><option>Mueble alto</option><option>Clóset</option><option>Rack TV</option><option>Personalizado</option></Select></Field>
              <Field label="Cantidad"><input type="number" value={dimensions.quantity} onChange={e => updateDim('quantity', e.target.value)} min="1" /></Field>
            </div>
            <div className="form-grid three">
              <Field label="Ancho (cm)"><input type="number" value={dimensions.width} onChange={e => updateDim('width', e.target.value)} /></Field>
              <Field label="Alto (cm)"><input type="number" value={dimensions.height} onChange={e => updateDim('height', e.target.value)} /></Field>
              <Field label="Profundidad (cm)"><input type="number" value={dimensions.depth} onChange={e => updateDim('depth', e.target.value)} /></Field>
            </div>
            <div className="calc-panel">
              <div className="calc-item">
                <span className="calc-ico area"><Ruler size={16} /></span>
                <div className="calc-txt"><small>Área estimada</small><b>{calc.area.toFixed(2)}<em>m²</em></b></div>
              </div>
              <div className="calc-item">
                <span className="calc-ico edge"><Move size={16} /></span>
                <div className="calc-txt"><small>Metros lineales</small><b>{calc.edge.toFixed(2)}<em>ml</em></b></div>
              </div>
              <div className="calc-item">
                <span className="calc-ico vol"><Cuboid size={16} /></span>
                <div className="calc-txt"><small>Volumen</small><b>{volume.toFixed(2)}<em>m³</em></b></div>
              </div>
            </div>
          </Section>
          <Section number="04" icon={Package} title="Melamina y tapacanto" detail="Precios tomados desde la base de precios">
            <div className="form-grid three">
              <Field label="Producto de melamina" className="span-2"><Select value={material.id} onChange={e => setMaterial(products.find(p => p.id === e.target.value) || products[0])}>{products.filter(p => p.category === 'Melaminas').map(p => <option key={p.id} value={p.id}>{p.brand} · {p.name} · {formatMoney(p.price)}/m²</option>)}</Select></Field>
              <Field label="Tapacanto"><Select value={tapacanto.id} onChange={e => setTapacanto(tapacantos.find(t => t.id === e.target.value) || tapacantos[0])}>{tapacantos.map(t => <option key={t.id} value={t.id}>{t.label} · {formatMoney(t.price)}/ml</option>)}</Select></Field>
            </div>
            <div className="material-preview">
              <span className="material-swatch" style={{ backgroundImage: `url("${material.swatch && !material.swatch.startsWith('#') ? material.swatch : woodTexture(material.swatch || '#c9a27a')}")` }} />
              <div><b>{material.name}</b><small>{material.brand} · {material.detail} · {formatMoney(material.price)}/m²</small></div>
              <span className="auto-price">{calc.area.toFixed(2)} m²</span>
            </div>
          </Section>
          <Section number="05" icon={Ruler} title="Plano del mueble" detail="Vista referencial 2D/3D con medidas según tu configuración">
            <PlanView dimensions={dimensions} material={material} selected={selected} />
          </Section>
          <Section number="06" icon={SlidersHorizontal} title="Herrajes y accesorios" detail="Selecciona los complementos del proyecto">
            <div className="options-grid">
              <CheckRow label="Bisagras cierre suave" checked={selected.hinges} price="S/ 48.00" onChange={() => toggle('hinges')} />
              <CheckRow label="Correderas telescópicas" checked={selected.slides} price="S/ 96.00" onChange={() => toggle('slides')} />
              <CheckRow label="Tiradores estándar" checked={selected.handles} price="S/ 54.00" onChange={() => toggle('handles')} />
              <CheckRow label="Cajones interiores" checked={selected.drawers} price="S/ 170.00" onChange={() => toggle('drawers')} />
              <CheckRow label="Iluminación LED" checked={selected.led} price="S/ 120.00" onChange={() => toggle('led')} />
            </div>
          </Section>
          <Section number="07" icon={ClipboardList} title="Observaciones y referencia" detail="Agrega indicaciones o una imagen del ambiente">
            <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} />
            <label className="upload-box"><Upload size={18} /><b>Subir imagen o referencia</b><span>JPG, PNG o plano hasta 5 MB</span><input type="file" /></label>
          </Section>
          </div>
        </div>
        <aside className="quote-side" data-step="3">
          <Card className="price-card" id="quote-sec-precio">
            <div className="side-kicker"><HiOutlineBanknotes size={15} /> RESUMEN DE PRECIO</div>
            <h2>Precio final</h2>
            <p>Calculado con los parámetros actuales</p>
            <div className="price-total-edit">
              <span className="price-money-icon"><HiOutlineCurrencyDollar size={17} /></span>
              <div className="price-edit-wrap">
                <input type="number" min="0" step="10" value={heroValue} onChange={e => { const v = e.target.value; const t = Math.round(moneyInput(v) / currency.rate); setCustomTotal(String(t)); if (t > 0) { const pct = Math.round((1 - calc.cost * 1.18 / t) * 100); setMargin(String(Math.min(60, Math.max(10, pct)))) } }} />
                <small>Incluye IGV (18%) · Escríbelo o ajusta con la barra</small>
              </div>
            </div>
            <div className="currency-row">
              <span>Moneda de la cotización</span>
              <Select value={currency.code} onChange={e => setCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.label} ({c.symbol.trim()})</option>)}
              </Select>
            </div>
            <div className="margin-control">
              <div className="range-line"><span><HiOutlineArrowTrendingUp size={13} /> Margen de utilidad</span><b className="val-pop" key={`m-${marginNum}`}>{margin}%</b></div>
              <input type="range" min="10" max="60" value={margin} onChange={e => { setMargin(e.target.value); setCustomTotal('') }} />
            </div>
            <div className="split-bar" title="Composición del precio final">
              <span className="split-seg split-cost" style={{ width: `${costPct}%` }} />
              <span className="split-seg split-margin" style={{ width: `${marginPct}%` }} />
              <span className="split-seg split-igv" style={{ width: `${igvPct}%` }} />
            </div>
            <div className="split-legend">
              <div><span><i className="dot dot-cost" />Costo</span><b>{fx(calc.cost)}</b></div>
              <div><span><i className="dot dot-margin" />Margen</span><b>{fx(marginAmt)}</b></div>
              <div><span><i className="dot dot-igv" />IGV</span><b>{fx(igvShown)}</b></div>
            </div>
            <div className="summary-lines">
              <div><span><HiOutlineShoppingBag size={13} /> Costo directo</span><b>{fx(calc.direct)}</b></div>
              <div><span><HiOutlineClipboardDocumentList size={13} /> Gastos / Merma ({waste}%)</span><label><input value={waste} onChange={e => setWaste(e.target.value)} type="number" /> {fx(calc.cost - calc.direct)}</label></div>
              <div className="line-strong"><span><HiOutlineCube size={13} /> Costo total</span><b className="val-pop" key={`cost-${calc.cost}`}>{fx(calc.cost)}</b></div>
              <div><span><HiOutlineReceiptPercent size={13} /> Precio antes de impuestos</span><b className="val-pop" key={`bt-${calc.beforeTax}`}>{fx(calc.beforeTax)}</b></div>
              <div><span><HiOutlinePercentBadge size={13} /> IGV</span><b className="val-pop" key={`igv-${igvShown}`}>{fx(igvShown)}</b></div>
            </div>
            <Button primary className="full-button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}><Send size={15} /> Enviar al cliente</Button>
            <Button className={generatingPdf ? 'full-button generating' : 'full-button'} disabled={generatingPdf} onClick={handleDownloadPDF}><FileDown size={15} /> {generatingPdf ? 'Generando...' : 'Descargar PDF'}</Button>
          </Card>
          <Card className="profit-side">
            <div className="profit-badge"><HiOutlineArrowTrendingUp size={16} /></div>
            <div>
              <span>Rentabilidad estimada</span>
              <div className="profit-line">
                <b className="val-pop" key={`pm-${marginNum}`}>{margin}%</b>
                <span className={`profit-status ${profitTone}`}>{profitLabel}</span>
              </div>
              <small>{marginAmt > 0 ? `${fx(marginAmt)} de margen sobre el costo` : 'Sin margen sobre el costo'}</small>
            </div>
          </Card>
          <Section title="Servicios adicionales" detail="Completa tu propuesta con servicios extra">
            <div className="side-checklist">
              <CheckRow label="Despacho a domicilio" checked={selected.delivery} price="S/ 80.00" onChange={() => toggle('delivery')} />
              <CheckRow label="Instalación en domicilio" checked={selected.installation} price="S/ 220.00" onChange={() => toggle('installation')} />
              <CheckRow label="Visita técnica y medición" checked={selected.survey} price="S/ 60.00" onChange={() => toggle('survey')} />
              <CheckRow label="Retiro de muebles antiguos" checked={selected.removal} price="S/ 120.00" onChange={() => toggle('removal')} />
            </div>
          </Section>
          <Section title="Condiciones comerciales">
            <div className="terms-list">
              <p><b>Forma de pago</b><input value={quote.paymentTerms} onChange={e => setQuoteField('paymentTerms', e.target.value)} /></p>
              <p><b>Fabricación</b><LeadTime qty={leadQty} unit={leadUnit} onQty={setLeadQty} onUnit={setLeadUnit} /></p>
              <p><b>Garantía</b><input value={quote.guarantee} onChange={e => setQuoteField('guarantee', e.target.value)} /></p>
            </div>
          </Section>
        </aside>
      </div>
      <div className="wiz-bar">
        <button type="button" className="wiz-prev" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>‹ Anterior</button>
        <span>Paso {step + 1} de {steps.length}</span>
        <button type="button" className="wiz-next" onClick={() => step === steps.length - 1 ? (setSaved(true), setTimeout(() => setSaved(false), 2000)) : setStep(s => Math.min(steps.length - 1, s + 1))}>{step === steps.length - 1 ? 'Listo' : 'Siguiente ›'}</button>
      </div>
      {showClientModal && <NewClientModal onClose={() => setShowClientModal(false)} onSave={(f) => { const nuevo: Customer = { id: 'CLI-' + String(customers.length + 1).padStart(3, '0'), name: f.name, taxId: f.taxId, phone: f.phone, email: f.email, projects: 0, quotes: 0, status: 'Activo' }; onAddCustomer(nuevo); setClient(nuevo); setShowClientModal(false) }} />}
    </div>
  );
}

function PriceBase() { const [category, setCategory] = useState<ProductCategory>('Melaminas'); const [search, setSearch] = useState(''); const visible = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase())); return <div className="module"><div className="page-heading"><div><span className="eyebrow">CONFIGURACIÓN COMERCIAL</span><h1>Base de precios</h1><p>Administra materiales, productos y servicios del cotizador.</p></div><Button primary><Plus size={16} /> Agregar producto</Button></div><Card><div className="filter-row"><div className="search-field"><Search size={15} /><input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} /></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button><span className="results-count">{visible.length} productos</span></div><div className="category-tabs">{categories.map(c => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Marca / modelo</th><th>Detalle</th><th>Unidad</th><th>Precio</th><th>Estado</th><th>Actualizado</th><th /></tr></thead><tbody>{visible.map(p => <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.brand}<small>{p.model}</small></td><td>{p.detail}</td><td>{p.unit}</td><td><b>{formatMoney(p.price)}</b></td><td><Status>{p.status}</Status></td><td>{p.updated}</td><td><button className="row-more">•••</button></td></tr>)}</tbody></table></div></Card></div> }
function Directory({ type, customers: clientes = customers }: { type: 'Clientes' | 'Proyectos'; customers?: typeof customers }) { const isClients = type === 'Clientes'; return <div className="module"><div className="page-heading"><div><span className="eyebrow">GESTIÓN</span><h1>{type}</h1><p>{isClients ? 'Centraliza la información y el historial de tus clientes.' : 'Haz seguimiento a cada proyecto de principio a fin.'}</p></div><Button primary><Plus size={16} /> {isClients ? 'Nuevo cliente' : 'Nuevo proyecto'}</Button></div><Card><div className="filter-row"><div className="search-field"><Search size={15} /><input placeholder={`Buscar ${type.toLowerCase()}...`} /></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button></div><div className="table-scroll"><table><thead><tr>{isClients ? <><th>Cliente</th><th>DNI / RUC</th><th>Contacto</th><th>Proyectos</th><th>Cotizaciones</th><th>Estado</th></> : <><th>Proyecto</th><th>Cliente</th><th>Ambiente</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Responsable</th></>}</tr></thead><tbody>{(isClients ? clientes : projects).map((row: any) => isClients ? <tr key={row.id}><td><div className="person-cell"><div className="avatar tiny">{row.name.slice(0, 2).toUpperCase()}</div><b>{row.name}</b></div></td><td>{row.taxId}</td><td>{row.phone}<small>{row.email}</small></td><td>{row.projects}</td><td>{row.quotes}</td><td><Status>{row.status}</Status></td></tr> : <tr key={row.id}><td><b>{row.name}</b><small>{row.id}</small></td><td>{row.customer}</td><td>{row.environment}</td><td>{row.date}</td><td><b>{formatMoney(row.amount)}</b></td><td><Status>{row.status}</Status></td><td>{row.owner}</td></tr>)}</tbody></table></div></Card></div> }
function SettingsView() { return <div className="module"><div className="page-heading"><div><span className="eyebrow">ADMINISTRACIÓN</span><h1>Configuración</h1><p>Personaliza los datos comerciales de MODIRU.</p></div><Button primary><Check size={16} /> Guardar cambios</Button></div><div className="settings-grid"><Card><CardHeader title="Datos de la empresa" detail="Información que aparece en tus cotizaciones" /><div className="settings-form"><Field label="Razón social"><input defaultValue="MODIRU MUEBLES S.A.C." /></Field><div className="form-grid two"><Field label="RUC"><input defaultValue="20601234567" /></Field><Field label="Teléfono"><input defaultValue="+51 987 654 321" /></Field></div><Field label="Dirección"><input defaultValue="Av. Principal 123, Lima" /></Field><Field label="Correo comercial"><input defaultValue="hola@modiru.pe" /></Field></div></Card><Card><CardHeader title="Preferencias de cotización" detail="Valores predeterminados del sistema" /><div className="settings-form"><div className="form-grid two"><Field label="Prefijo"><input defaultValue="COT-2024-" /></Field><Field label="IGV (%)"><input defaultValue="18" /></Field><Field label="Vigencia"><input defaultValue="15 días" /></Field><Field label="Margen objetivo"><input defaultValue="35%" /></Field></div><Field label="Garantía predeterminada"><input defaultValue="12 meses por defectos de fabricación" /></Field></div></Card></div></div> }

export default function Page() { const [active, setActive] = useState<Module>('Cotizador'); const [sidebarOpen, setSidebarOpen] = useState(false); const [clientes, setClientes] = useState(customers); const [globalQuery, setGlobalQuery] = useState(''); const globalResults = useMemo<{ id: string; label: string; sub: string; to: Module }[]>(() => { const q = globalQuery.trim().toLowerCase(); if (!q) return []; return [...quotes.filter(x => (x.id + ' ' + x.customer + ' ' + x.project).toLowerCase().includes(q)).map(x => ({ id: 'q-' + x.id, label: x.id, sub: x.customer + ' · ' + x.project, to: 'Cotizaciones' as Module })), ...clientes.filter(x => (x.name + ' ' + x.taxId).toLowerCase().includes(q)).map(x => ({ id: 'c-' + x.id, label: x.name, sub: x.taxId, to: 'Clientes' as Module })), ...projects.filter(x => (x.name + ' ' + x.customer).toLowerCase().includes(q)).map(x => ({ id: 'p-' + x.id, label: x.name, sub: x.customer, to: 'Proyectos' as Module })), ...products.filter(x => (x.name + ' ' + x.brand + ' ' + x.model).toLowerCase().includes(q)).map(x => ({ id: 'm-' + x.id, label: x.name, sub: x.brand + ' · ' + formatMoney(x.price), to: 'Base de precios' as Module }))].slice(0, 8); }, [globalQuery, clientes]); const content = active === 'Cotizador' ? <Quoter customers={clientes} onAddCustomer={c => setClientes(prev => [...prev, c])} /> : active === 'Base de precios' ? <PriceBase /> : active === 'Clientes' ? <Directory type="Clientes" customers={clientes} /> : active === 'Proyectos' ? <Directory type="Proyectos" /> : active === 'Cotizaciones' ? <div className="module"><div className="page-heading"><div><span className="eyebrow">GESTIÓN COMERCIAL</span><h1>Cotizaciones</h1><p>Consulta y administra todas tus propuestas comerciales.</p></div><Button primary onClick={() => setActive('Cotizador')}><Plus size={16} /> Nueva cotización</Button></div><Card><CardHeader title="Listado de cotizaciones" detail="24 registros encontrados" /><QuoteTable /></Card></div> : <SettingsView />; return <div className="admin-shell"><Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="admin-content"><Header active={active} onMenu={() => setSidebarOpen(true)} query={globalQuery} onQuery={setGlobalQuery} results={globalResults} onPick={(to) => { setActive(to); setGlobalQuery('') }} />{content}<footer className="admin-footer"><span>MODIRU · Muebles que hacen espacios</span><span>Centro de ayuda · Privacidad</span></footer></div></div> }
