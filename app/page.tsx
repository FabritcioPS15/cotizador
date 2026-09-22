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
          <Section number="05" icon={SlidersHorizontal} title="Herrajes y accesorios" detail="Selecciona los complementos del proyecto">
            <div className="options-grid">
              <CheckRow label="Bisagras cierre suave" checked={selected.hinges} price="S/ 48.00" onChange={() => toggle('hinges')} />
              <CheckRow label="Correderas telescópicas" checked={selected.slides} price="S/ 96.00" onChange={() => toggle('slides')} />
              <CheckRow label="Tiradores estándar" checked={selected.handles} price="S/ 54.00" onChange={() => toggle('handles')} />
              <CheckRow label="Cajones interiores" checked={selected.drawers} price="S/ 170.00" onChange={() => toggle('drawers')} />
              <CheckRow label="Iluminación LED" checked={selected.led} price="S/ 120.00" onChange={() => toggle('led')} />
            </div>
          </Section>
          <Section number="06" icon={ClipboardList} title="Observaciones y referencia" detail="Agrega indicaciones o una imagen del ambiente">
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
