'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3, Bell, BookOpen, Box, Calculator, Check, ChevronDown, ClipboardList,
  FileDown, FileText, FolderKanban, LayoutDashboard, Menu, Package, Plus, Search,
  Send, Settings, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Trash2,
  Upload, UserRound, Users, X
} from 'lucide-react'
import { categories, customers, formatMoney, products, projects, quotes, type ProductCategory } from '@/data/mock'

type Module = 'Dashboard' | 'Cotizador' | 'Base de precios' | 'Clientes' | 'Proyectos' | 'Cotizaciones' | 'Reportes' | 'Configuración'
const nav: { label: Module; icon: typeof LayoutDashboard }[] = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Cotizador', icon: Calculator },
  { label: 'Base de precios', icon: BookOpen }, { label: 'Clientes', icon: Users },
  { label: 'Proyectos', icon: FolderKanban }, { label: 'Cotizaciones', icon: FileText },
  { label: 'Reportes', icon: BarChart3 }, { label: 'Configuración', icon: Settings },
]
const tone = (status: string) => `status status-${status.toLowerCase().replaceAll(' ', '-').replaceAll('ó', 'o')}`
const moneyInput = (v: string) => Number(v) || 0

function Status({ children }: { children: string }) { return <span className={tone(children)}><i />{children}</span> }
function Button({ children, primary = false, onClick, className = '', disabled = false }: { children: React.ReactNode; primary?: boolean; onClick?: () => void; className?: string; disabled?: boolean }) { return <button className={`app-button ${primary ? 'app-button-primary' : ''} ${className}`} onClick={onClick} disabled={disabled}>{children}</button> }
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`app-card ${className}`}>{children}</section> }
function CardHeader({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) { return <div className="app-card-header"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div> }
function Metric({ label, value, detail, icon: Icon, accent = '' }: { label: string; value: string; detail: string; icon: typeof Calculator; accent?: string }) { return <Card className="metric"><div className={`metric-icon ${accent}`}><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></Card> }
function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`form-field ${className}`}><span>{label}</span>{children}</label> }
function Select({ children, value, onChange }: { children: React.ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) { return onChange ? <select value={value} onChange={onChange}>{children}</select> : <select defaultValue={value}>{children}</select> }

function Sidebar({ active, setActive, open, setOpen }: { active: Module; setActive: (m: Module) => void; open: boolean; setOpen: (v: boolean) => void }) {
  return <><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-brand"><div className="logo-mark">M</div><div><b>MODIRU</b><span>Muebles que hacen espacios</span></div><button className="sidebar-close" onClick={() => setOpen(false)}><X size={17} /></button></div><div className="sidebar-label">GESTIÓN COMERCIAL</div><nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setOpen(false) }}><Icon size={17} /><span>{label}</span>{label === 'Cotizador' && <em>Nuevo</em>}</button>)}</nav><div className="sidebar-footer"><div className="avatar">AT</div><div><b>Ana Torres</b><span>Asesora comercial</span></div><ChevronDown size={15} /></div></aside>{open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}</>
}
function Header({ active, onMenu }: { active: Module; onMenu: () => void }) { return <header className="admin-header"><button className="menu-button" onClick={onMenu}><Menu size={20} /></button><div className="breadcrumbs"><span>MODIRU</span><i>/</i><b>{active}</b></div><div className="header-actions"><div className="global-search"><Search size={15} /><input placeholder="Buscar en MODIRU..." /></div><button className="icon-button"><Bell size={18} /><i /></button><div className="header-user"><div className="avatar small">AT</div><span>Ana Torres</span><ChevronDown size={14} /></div></div></header> }

function Dashboard({ setActive }: { setActive: (m: Module) => void }) { return <div className="module"><div className="page-heading"><div><span className="eyebrow">RESUMEN GENERAL</span><h1>Buenos días, Ana</h1><p>Este es el resumen de tu actividad comercial.</p></div><Button primary onClick={() => setActive('Cotizador')}><Plus size={16} /> Nueva cotización</Button></div><div className="metrics"><Metric label="Cotizaciones del mes" value="24" detail="+12% vs. mes anterior" icon={FileText} accent="blue" /><Metric label="Pendientes de respuesta" value="08" detail="3 requieren seguimiento" icon={ClipboardList} accent="amber" /><Metric label="Aprobadas" value="12" detail="+18% de conversión" icon={Check} accent="green" /><Metric label="Ventas estimadas" value="S/ 48.2K" detail="Margen promedio 34.6%" icon={ShoppingBag} accent="purple" /></div><div className="dashboard-grid"><Card><CardHeader title="Actividad de cotizaciones" detail="Últimos 6 meses" action={<button className="select-pill">Este año <ChevronDown size={13} /></button>} /><div className="fake-chart bars">{[42,58,47,72,65,88,76,93,81,68,94,79].map((h, i) => <div key={i} className="bar-wrap"><div className="bar" style={{ height: `${h}%` }} /><small>{['Ene','Feb','Mar','Abr','May','Jun'][i % 6]}</small></div>)}</div></Card><Card><CardHeader title="Estado de cotizaciones" detail="Distribución actual" /><div className="donut-wrap"><div className="donut"><strong>24</strong><span>total</span></div><div className="legend"><span><i className="dot green" />Aprobadas <b>12</b></span><span><i className="dot blue" />Enviadas <b>6</b></span><span><i className="dot amber" />En revisión <b>4</b></span><span><i className="dot gray" />Borradores <b>2</b></span></div></div></Card></div><Card><CardHeader title="Últimas cotizaciones" detail="Actividad reciente" action={<Button onClick={() => setActive('Cotizaciones')}>Ver todas <ChevronDown size={14} /></Button>} /><QuoteTable compact /></Card></div> }

function QuoteTable({ compact = false }: { compact?: boolean }) { return <div className="table-scroll"><table><thead><tr><th>N.º</th><th>Cliente</th><th>Proyecto</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Asesor</th><th /></tr></thead><tbody>{quotes.map(q => <tr key={q.id}><td><b className="table-id">{q.id}</b></td><td>{q.customer}</td><td>{q.project}</td><td>{q.date}</td><td><b>{formatMoney(q.total)}</b></td><td><Status>{q.status}</Status></td><td>{q.advisor}</td><td><button className="row-more">•••</button></td></tr>)}</tbody></table>{!compact && <div className="pagination"><span>Mostrando 1–4 de 24 cotizaciones</span><div><button>‹</button><button className="current">1</button><button>2</button><button>3</button><button>›</button></div></div>}</div> }

function Section({ title, detail, children, number }: { title: string; detail?: string; children: React.ReactNode; number?: string }) { return <Card className="quote-section"><div className="quote-section-head"><div>{number && <span className="section-number">{number}</span>}<div><h2>{title}</h2>{detail && <p>{detail}</p>}</div></div><ChevronDown size={16} /></div>{children}</Card> }
function CheckRow({ label, checked, price, onChange }: { label: string; checked: boolean; price: string; onChange: () => void }) { return <label className="check-option"><input type="checkbox" checked={checked} onChange={onChange} /><span className="fake-check"><Check size={12} /></span><span>{label}</span><b>{price}</b></label> }

function PdfTemplate({ client, material, dimensions, calc, notes, selected }: { 
  client: typeof customers[number]; 
  material: typeof products[number]; 
  dimensions: { width: string; height: string; depth: string; quantity: string }; 
  calc: { area: number; edge: number; direct: number; cost: number; beforeTax: number; igv: number; total: number; qty: number }; 
  notes: string;
  selected?: { hinges: boolean; slides: boolean; handles: boolean; led: boolean; drawers: boolean; delivery: boolean; installation: boolean };
}) {
  const money = (value: number) => "S/ " + value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const today = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());

  const hasDelivery = selected?.delivery ?? true;
  const hasInstallation = selected?.installation ?? true;
  const hasServices = hasDelivery || hasInstallation;

  const servicesNet = hasServices ? Math.round(((hasDelivery ? 80 : 0) + (hasInstallation ? 220 : 0)) * 1.35 * 1.08 * 100) / 100 : 0;
  const furnitureNet = Math.max(0, calc.beforeTax - servicesNet);
  const unitFurnitureNet = furnitureNet / Math.max(1, calc.qty);

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
            <span className="pdf-brand-mark">M</span>
            <div>
              MODIRU MUEBLES
              <small>MUEBLES QUE HACEN ESPACIOS</small>
            </div>
          </div>
          <div className="pdf-company">
            <b>MODIRU MUEBLES S.A.C.</b><br />
            RUC 20601234567<br />
            Av. Principal 123, Lima · +51 987 654 321<br />
            hola@modiru.pe · www.modiru.pe
          </div>
        </div>
        <div className="pdf-quote">
          <span className="pdf-quote-label">COTIZACIÓN</span>
          <strong>N° COT-2024-001</strong>
          <span>Fecha de emisión: {today}</span>
          <span className="pdf-quote-badge">Válida por 15 días</span>
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
            <p><b>Proyecto:</b> Fabricación de Muebles a Medida</p>
            <p><b>Ambiente:</b> Cocina / Hogar</p>
            <p><b>Medidas:</b> {dimensions.width} cm (ancho) × {dimensions.height} cm (alto) × {dimensions.depth} cm (fondo)</p>
            <p><b>Plazo estimado:</b> 10 a 15 días hábiles</p>
            <p><b>Asesor comercial:</b> Ana Torres (surco@modiru.pe)</p>
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
                <p><b>{material.name}</b> ({material.brand} · {material.detail}) 18 mm. Ancho {dimensions.width} × Alto {dimensions.height} × Fondo {dimensions.depth} cm. Área: {calc.area.toFixed(2)} m², {calc.edge.toFixed(2)} ml tapacanto.</p>
                <p>Incluye: {accessoriesList}. Plazo: 10-15 días hábiles. No incluye modificaciones civiles ni eléctricas.</p>
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
                <div className="item-name">Transporte, Logística y Montaje en Obra</div>
                <div className="item-description">
                  <p>Traslado en unidad acondicionada con embalaje protector. Montaje, nivelación y fijación por técnico calificado. Se entrega área limpia y operativa.</p>
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
                <b>Condiciones:</b> 50% anticipo, 50% contra entrega. Validez: 15 días.
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
                    <td className="tot-val">{money(calc.igv)}</td>
                  </tr>
                  <tr className="tot-final-row">
                    <td className="tot-lbl">Total:</td>
                    <td className="tot-val">{money(calc.total)}</td>
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
          <span>RUC 20601234567 · Av. Principal 123, Lima – Perú · +51 987 654 321 · hola@modiru.pe</span>
        </div>
        <div className="pdf-bottom-grid">
          <div className="pdf-bottom-col">
            <b>Condiciones generales</b>
            <p><span>Forma de pago:</span> 50% a la confirmación y 50% contra entrega.</p>
            <p><span>Validez de la oferta:</span> 15 días calendario.</p>
            <p><span>Plazo de entrega:</span> 10 a 15 días hábiles.</p>
            <p><span>Garantía:</span> 12 meses por defectos de fabricación.</p>
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
          <span>MODIRU MUEBLES S.A.C. · RUC 20601234567 · Av. Principal 123, Lima · www.modiru.pe · hola@modiru.pe</span>
        </div>
      </div>
    </section>
  );
}

