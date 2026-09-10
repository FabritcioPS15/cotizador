'use client'

import { ChangeEvent, useMemo, useState } from 'react'
import {
  Archive,
  ArrowDownToLine,
  Calculator,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  MessageCircle,
  Package,
  Plus,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Sofa,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react'

const money = (value: number) => `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const number = (value: string | number) => Number(value) || 0

function Section({ number: step, title, icon: Icon, children, className = '' }: { number?: string; title: string; icon?: typeof Sofa; children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}><div className="section-heading"><div className="section-title">{step && <span className="step">{step}</span>}{Icon && <Icon size={16} />}{title}</div><ChevronDown size={15} className="muted-icon" /></div>{children}</section>
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`field ${className}`}><span>{label}</span>{children}</label> }
function Input({ value, onChange, type = 'text', placeholder, min, step }: { value: string | number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; min?: string; step?: string }) { return <input value={value} onChange={onChange} type={type} placeholder={placeholder} min={min} step={step} /> }
function Select({ value, onChange, children }: { value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) { return <select value={value} onChange={onChange}>{children}</select> }
function CheckRow({ label, checked, onChange, price }: { label: string; checked: boolean; onChange: () => void; price?: string }) { return <label className="check-row"><input type="checkbox" checked={checked} onChange={onChange} /><span className="check-box"><Check size={12} /></span><span>{label}</span>{price && <em>{price}</em>}</label> }

function PdfTemplate({ quote, client, room, dimensions, material, notes, calc }: { quote: { number: string; date: string; valid: string }; client: { name: string; phone: string; email: string }; room: { environment: string; furniture: string; quantity: string }; dimensions: { width: string; height: string; depth: string }; material: { brand: string; collection: string; color: string; thickness: string; edge: string }; notes: string; calc: { beforeTax: number; igv: number; total: number; qty: number } }) {
  const description = `${room.furniture} en melamina ${material.thickness} ${material.color}. Incluye herrajes estándar y acabado ${material.collection}. Medidas: ${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm.`
  return <div id="pdf-template" aria-hidden="true">
    <div className="pdf-header"><div><div className="pdf-logo">MODIRU Muebles</div><div className="pdf-company">MODIRU MUEBLES S.A.C.<br />RUC: 20601234567<br />Av. Principal 123, Lima · +51 987 654 321<br />www.modiru.pe</div></div><div className="pdf-quote"><strong>N° {quote.number}</strong><span>Fecha de emisión: {quote.date}</span></div></div>
    <h1>COTIZACIÓN</h1>
    <div className="pdf-block"><div className="pdf-block-title">INFORMACIÓN</div><div className="pdf-info-grid"><div><p><b>Cliente:</b> {client.name}</p><p><b>DNI/RUC:</b> —</p><p><b>Contacto:</b> {client.name}</p><p><b>Correo:</b> {client.email}</p><p><b>Teléfono:</b> {client.phone}</p></div><div><p><b>Proyecto:</b> {room.environment}</p><p><b>Tipo de mueble:</b> {room.furniture}</p><p><b>Medidas:</b> {dimensions.width} × {dimensions.height} × {dimensions.depth} cm</p><p><b>Fecha de entrega estimada:</b> 15 días hábiles</p><p><b>Asesor:</b> Equipo MODIRU</p></div></div></div>
    <table className="pdf-table"><thead><tr><th>CONCEPTO / DESCRIPCIÓN</th><th>CANTIDAD</th><th>PRECIO UNITARIO</th><th>TOTAL</th></tr></thead><tbody><tr><td>{description}</td><td>{calc.qty}</td><td>{money(calc.beforeTax / calc.qty)}</td><td>{money(calc.beforeTax)}</td></tr></tbody></table>
    <div className="pdf-footer-grid"><div><div className="pdf-block pdf-small-block"><div className="pdf-block-title">OBSERVACIÓN</div><p>{notes || 'Sin observaciones.'}</p><p>Los precios incluyen fabricación, acabados y no incluyen trabajos de gasfitería o electricidad.</p></div><div className="pdf-block pdf-small-block"><div className="pdf-block-title">CONDICIÓN DE PAGO</div><p>50% de adelanto · 50% contra entrega.</p><p>Cotización válida por {quote.valid}.</p></div></div><div className="pdf-block pdf-small-block"><div className="pdf-block-title">AUTORIZACIÓN</div><div className="pdf-signature" /><p>Firma del cliente</p><p>Asesor: Equipo MODIRU</p><p>Generado: {quote.date}</p></div><div className="pdf-totals"><div><span>Subtotal</span><b>{money(calc.beforeTax)}</b></div><div><span>IGV (18%)</span><b>{money(calc.igv)}</b></div><div className="pdf-grand-total"><span>VALOR FINAL</span><b>{money(calc.total)}</b></div></div></div>
    <div className="pdf-validity">Cotización válida por {quote.valid}.</div>
  </div>
}

export default function Page() {
  const [quote, setQuote] = useState({ number: 'COT-2024-001', date: '18/06/2024', valid: '15 días', status: 'Borrador' })
  const [client, setClient] = useState({ name: 'María González', phone: '+51 987 654 321', email: 'maria.gonzalez@email.com' })
  const [room, setRoom] = useState({ environment: 'Cocina', furniture: 'Mueble bajo', quantity: '1' })
  const [dimensions, setDimensions] = useState({ width: '240', height: '90', depth: '60' })
  const [material, setMaterial] = useState({ brand: 'Pelikano', collection: 'Arauco', color: 'Blanco', thickness: '18 mm', edge: 'PVC 1 mm' })
  const [margin, setMargin] = useState('35')
  const [waste, setWaste] = useState('8')
  const [hardware, setHardware] = useState({ hinges: true, handles: true, slides: false, legs: true })
  const [services, setServices] = useState({ measurement: true, delivery: false, installation: true })
  const [special, setSpecial] = useState({ drawers: true, lighting: false, glass: false })
  const [notes, setNotes] = useState('Considerar tomacorrientes existentes en muro posterior.')
  const [image, setImage] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const calc = useMemo(() => {
    const width = number(dimensions.width) / 100
    const height = number(dimensions.height) / 100
    const depth = number(dimensions.depth) / 100
    const qty = Math.max(1, number(room.quantity))
    const area = (width * depth * 2 + width * height * 2 + depth * height * 2) * qty
    const edge = (width * 2 + height * 2 + depth * 2) * qty
    const melamina = area * 85
    const tapacanto = edge * 7.5
    const hardwareTotal = (hardware.hinges ? 4 * 12 : 0) + (hardware.handles ? 3 * 18 : 0) + (hardware.slides ? 2 * 48 : 0) + (hardware.legs ? 4 * 9 : 0)
    const specialTotal = (special.drawers ? 2 * 85 : 0) + (special.lighting ? 120 : 0) + (special.glass ? 180 : 0)
    const serviceTotal = (services.measurement ? 60 : 0) + (services.delivery ? 80 : 0) + (services.installation ? 220 : 0)
    const direct = melamina + tapacanto + hardwareTotal + specialTotal + serviceTotal
    const wasteTotal = direct * number(waste) / 100
    const totalCost = direct + wasteTotal
    const beforeTax = totalCost / Math.max(0.01, 1 - number(margin) / 100)
    const igv = beforeTax * .18
    return { area, edge, melamina, tapacanto, hardwareTotal, specialTotal, serviceTotal, direct, wasteTotal, totalCost, beforeTax, igv, total: beforeTax + igv, qty }
  }, [dimensions, room.quantity, hardware, special, services, margin, waste])

  const update = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setter(prev => ({ ...prev, [key]: e.target.value }))
  const toggle = (setter: React.Dispatch<React.SetStateAction<any>>, key: string) => setter((prev: any) => ({ ...prev, [key]: !prev[key] }))
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setImage(URL.createObjectURL(file)) }
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200) }
  const whatsapp = () => { const text = `Hola ${client.name}, te compartimos la cotización ${quote.number} para tu ${room.furniture} de ${room.environment}. Total: ${money(calc.total)}. ¡Gracias por confiar en MODIRU!`; window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank') }
  const print = () => window.print()

  const costRows = [
    ['Melamina', `${calc.area.toFixed(2)} m²`, 85, calc.melamina],
    ['Tapacanto', `${calc.edge.toFixed(2)} ml`, 7.5, calc.tapacanto],
    ['Herrajes', '1 set', calc.hardwareTotal, calc.hardwareTotal],
    ['Accesorios especiales', '1 set', calc.specialTotal, calc.specialTotal],
    ['Servicios adicionales', '1 set', calc.serviceTotal, calc.serviceTotal],
  ] as const

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark">M</div><div><strong>MODIRU</strong><span>Cotizador de muebles</span></div></div><div className="top-actions"><span className="saved-state">{saved ? <><Check size={14} /> Guardado</> : 'Última edición hace 2 min'}</span><button className="button ghost" onClick={save}><Save size={15} /> Guardar</button><button className="button ghost" onClick={print}><ArrowDownToLine size={15} /> Generar PDF</button><button className="button primary" onClick={whatsapp}><Send size={15} /> Enviar al cliente</button></div></header>
    <div className="workspace">
      <aside className="left-column">
        <div className="column-label"><FileText size={15} /> Datos de la cotización</div>
        <Section number="1" title="Datos de cotización" icon={FileText}><div className="grid-2"><Field label="N° de cotización"><Input value={quote.number} onChange={update(setQuote, 'number')} /></Field><Field label="Fecha"><Input value={quote.date} onChange={update(setQuote, 'date')} /></Field><Field label="Válida por"><Input value={quote.valid} onChange={update(setQuote, 'valid')} /></Field><Field label="Estado"><Select value={quote.status} onChange={update(setQuote, 'status')}><option>Borrador</option><option>Enviada</option><option>Aprobada</option></Select></Field></div></Section>
        <Section number="2" title="Datos del cliente" icon={UserRound}><Field label="Nombre completo"><Input value={client.name} onChange={update(setClient, 'name')} /></Field><div className="grid-2"><Field label="Teléfono"><Input value={client.phone} onChange={update(setClient, 'phone')} /></Field><Field label="Correo electrónico"><Input value={client.email} onChange={update(setClient, 'email')} /></Field></div></Section>
        <Section number="3" title="Ambiente y tipo de mueble" icon={Sofa}><div className="grid-2"><Field label="Ambiente"><Select value={room.environment} onChange={update(setRoom, 'environment')}><option>Cocina</option><option>Dormitorio</option><option>Baño</option><option>Sala</option><option>Oficina</option></Select></Field><Field label="Tipo de mueble"><Select value={room.furniture} onChange={update(setRoom, 'furniture')}><option>Mueble bajo</option><option>Mueble alto</option><option>Clóset</option><option>Centro de entretenimiento</option></Select></Field></div><Field label="Cantidad"><Input value={room.quantity} type="number" min="1" onChange={update(setRoom, 'quantity')} /></Field></Section>
        <Section number="4" title="Dimensiones y características" icon={Settings2}><div className="dimension-grid"><Field label="Ancho (cm)"><Input value={dimensions.width} type="number" onChange={update(setDimensions, 'width')} /></Field><Field label="Alto (cm)"><Input value={dimensions.height} type="number" onChange={update(setDimensions, 'height')} /></Field><Field label="Fondo (cm)"><Input value={dimensions.depth} type="number" onChange={update(setDimensions, 'depth')} /></Field></div><div className="info-note"><Calculator size={14} /><span>Área calculada: <b>{calc.area.toFixed(2)} m²</b></span></div></Section>
        <div className="column-label middle-label"><Package size={15} /> Materiales y configuración</div>
        <Section number="5" title="Melamina" icon={Package}><div className="grid-2"><Field label="Marca"><Select value={material.brand} onChange={update(setMaterial, 'brand')}><option>Pelikano</option><option>Masisa</option><option>Vesto</option></Select></Field><Field label="Colección"><Select value={material.collection} onChange={update(setMaterial, 'collection')}><option>Arauco</option><option>Nature</option><option>Essential</option></Select></Field><Field label="Color"><Select value={material.color} onChange={update(setMaterial, 'color')}><option>Blanco</option><option>Gris humo</option><option>Roble claro</option><option>Negro</option></Select></Field><Field label="Espesor"><Select value={material.thickness} onChange={update(setMaterial, 'thickness')}><option>18 mm</option><option>15 mm</option><option>12 mm</option></Select></Field></div><div className="swatch-line"><span className="swatch" /> Acabado mate · Blanco</div></Section>
        <Section number="6" title="Tapacanto" icon={Sparkles}><div className="grid-2"><Field label="Tipo"><Select value={material.edge} onChange={update(setMaterial, 'edge')}><option>PVC 1 mm</option><option>PVC 2 mm</option><option>Melamínico</option></Select></Field><Field label="Metros requeridos"><div className="computed-input">{calc.edge.toFixed(2)} ml <span>auto</span></div></Field></div></Section>
        <Section number="7" title="Diseño del mueble" icon={Sofa}><div className="design-chips"><button className="chip active">Moderno</button><button className="chip">Minimalista</button><button className="chip">Clásico</button></div><Field label="Distribución"><Select value="2 puertas + 3 cajones" onChange={() => {}}><option>2 puertas + 3 cajones</option><option>3 puertas</option><option>Abierto</option></Select></Field></Section>
        <Section number="8" title="Herrajes" icon={Settings2}><CheckRow label="Bisagras cierre suave" checked={hardware.hinges} onChange={() => toggle(setHardware, 'hinges')} price="S/ 48.00" /><CheckRow label="Tiradores estándar" checked={hardware.handles} onChange={() => toggle(setHardware, 'handles')} price="S/ 54.00" /><CheckRow label="Correderas telescópicas" checked={hardware.slides} onChange={() => toggle(setHardware, 'slides')} price="S/ 96.00" /><CheckRow label="Patas regulables" checked={hardware.legs} onChange={() => toggle(setHardware, 'legs')} price="S/ 36.00" /></Section>
      </aside>
      <section className="center-column">
        <div className="column-label"><Sparkles size={15} /> Opciones y observaciones</div>
        <Section number="9" title="Accesorios especiales" icon={Plus}><CheckRow label="Cajones interiores" checked={special.drawers} onChange={() => toggle(setSpecial, 'drawers')} price="S/ 170.00" /><CheckRow label="Iluminación LED" checked={special.lighting} onChange={() => toggle(setSpecial, 'lighting')} price="S/ 120.00" /><CheckRow label="Puertas de vidrio" checked={special.glass} onChange={() => toggle(setSpecial, 'glass')} price="S/ 180.00" /></Section>
        <Section number="10" title="Servicios adicionales" icon={ShieldCheck}><CheckRow label="Visita de medición" checked={services.measurement} onChange={() => toggle(setServices, 'measurement')} price="S/ 60.00" /><CheckRow label="Despacho a domicilio" checked={services.delivery} onChange={() => toggle(setServices, 'delivery')} price="S/ 80.00" /><CheckRow label="Instalación en domicilio" checked={services.installation} onChange={() => toggle(setServices, 'installation')} price="S/ 220.00" /></Section>
        <Section title="Observaciones"><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} /></Section>
        <Section title="Imagen / Referencia"><label className="upload-area"><input type="file" accept="image/*" onChange={handleImage} /><Upload size={19} /><span>{image ? 'Cambiar imagen' : 'Sube una imagen de referencia'}</span><small>JPG, PNG hasta 5MB</small></label>{image && <div className="image-preview"><img src={image} alt="Referencia del mueble" /><button onClick={() => setImage(null)} aria-label="Eliminar imagen"><Trash2 size={14} /></button></div>}</Section>
        <div className="cost-panel panel"><div className="section-heading"><div className="section-title"><span className="step">11</span><Calculator size={16} /> Detalle de costos</div><span className="internal-badge">Interno</span></div><div className="cost-head"><span>CONCEPTO</span><span>CANT.</span><span>UNITARIO</span><span>TOTAL</span></div>{costRows.map(([label, qty, unit, total]) => <div className="cost-row" key={label}><span>{label}</span><span>{qty}</span><span>{money(unit)}</span><strong>{money(total)}</strong></div>)}<div className="cost-total"><span>Costo directo</span><strong>{money(calc.direct)}</strong></div></div>
      </section>
      <aside className="right-column">
        <div className="column-label"><Calculator size={15} /> Resumen y precio</div>
        <Section number="12" title="Márgenes y precio final" icon={Calculator}><div className="margin-control"><div><span>Margen de utilidad</span><b>{margin}%</b></div><input type="range" min="10" max="60" value={margin} onChange={e => setMargin(e.target.value)} /></div><div className="summary-list"><div><span>Costo directo</span><b>{money(calc.direct)}</b></div><div><span>Gastos / Merma ({waste}%)</span><label><input className="mini-input" value={waste} onChange={e => setWaste(e.target.value)} type="number" min="0" max="50" /> {money(calc.wasteTotal)}</label></div><div className="bold-line"><span>Costo total</span><b>{money(calc.totalCost)}</b></div><div><span>Precio antes de impuestos</span><b>{money(calc.beforeTax)}</b></div><div><span>IGV (18%)</span><b>{money(calc.igv)}</b></div></div><div className="final-total"><span>TOTAL (S/)</span><strong>{money(calc.total)}</strong><small>Precio incluye IGV</small></div></Section>
        <div className="profit-card"><div className="profit-icon"><Sparkles size={18} /></div><div><span>Rentabilidad estimada</span><strong>{margin}%</strong><small>Margen saludable para este proyecto</small></div><div className="profit-ring"><span>{margin}%</span></div></div>
        <Section title="Condiciones comerciales" icon={FileText}><div className="terms"><p><b>Forma de pago</b><span>50% adelanto · 50% contra entrega</span></p><p><b>Tiempo de entrega</b><span>15 días hábiles</span></p><p><b>Garantía</b><span>12 meses por defectos de fabricación</span></p></div></Section>
        <div className="tip"><ShieldCheck size={16} /><span>Los costos internos no serán visibles para el cliente.</span></div>
      </aside>
    </div>
    <section className="client-summary panel"><div className="summary-header"><div><span className="eyebrow">VISTA PARA EL CLIENTE</span><h2>Resumen de cotización</h2></div><button className="button ghost" onClick={print}><ArrowDownToLine size={15} /> Descargar resumen</button></div><div className="client-meta"><span><b>{quote.number}</b><small>Cotización</small></span><span><b>{client.name}</b><small>Cliente</small></span><span><b>{room.furniture} · {room.environment}</b><small>Proyecto</small></span><span className="client-price"><b>{money(calc.total)}</b><small>Total incluido IGV</small></span></div><div className="client-items"><div><Package size={16} /><span>{material.brand} {material.collection} · {material.color}</span></div><div><Sofa size={16} /><span>{dimensions.width} × {dimensions.height} × {dimensions.depth} cm</span></div><div><ShieldCheck size={16} /><span>Garantía de 12 meses</span></div></div></section>
    <footer><span>MODIRU · Diseño que habita tus espacios</span><span>Todos los precios en soles peruanos · IGV incluido</span></footer>
    <PdfTemplate quote={quote} client={client} room={room} dimensions={dimensions} material={material} notes={notes} calc={calc} />
  </main>
}
