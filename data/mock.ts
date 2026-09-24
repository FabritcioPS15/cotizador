export type Status = 'Borrador' | 'En revisión' | 'Enviada' | 'Aprobada' | 'Rechazada' | 'Vencida' | 'Cancelada'
export type ProductCategory = 'Melaminas' | 'Tapacantos' | 'Herrajes' | 'Accesorios' | 'Servicios' | 'Mano de obra'

export type Customer = { id: string; name: string; taxId: string; phone: string; email: string; projects: number; quotes: number; status: 'Activo' | 'Inactivo' }
export type Product = { id: string; category: ProductCategory; name: string; brand: string; model: string; detail: string; unit: string; price: number; status: 'Activo' | 'Inactivo'; updated: string; swatch?: string }
export type Quote = { id: string; customer: string; project: string; date: string; valid: string; total: number; margin: number; status: Status; advisor: string }
export type Project = { id: string; name: string; customer: string; environment: string; status: string; date: string; amount: number; owner: string }

export const products: Product[] = [
  { id: 'MAT-001', category: 'Melaminas', name: 'Roble Natural 18 mm', brand: 'Masisa', model: 'Nature', detail: 'Texturado · 18 mm', unit: 'm²', price: 85, status: 'Activo', updated: '18 jun 2024', swatch: '#c9a27a' },
  { id: 'MAT-002', category: 'Melaminas', name: 'Blanco Nevado 18 mm', brand: 'Pelikano', model: 'Essential', detail: 'Mate · 18 mm', unit: 'm²', price: 72, status: 'Activo', updated: '17 jun 2024', swatch: '#f4f3f0' },
  { id: 'MAT-003', category: 'Melaminas', name: 'Nogal Siena 18 mm', brand: 'Arauco', model: 'Design', detail: 'Veteado · 18 mm', unit: 'm²', price: 98, status: 'Activo', updated: '12 jun 2024', swatch: '/textures/nogal.svg' },
  { id: 'EDG-001', category: 'Tapacantos', name: 'PVC Blanco 1 mm', brand: 'Rehau', model: 'Estándar', detail: 'Blanco · 1 mm', unit: 'ml', price: 7.5, status: 'Activo', updated: '18 jun 2024' },
  { id: 'EDG-002', category: 'Tapacantos', name: 'PVC Roble 2 mm', brand: 'Rehau', model: 'Nature', detail: 'Roble · 2 mm', unit: 'ml', price: 11, status: 'Activo', updated: '14 jun 2024' },
  { id: 'HAR-001', category: 'Herrajes', name: 'Bisagra cierre suave', brand: 'Blum', model: 'Clip top', detail: '110° · overlay', unit: 'und', price: 12, status: 'Activo', updated: '18 jun 2024' },
  { id: 'HAR-002', category: 'Herrajes', name: 'Corredera telescópica', brand: 'Hettich', model: 'KA 4532', detail: '45 cm · carga 25 kg', unit: 'par', price: 48, status: 'Activo', updated: '15 jun 2024' },
  { id: 'ACC-001', category: 'Accesorios', name: 'Iluminación LED cálida', brand: 'Ledvance', model: 'Banda 1.5 m', detail: 'Incluye sensor', unit: 'set', price: 120, status: 'Activo', updated: '11 jun 2024' },
  { id: 'SRV-001', category: 'Servicios', name: 'Instalación en domicilio', brand: 'MODIRU', model: 'Estándar', detail: 'Por proyecto', unit: 'servicio', price: 220, status: 'Activo', updated: '01 jun 2024' },
  { id: 'LAB-001', category: 'Mano de obra', name: 'Fabricación estándar', brand: 'MODIRU', model: 'Mueble a medida', detail: 'Corte, canteado y armado', unit: 'm²', price: 145, status: 'Activo', updated: '01 jun 2024' },
]

export const customers: Customer[] = [
  { id: 'CLI-001', name: 'María González', taxId: 'DNI 45872136', phone: '+51 987 654 321', email: 'maria.gonzalez@email.com', projects: 2, quotes: 4, status: 'Activo' },
  { id: 'CLI-002', name: 'Carlos Pérez', taxId: 'DNI 42158963', phone: '+51 999 123 456', email: 'carlos.perez@email.com', projects: 1, quotes: 2, status: 'Activo' },
  { id: 'CLI-003', name: 'Constructora Los Andes', taxId: 'RUC 20587412369', phone: '+51 1 456 7890', email: 'compras@losandes.pe', projects: 6, quotes: 11, status: 'Activo' },
  { id: 'CLI-004', name: 'Mariana Rodríguez', taxId: 'DNI 70452136', phone: '+51 987 456 123', email: 'mariana.r@email.com', projects: 1, quotes: 1, status: 'Inactivo' },
]

export const quotes: Quote[] = [
  { id: 'COT-2024-001', customer: 'María González', project: 'Cocina integral · Surco', date: '18 jun 2024', valid: '15 días', total: 2134.63, margin: 35, status: 'Borrador', advisor: 'Ana Torres' },
  { id: 'COT-2024-002', customer: 'Carlos Pérez', project: 'Clóset principal · Miraflores', date: '17 jun 2024', valid: '15 días', total: 4680, margin: 38, status: 'Enviada', advisor: 'Ana Torres' },
  { id: 'COT-2024-003', customer: 'Constructora Los Andes', project: 'Muebles oficina · San Isidro', date: '14 jun 2024', valid: '30 días', total: 12750, margin: 32, status: 'Aprobada', advisor: 'Luis Castro' },
  { id: 'COT-2024-004', customer: 'Mariana Rodríguez', project: 'Rack TV · La Molina', date: '12 jun 2024', valid: '15 días', total: 1820, margin: 35, status: 'En revisión', advisor: 'Ana Torres' },
]

export const projects: Project[] = [
  { id: 'PRY-001', name: 'Cocina integral · Surco', customer: 'María González', environment: 'Cocina', status: 'Cotización', date: '18 jun 2024', amount: 2134.63, owner: 'Ana Torres' },
  { id: 'PRY-002', name: 'Clóset principal · Miraflores', customer: 'Carlos Pérez', environment: 'Dormitorio', status: 'En fabricación', date: '17 jun 2024', amount: 4680, owner: 'Ana Torres' },
  { id: 'PRY-003', name: 'Muebles oficina · San Isidro', customer: 'Constructora Los Andes', environment: 'Oficina', status: 'Aprobado', date: '14 jun 2024', amount: 12750, owner: 'Luis Castro' },
  { id: 'PRY-004', name: 'Rack TV · La Molina', customer: 'Mariana Rodríguez', environment: 'Sala', status: 'Prospecto', date: '12 jun 2024', amount: 1820, owner: 'Ana Torres' },
]

export const formatMoney = (value: number) => `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const statusTone = (status: string) => status.toLowerCase().replaceAll(' ', '-').replace('ó', 'o')
export const categories: ProductCategory[] = ['Melaminas', 'Tapacantos', 'Herrajes', 'Accesorios', 'Servicios', 'Mano de obra']