function Quoter() {
  const [client, setClient] = useState(customers[0]); const [activeTab, setActiveTab] = useState('Información'); const [margin, setMargin] = useState('35'); const [waste, setWaste] = useState('8'); const [dimensions, setDimensions] = useState({ width: '240', height: '90', depth: '60', quantity: '1' }); const [material, setMaterial] = useState(products[0]); const [selected, setSelected] = useState({ hinges: true, slides: false, handles: true, led: false, drawers: true, delivery: true, installation: true }); const [notes, setNotes] = useState('Considerar tomacorrientes existentes en muro posterior.'); const [saved, setSaved] = useState(false); const [generatingPdf, setGeneratingPdf] = useState(false)
  const calc = useMemo(() => { const w = moneyInput(dimensions.width) / 100; const h = moneyInput(dimensions.height) / 100; const d = moneyInput(dimensions.depth) / 100; const qty = Math.max(1, moneyInput(dimensions.quantity)); const area = (w * d * 2 + w * h * 2 + d * h * 2) * qty; const edge = (w * 2 + h * 2 + d * 2) * qty; const direct = area * material.price + edge * 7.5 + (selected.hinges ? 48 : 0) + (selected.slides ? 96 : 0) + (selected.handles ? 54 : 0) + (selected.led ? 120 : 0) + (selected.drawers ? 170 : 0) + (selected.delivery ? 80 : 0) + (selected.installation ? 220 : 0); const cost = direct * (1 + moneyInput(waste) / 100); const beforeTax = cost / Math.max(.1, 1 - moneyInput(margin) / 100); const igv = beforeTax * .18; return { area, edge, direct, cost, beforeTax, igv, total: beforeTax + igv, qty } }, [dimensions, material, selected, margin, waste])
  const toggle = (key: keyof typeof selected) => setSelected(s => ({ ...s, [key]: !s[key] })); const updateDim = (key: keyof typeof dimensions, value: string) => setDimensions(d => ({ ...d, [key]: value }));
  const handleDownloadPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const original = document.getElementById('pdf-template');
    if (!original) return;
    setGeneratingPdf(true);
    const container = document.createElement('div');
    container.id = 'pdf-export-container';
    container.style.cssText = 'position:fixed;left:0;top:0;width:210mm;z-index:99999;background:#fff;';
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.cssText = [
        'display:flex', 'flex-direction:column', 'justify-content:center',
        'width:210mm', 'min-height:297mm', 'padding:8mm',
        'box-sizing:border-box', 'background:#fff', 'margin:0',
        'overflow:hidden',
      ].join(';');
      container.appendChild(clone);
      document.body.appendChild(container);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      let canvas;
      try {
        canvas = await html2canvas(clone, {
          scale: 2, useCORS: true, logging: false, foreignObjectRendering: true,
        });
      } catch {
        canvas = await html2canvas(clone, {
          scale: 2, useCORS: true, logging: false,
        });
      }
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pxW = canvas.width / 2;
      const pxH = canvas.height / 2;
      const ratio = Math.min(pageW / pxW, pageH / pxH);
      const drawW = pxW * ratio;
      const drawH = pxH * ratio;
      const x = (pageW - drawW) / 2;
      const y = (pageH - drawH) / 2;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', x, y, drawW, drawH);
      pdf.save('COT-2024-001.pdf');
    } catch (e) {
      console.error('Error generando PDF:', e);
    } finally {
      container.remove();
      setGeneratingPdf(false);
    }
  };
  return <div className="module quote-module"><PdfTemplate client={client} material={material} dimensions={dimensions} calc={calc} notes={notes} selected={selected} /><div className="page-heading"><div><span className="eyebrow">VENTAS / COTIZADOR</span><h1>Nueva cotización</h1><p>Configura el mueble, calcula costos y comparte tu propuesta.</p></div><div className="heading-actions"><span className={saved ? 'save-note visible' : 'save-note'}><Check size={14} /> Guardado</span><Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}><FileText size={15} /> Guardar borrador</Button><Button primary onClick={handleDownloadPDF} className={generatingPdf ? 'generating' : ''} disabled={generatingPdf}><FileDown size={15} /> {generatingPdf ? 'Generando...' : 'Generar PDF'}</Button></div></div><div className="quote-tabs">{['Información', 'Materiales', 'Configuración', 'Costos y precio'].map(t => <button className={activeTab === t ? 'active' : ''} onClick={() => { setActiveTab(t); const target = t === 'Información' ? '.quote-main .quote-section' : t === 'Materiales' ? '.quote-main .quote-section:nth-of-type(3)' : t === 'Configuración' ? '.quote-main .quote-section:nth-of-type(4)' : '.quote-main .quote-section:nth-of-type(5)'; document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} key={t}>{t}</button>)}</div><div className="quote-layout"><div className="quote-main"><Section number="01" title="Datos de cotización" detail="Identifica y controla tu propuesta"><div className="form-grid four"><Field label="N.º de cotización"><input value="COT-2024-001" readOnly /></Field><Field label="Fecha de emisión"><input value="18/06/2024" readOnly /></Field><Field label="Vigencia"><input value="15 días" readOnly /></Field><Field label="Estado"><Select value="Borrador"><option>Borrador</option><option>Enviada</option><option>Aprobada</option></Select></Field></div></Section><Section number="02" title="Cliente y proyecto" detail="Busca un cliente o registra uno nuevo"><div className="customer-select"><Field label="Cliente existente"><Select value={client.id} onChange={e => setClient(customers.find(c => c.id === e.target.value) || customers[0])}>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field><Button><Plus size={15} /> Nuevo cliente</Button></div><div className="form-grid three"><Field label="DNI / RUC"><input value={client.taxId} readOnly /></Field><Field label="Teléfono"><input value={client.phone} readOnly /></Field><Field label="Correo electrónico"><input value={client.email} readOnly /></Field></div><Field label="Dirección del proyecto"><input defaultValue="Av. Caminos del Inca 345, Santiago de Surco" /></Field></Section><Section number="03" title="Ambiente, mueble y dimensiones" detail="Las medidas se expresan en centímetros"><div className="form-grid three"><Field label="Ambiente"><Select><option>Cocina</option><option>Dormitorio</option><option>Sala</option><option>Oficina</option><option>Baño</option></Select></Field><Field label="Tipo de mueble"><Select><option>Mueble bajo</option><option>Mueble alto</option><option>Clóset</option><option>Rack TV</option><option>Personalizado</option></Select></Field><Field label="Cantidad"><input type="number" value={dimensions.quantity} onChange={e => updateDim('quantity', e.target.value)} min="1" /></Field></div><div className="form-grid three"><Field label="Ancho (cm)"><input type="number" value={dimensions.width} onChange={e => updateDim('width', e.target.value)} /></Field><Field label="Alto (cm)"><input type="number" value={dimensions.height} onChange={e => updateDim('height', e.target.value)} /></Field><Field label="Profundidad (cm)"><input type="number" value={dimensions.depth} onChange={e => updateDim('depth', e.target.value)} /></Field></div><div className="calculation-strip"><span><Calculator size={15} /> Área estimada <b>{calc.area.toFixed(2)} m²</b></span><span>Metros lineales <b>{calc.edge.toFixed(2)} ml</b></span><span>Volumen <b>{(moneyInput(dimensions.width) * moneyInput(dimensions.height) * moneyInput(dimensions.depth) / 1000000).toFixed(2)} m³</b></span></div></Section><Section number="04" title="Melamina y tapacanto" detail="Precios tomados desde la base de precios"><div className="form-grid three"><Field label="Producto de melamina" className="span-2"><Select value={material.id} onChange={e => setMaterial(products.find(p => p.id === e.target.value) || products[0])}>{products.filter(p => p.category === 'Melaminas').map(p => <option key={p.id} value={p.id}>{p.brand} · {p.name} · {formatMoney(p.price)}/m²</option>)}</Select></Field><Field label="Tapacanto"><Select><option>PVC Blanco 1 mm · S/ 7.50/ml</option><option>PVC Roble 2 mm · S/ 11.00/ml</option></Select></Field></div><div className="material-preview"><span className="material-swatch" /><div><b>{material.name}</b><small>{material.brand} · {material.detail} · {formatMoney(material.price)}/m²</small></div><span className="auto-price">{calc.area.toFixed(2)} m²</span></div></Section><Section number="05" title="Herrajes y accesorios" detail="Selecciona los complementos del proyecto"><div className="options-grid"><CheckRow label="Bisagras cierre suave" checked={selected.hinges} price="S/ 48.00" onChange={() => toggle('hinges')} /><CheckRow label="Correderas telescópicas" checked={selected.slides} price="S/ 96.00" onChange={() => toggle('slides')} /><CheckRow label="Tiradores estándar" checked={selected.handles} price="S/ 54.00" onChange={() => toggle('handles')} /><CheckRow label="Cajones interiores" checked={selected.drawers} price="S/ 170.00" onChange={() => toggle('drawers')} /><CheckRow label="Iluminación LED" checked={selected.led} price="S/ 120.00" onChange={() => toggle('led')} /></div></Section><Section number="06" title="Observaciones y referencia" detail="Agrega indicaciones o una imagen del ambiente"><textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} /><label className="upload-box"><Upload size={18} /><b>Subir imagen o referencia</b><span>JPG, PNG o plano hasta 5 MB</span><input type="file" /></label></Section></div><aside className="quote-side"><Card className="price-card"><div className="side-kicker"><Calculator size={14} /> RESUMEN DE PRECIO</div><h2>Precio final</h2><p>Calculado con los parámetros actuales</p><div className="price-total">{formatMoney(calc.total)}<small>Incluye IGV (18%)</small></div><div className="range-line"><span>Margen de utilidad</span><b>{margin}%</b></div><input type="range" min="10" max="60" value={margin} onChange={e => setMargin(e.target.value)} /><div className="summary-lines"><div><span>Costo directo</span><b>{formatMoney(calc.direct)}</b></div><div><span>Gastos / Merma ({waste}%)</span><label><input value={waste} onChange={e => setWaste(e.target.value)} type="number" /> {formatMoney(calc.cost - calc.direct)}</label></div><div className="line-strong"><span>Costo total</span><b>{formatMoney(calc.cost)}</b></div><div><span>Precio antes de impuestos</span><b>{formatMoney(calc.beforeTax)}</b></div><div><span>IGV</span><b>{formatMoney(calc.igv)}</b></div></div><Button primary className="full-button"><Send size={15} /> Enviar al cliente</Button><Button className="full-button"><FileDown size={15} /> Descargar PDF</Button></Card><Card className="profit-side"><div className="profit-badge"><Sparkles size={16} /></div><div><span>Rentabilidad estimada</span><b>{margin}%</b><small>Margen saludable para este proyecto</small></div></Card><Section title="Servicios adicionales"><CheckRow label="Despacho a domicilio" checked={selected.delivery} price="S/ 80.00" onChange={() => toggle('delivery')} /><CheckRow label="Instalación en domicilio" checked={selected.installation} price="S/ 220.00" onChange={() => toggle('installation')} /></Section><Section title="Condiciones comerciales"><div className="terms-list"><p><b>Forma de pago</b><span>50% adelanto · 50% contra entrega</span></p><p><b>Fabricación</b><span>15 días hábiles</span></p><p><b>Garantía</b><span>12 meses</span></p></div></Section></aside></div></div> }

function PriceBase() { const [category, setCategory] = useState<ProductCategory>('Melaminas'); const [search, setSearch] = useState(''); const visible = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase())); return <div className="module"><div className="page-heading"><div><span className="eyebrow">CONFIGURACIÓN COMERCIAL</span><h1>Base de precios</h1><p>Administra materiales, productos y servicios del cotizador.</p></div><Button primary><Plus size={16} /> Agregar producto</Button></div><Card><div className="filter-row"><div className="search-field"><Search size={15} /><input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} /></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button><span className="results-count">{visible.length} productos</span></div><div className="category-tabs">{categories.map(c => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Marca / modelo</th><th>Detalle</th><th>Unidad</th><th>Precio</th><th>Estado</th><th>Actualizado</th><th /></tr></thead><tbody>{visible.map(p => <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.brand}<small>{p.model}</small></td><td>{p.detail}</td><td>{p.unit}</td><td><b>{formatMoney(p.price)}</b></td><td><Status>{p.status}</Status></td><td>{p.updated}</td><td><button className="row-more">•••</button></td></tr>)}</tbody></table></div></Card></div> }
function Directory({ type }: { type: 'Clientes' | 'Proyectos' }) { const isClients = type === 'Clientes'; return <div className="module"><div className="page-heading"><div><span className="eyebrow">GESTIÓN</span><h1>{type}</h1><p>{isClients ? 'Centraliza la información y el historial de tus clientes.' : 'Haz seguimiento a cada proyecto de principio a fin.'}</p></div><Button primary><Plus size={16} /> {isClients ? 'Nuevo cliente' : 'Nuevo proyecto'}</Button></div><Card><div className="filter-row"><div className="search-field"><Search size={15} /><input placeholder={`Buscar ${type.toLowerCase()}...`} /></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button></div><div className="table-scroll"><table><thead><tr>{isClients ? <><th>Cliente</th><th>DNI / RUC</th><th>Contacto</th><th>Proyectos</th><th>Cotizaciones</th><th>Estado</th></> : <><th>Proyecto</th><th>Cliente</th><th>Ambiente</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Responsable</th></>}</tr></thead><tbody>{(isClients ? customers : projects).map((row: any) => isClients ? <tr key={row.id}><td><div className="person-cell"><div className="avatar tiny">{row.name.slice(0,2).toUpperCase()}</div><b>{row.name}</b></div></td><td>{row.taxId}</td><td>{row.phone}<small>{row.email}</small></td><td>{row.projects}</td><td>{row.quotes}</td><td><Status>{row.status}</Status></td></tr> : <tr key={row.id}><td><b>{row.name}</b><small>{row.id}</small></td><td>{row.customer}</td><td>{row.environment}</td><td>{row.date}</td><td><b>{formatMoney(row.amount)}</b></td><td><Status>{row.status}</Status></td><td>{row.owner}</td></tr>)}</tbody></table></div></Card></div> }
function Reports() { return <div className="module"><div className="page-heading"><div><span className="eyebrow">ANÁLISIS COMERCIAL</span><h1>Reportes</h1><p>Indicadores para entender el rendimiento del negocio.</p></div><button className="select-pill">Últimos 6 meses <ChevronDown size={13} /></button></div><div className="metrics"><Metric label="Conversión" value="48.2%" detail="+6.4% vs. periodo anterior" icon={BarChart3} accent="green" /><Metric label="Ticket promedio" value="S/ 3,842" detail="En cotizaciones aprobadas" icon={ShoppingBag} accent="blue" /><Metric label="Margen promedio" value="34.6%" detail="Objetivo: 35%" icon={Calculator} accent="purple" /></div><Card><CardHeader title="Ventas estimadas vs. aprobadas" detail="Comparativo mensual" /><div className="fake-chart bars tall">{[36,44,39,55,62,71,66,80,74,91,84,96].map((h, i) => <div key={i} className="bar-wrap"><div className="bar" style={{ height: `${h}%` }} /><small>{['Ene','Feb','Mar','Abr','May','Jun'][i % 6]}</small></div>)}</div></Card></div> }
function SettingsView() { return <div className="module"><div className="page-heading"><div><span className="eyebrow">ADMINISTRACIÓN</span><h1>Configuración</h1><p>Personaliza los datos comerciales de MODIRU.</p></div><Button primary><Check size={16} /> Guardar cambios</Button></div><div className="settings-grid"><Card><CardHeader title="Datos de la empresa" detail="Información que aparece en tus cotizaciones" /><div className="settings-form"><Field label="Razón social"><input defaultValue="MODIRU MUEBLES S.A.C." /></Field><div className="form-grid two"><Field label="RUC"><input defaultValue="20601234567" /></Field><Field label="Teléfono"><input defaultValue="+51 987 654 321" /></Field></div><Field label="Dirección"><input defaultValue="Av. Principal 123, Lima" /></Field><Field label="Correo comercial"><input defaultValue="hola@modiru.pe" /></Field></div></Card><Card><CardHeader title="Preferencias de cotización" detail="Valores predeterminados del sistema" /><div className="settings-form"><div className="form-grid two"><Field label="Prefijo"><input defaultValue="COT-2024-" /></Field><Field label="IGV (%)"><input defaultValue="18" /></Field><Field label="Vigencia"><input defaultValue="15 días" /></Field><Field label="Margen objetivo"><input defaultValue="35%" /></Field></div><Field label="Garantía predeterminada"><input defaultValue="12 meses por defectos de fabricación" /></Field></div></Card></div></div> }

export default function Page() { const [active, setActive] = useState<Module>('Dashboard'); const [sidebarOpen, setSidebarOpen] = useState(false); const content = active === 'Dashboard' ? <Dashboard setActive={setActive} /> : active === 'Cotizador' ? <Quoter /> : active === 'Base de precios' ? <PriceBase /> : active === 'Clientes' ? <Directory type="Clientes" /> : active === 'Proyectos' ? <Directory type="Proyectos" /> : active === 'Cotizaciones' ? <div className="module"><div className="page-heading"><div><span className="eyebrow">GESTIÓN COMERCIAL</span><h1>Cotizaciones</h1><p>Consulta y administra todas tus propuestas comerciales.</p></div><Button primary onClick={() => setActive('Cotizador')}><Plus size={16} /> Nueva cotización</Button></div><Card><CardHeader title="Listado de cotizaciones" detail="24 registros encontrados" /><QuoteTable /></Card></div> : active === 'Reportes' ? <Reports /> : <SettingsView />; return <div className="admin-shell"><Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="admin-content"><Header active={active} onMenu={() => setSidebarOpen(true)} />{content}<footer className="admin-footer"><span>MODIRU · Muebles que hacen espacios</span><span>Centro de ayuda · Privacidad</span></footer></div></div> }
