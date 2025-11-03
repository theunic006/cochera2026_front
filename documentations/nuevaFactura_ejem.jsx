import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import clienteService from '../services/clienteService'
import comprobanteService from '../services/comprobanteService'
import cocheraService from '../services/cocheraService'
import apiFacturacion from '../services/apiFacturacion'
import sunatService from '../services/sunatService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Alert from '../components/common/Alert'
import Modal from '../components/common/Modal'

const NuevaFactura = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ticketId = searchParams.get('ticket')

  const [loading, setLoading] = useState(false)
  const [buscandoCliente, setBuscandoCliente] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [series, setSeries] = useState([])
  const [serieActual, setSerieActual] = useState(null)
  const [numeroComprobante, setNumeroComprobante] = useState(null)

  // Datos del comprobante
  const [formData, setFormData] = useState({
    tipo: 'BOLETA',
    fechaEmision: new Date().toISOString().split('T')[0],
    moneda: 'PEN',
    // Cliente
    clienteTipoDoc: 'DNI',
    clienteDocumento: '',
    clienteNombre: '',
    clienteDireccion: '',
    clienteEmail: '',
    // Detalle
    items: [
      {
        descripcion: 'Servicio de Estacionamiento',
        cantidad: 1,
        precioUnitario: 0,
        subtotal: 0,
        igv: 0,
        total: 0
      }
    ]
  })

  // Cálculos
  const [totales, setTotales] = useState({
    subtotal: 0,
    igv: 0,
    total: 0
  })

  const [showClienteModal, setShowClienteModal] = useState(false)

  // Cargar series al iniciar
  useEffect(() => {
    cargarSeries()
  }, [])

  useEffect(() => {
    if (ticketId) {
      cargarDatosTicket(ticketId)
    }
  }, [ticketId])

  useEffect(() => {
    calcularTotales()
  }, [formData.items])

  // Actualizar serie y número cuando cambia el tipo de comprobante
  useEffect(() => {
    actualizarSerieYNumero()
  }, [formData.tipo, series])

  const cargarSeries = async () => {
    try {
      console.log('📊 Cargando series desde /apifactura/series...')
      const response = await apiFacturacion.get('/series')
      
      if (response.data && response.data.success) {
        setSeries(response.data.data)
        console.log('✅ Series cargadas:', response.data.data)
        
        // Establecer serie inicial para BOLETA
        actualizarSerieYNumero()
      }
    } catch (err) {
      console.error('❌ Error al cargar series:', err)
    }
  }

  const actualizarSerieYNumero = () => {
    if (series.length === 0) return

    // Mapear tipo de comprobante a tipo_comprobante
    const tipoComprobanteMap = {
      'FACTURA': '01',
      'BOLETA': '03',
      'NOTA_CREDITO': '07'
    }
    
    const tipoBuscado = tipoComprobanteMap[formData.tipo]
    
    // Buscar la serie correspondiente
    const serieEncontrada = series.find(s => s.tipo_comprobante === tipoBuscado)
    
    if (serieEncontrada) {
      setSerieActual(serieEncontrada)
      // El siguiente número es el correlativo actual + 1
      const siguienteNumero = serieEncontrada.correlativo_actual + 1
      setNumeroComprobante(siguienteNumero)
      
      console.log('🔢 Serie actualizada:', {
        tipo: formData.tipo,
        serie: serieEncontrada.serie,
        correlativoActual: serieEncontrada.correlativo_actual,
        siguienteNumero: siguienteNumero
      })
    } else {
      console.warn('⚠️ No se encontró serie para tipo:', formData.tipo)
      setSerieActual(null)
      setNumeroComprobante(null)
    }
  }

  const cargarDatosTicket = async (id) => {
    try {
      setLoading(true)
      const ticket = await cocheraService.getTicket(id)
      
      // Prellenar datos del ticket
      setFormData(prev => ({
        ...prev,
        items: [{
          descripcion: `Estacionamiento - Ticket ${ticket.numero}`,
          cantidad: 1,
          precioUnitario: ticket.monto,
          subtotal: (ticket.monto / 1.18).toFixed(2),
          igv: (ticket.monto - (ticket.monto / 1.18)).toFixed(2),
          total: ticket.monto
        }]
      }))
    } catch (err) {
      setError('Error al cargar datos del ticket')
    } finally {
      setLoading(false)
    }
  }

  const calcularTotales = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const itemSubtotal = parseFloat(item.precioUnitario) * parseFloat(item.cantidad)
      return sum + (itemSubtotal / 1.18)
    }, 0)

    const igv = subtotal * 0.18
    const total = subtotal + igv

    setTotales({
      subtotal: subtotal.toFixed(6),
      igv: igv.toFixed(6),
      total: total.toFixed(6)
    })
  }

  const handleInputChange = (campo, valor) => {
    // Para documento, solo limpiar y almacenar sin cambiar tipo automáticamente
    if (campo === 'clienteDocumento') {
      const numeros = valor.replace(/\D/g, '')
      console.log('📝 Documento ingresado:', numeros, 'Longitud:', numeros.length)
      
      // Solo actualizar el campo, NO cambiar el tipo automáticamente
      // El tipo debe ser seleccionado manualmente por el usuario
      setFormData(prev => ({
        ...prev,
        [campo]: numeros
      }))
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Nueva función para autodetectar tipo de documento al hacer blur o buscar
  const autodetectarTipoDocumento = () => {
    const numeros = formData.clienteDocumento
    if (numeros.length === 11 && formData.clienteTipoDoc !== 'RUC') {
      console.log('✅ Autodetectado: RUC (11 dígitos)')
      setFormData(prev => ({
        ...prev,
        clienteTipoDoc: 'RUC'
      }))
    } else if (numeros.length === 8 && formData.clienteTipoDoc !== 'DNI') {
      console.log('✅ Autodetectado: DNI (8 dígitos)')
      setFormData(prev => ({
        ...prev,
        clienteTipoDoc: 'DNI'
      }))
    }
  }

  const handleItemChange = (index, campo, valor) => {
    const newItems = [...formData.items]
    newItems[index][campo] = valor

    // Recalcular item
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      const cantidad = parseFloat(newItems[index].cantidad) || 0
      const precio = parseFloat(newItems[index].precioUnitario) || 0
      const total = cantidad * precio
      const subtotal = total / 1.18
      const igv = total - subtotal

      newItems[index].subtotal = subtotal.toFixed(2)
      newItems[index].igv = igv.toFixed(2)
      newItems[index].total = total.toFixed(2)
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }))
  }

  const agregarItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          descripcion: '',
          cantidad: 1,
          precioUnitario: 0,
          subtotal: 0,
          igv: 0,
          total: 0
        }
      ]
    }))
  }

  const eliminarItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        items: newItems
      }))
    }
  }

  const buscarCliente = async () => {
    if (!formData.clienteDocumento) {
      setError('Ingrese un número de documento')
      return
    }

    // Autodetectar tipo de documento antes de buscar
    autodetectarTipoDocumento()

    try {
      setBuscandoCliente(true)
      setError('')
      setSuccess('')

      console.log('🔍 Buscando cliente:', formData.clienteDocumento)
      console.log('📋 Tipo de documento:', formData.clienteTipoDoc)
      
      // 1. Primero buscar en la base de datos local
      try {
        console.log('🔍 Consultando BD local con POST /clientes/buscar-documento...')
        
        // Intentar con POST primero
        let response
        try {
          response = await apiFacturacion.post('/clientes/buscar-documento', {
            numero_documento: formData.clienteDocumento
          })
        } catch (postError) {
          // Si falla por CSRF, intentar con GET
          if (postError.response?.status === 419) {
            console.log('⚠️ Error CSRF, intentando con GET...')
            response = await apiFacturacion.get('/clientes/buscar-documento', {
              params: { numero_documento: formData.clienteDocumento }
            })
          } else {
            throw postError
          }
        }

        console.log('✅ Respuesta completa de BD:', response)
        console.log('✅ Datos de BD:', response.data)
        
        if (response.data && response.data.success && response.data.data) {
          const cliente = response.data.data
          console.log('✅ Cliente encontrado en BD:', cliente)
          
          // Construir el nombre completo según los campos disponibles
          let nombreCompleto = ''
          if (cliente.razon_social) {
            nombreCompleto = cliente.razon_social
          } else if (cliente.nombres) {
            nombreCompleto = `${cliente.nombres || ''} ${cliente.apepaterbo || ''} ${cliente.apematerno || ''}`.trim()
          }
          
          setFormData(prev => ({
            ...prev,
            clienteNombre: nombreCompleto,
            clienteDireccion: cliente.direccion || '',
            clienteEmail: cliente.email || ''
          }))
          setSuccess('✅ Cliente encontrado en base de datos')
          return
        } else {
          console.log('⚠️ Cliente no encontrado en BD, buscando en API externa...')
        }
      } catch (err) {
        console.log('⚠️ Error al consultar BD:', err.response?.data?.message || err.message)
        console.log('🔍 Buscando en API externa...')
      }

      // 2. Si no se encuentra en BD, buscar en API externa
      console.log('🔍 Buscando en API externa...')
      let clienteExterno = null
      let datosParaGuardar = null
      
      if (formData.clienteTipoDoc === 'RUC') {
        console.log('🔍 Buscando RUC en API SUNAT:', formData.clienteDocumento)
        try {
          const result = await sunatService.consultarRUC(formData.clienteDocumento)
          
          if (result.success && result.data) {
            console.log('✅ RUC encontrado en SUNAT:', result.data)
            
            const razonSocial = result.data.razon_social || result.data.razonSocial || result.data.nombre || ''
            const direccion = result.data.direccion_fiscal || result.data.direccion || '-'
            const nombreComercial = result.data.nombre_comercial || '-'
            
            clienteExterno = {
              razon_social: razonSocial,
              direccion: direccion,
              email: ''
            }
            
            // Preparar datos para guardar en BD
            datosParaGuardar = {
              tipo_documento: formData.clienteTipoDoc,
              numero_documento: formData.clienteDocumento,
              nombres: null,
              apepaterno: null,
              apematerno: null,
              razon_social: razonSocial,
              email: null,
              direccion: direccion || '-',
              telefono: null,
              descripcion: `Nombre comercial: ${nombreComercial}`,
              estado: 1
            }
          } else {
            console.log('❌ RUC no encontrado en SUNAT:', result.message)
          }
        } catch (err) {
          console.error('❌ Error al consultar SUNAT:', err)
        }
      } else if (formData.clienteTipoDoc === 'DNI') {
        console.log('🔍 Buscando DNI en RENIEC:', formData.clienteDocumento)
        try {
          const result = await sunatService.consultarDNI(formData.clienteDocumento)
          
          if (result.success && result.data) {
            console.log('✅ DNI encontrado en RENIEC:', result.data)
            
            const nombres = result.data.nombres || ''
            const apellidoPaterno = result.data.apellido_paterno || result.data.apellidoPaterno || ''
            const apellidoMaterno = result.data.apellido_materno || result.data.apellidoMaterno || ''
            const apellidos = result.data.apellidos || ''
            
            const nombreCompleto = result.data.nombre_completo || 
              (nombres && apellidoPaterno ? `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim() : '') ||
              (nombres && apellidos ? `${nombres} ${apellidos}`.trim() : '')
            
            clienteExterno = {
              nombre_completo: nombreCompleto,
              direccion: result.data.direccion || '-',
              email: ''
            }
            
            // Preparar datos para guardar en BD
            datosParaGuardar = {
              tipo_documento: formData.clienteTipoDoc,
              numero_documento: formData.clienteDocumento,
              nombres: nombres || null,
              apepaterno: apellidoPaterno || null,
              apematerno: apellidoMaterno || null,
              razon_social: null,
              email: null,
              direccion: result.data.direccion || '-',
              telefono: null,
              descripcion: null,
              estado: 1
            }
          } else {
            console.log('❌ DNI no encontrado en RENIEC:', result.message)
          }
        } catch (err) {
          console.error('❌ Error al consultar RENIEC:', err)
        }
      }

      if (clienteExterno && datosParaGuardar) {
        // Guardar cliente en la base de datos
        try {
          console.log('💾 Guardando cliente en BD...', datosParaGuardar)
          const responseGuardar = await apiFacturacion.post('/clientes', datosParaGuardar)
          console.log('✅ Cliente guardado en BD:', responseGuardar.data)
        } catch (errGuardar) {
          console.warn('⚠️ No se pudo guardar el cliente en BD:', errGuardar.response?.data?.message || errGuardar.message)
          // Continuar aunque falle el guardado
        }
        
        // Actualizar formulario con los datos encontrados
        setFormData(prev => ({
          ...prev,
          clienteNombre: clienteExterno.razon_social || clienteExterno.nombre_completo || '',
          clienteDireccion: clienteExterno.direccion || '-',
          clienteEmail: clienteExterno.email || ''
        }))
        setSuccess('✅ Cliente encontrado en ' + (formData.clienteTipoDoc === 'RUC' ? 'SUNAT' : 'RENIEC') + ' y guardado en BD')
      } else {
        // Si no encuentra en ningún lado, permitir edición manual con valores por defecto
        setFormData(prev => ({
          ...prev,
          clienteNombre: prev.clienteNombre || '',
          clienteDireccion: prev.clienteDireccion || '-',
          clienteEmail: prev.clienteEmail || ''
        }))
        setError('⚠️ Cliente no encontrado. Por favor, complete los datos manualmente.')
        console.log('ℹ️ Usuario puede editar campos manualmente')
      }
    } catch (err) {
      setError('❌ Error al buscar cliente: ' + (err.response?.data?.message || err.message))
      console.error('❌ Error completo:', err)
      setShowClienteModal(true)
    } finally {
      setBuscandoCliente(false)
    }
  }

  const validarFormulario = () => {
    if (!formData.clienteDocumento) {
      setError('Ingrese el documento del cliente')
      return false
    }

    if (!formData.clienteNombre) {
      setError('Ingrese el nombre del cliente')
      return false
    }

    if (formData.tipo === 'FACTURA' && formData.clienteTipoDoc !== 'RUC') {
      setError('Las facturas requieren RUC')
      return false
    }

    if (formData.items.length === 0) {
      setError('Agregue al menos un item')
      return false
    }

    if (parseFloat(totales.total) <= 0) {
      setError('El total debe ser mayor a 0')
      return false
    }

    return true
  }

  const guardarComprobante = async () => {
    if (!validarFormulario()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // 1. Preparar datos para SUNAT
      console.log('====================================')
      console.log('📤 PREPARANDO EMISIÓN A SUNAT')
      console.log('====================================')
      console.log('📋 Datos del formulario:', {
        tipo: formData.tipo,
        fechaEmision: formData.fechaEmision,
        moneda: formData.moneda,
        clienteTipoDoc: formData.clienteTipoDoc,
        clienteDocumento: formData.clienteDocumento,
        clienteNombre: formData.clienteNombre,
        clienteDireccion: formData.clienteDireccion,
        items: formData.items,
        totales: totales
      })
      
      // Validar que exista serie y número
      if (!serieActual || !numeroComprobante) {
        throw new Error('No se pudo determinar la serie y número del comprobante')
      }
      
      // Usar serie y número del estado
      const serie = serieActual.serie
      const numero = numeroComprobante
      console.log('� Serie y número:', {
        serie: serie,
        numero: numero,
        correlativoActual: serieActual.correlativo_actual
      })
      
      // Calcular fecha de vencimiento (hoy + 1 día)
      const fechaEmision = formData.fechaEmision
      const fechaVencimiento = new Date(fechaEmision)
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 1)
      const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0]
      console.log('📅 Fechas:', {
        emision: fechaEmision,
        vencimiento: fechaVencimientoStr
      })
      
      // Mapear tipo de documento cliente (DNI=1, RUC=6, CE=4, PASAPORTE=7)
      const tipoDocumentoMap = {
        'DNI': '1',
        'RUC': '6',
        'CE': '4',
        'PASAPORTE': '7'
      }
      const clienteTipoDocumento = tipoDocumentoMap[formData.clienteTipoDoc] || '1'
      console.log('🆔 Tipo documento cliente:', {
        original: formData.clienteTipoDoc,
        mapeado: clienteTipoDocumento
      })
      
      // Preparar items con el formato de SUNAT
      const itemsSunat = formData.items.map((item, index) => {
        const valorUnitario = (parseFloat(item.precioUnitario) / 1.18).toFixed(6)
        console.log(`📦 Item ${index + 1}:`, {
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          valorUnitarioSinIGV: valorUnitario
        })
        
        return {
          unidad_de_medida: 'NIU',
          descripcion: item.descripcion,
          cantidad: item.cantidad.toString(),
          valor_unitario: valorUnitario, // Sin IGV
          porcentaje_igv: '18',
          codigo_tipo_afectacion_igv: '10'
        }
      })
      
      // Preparar payload para SUNAT
      const datosSunat = {
        documento: formData.tipo.toLowerCase(),
        serie: serie,
        numero: numero,
        fecha_de_emision: fechaEmision,
        fecha_de_vencimiento: fechaVencimientoStr,
        moneda: formData.moneda,
        tipo_operacion: '0101',
        cliente_tipo_de_documento: clienteTipoDocumento,
        cliente_numero_de_documento: formData.clienteDocumento,
        cliente_denominacion: formData.clienteNombre,
        cliente_direccion: formData.clienteDireccion || '-',
        items: itemsSunat,
        total_igv: totales.igv,
        total_gravada: totales.subtotal,
        total: totales.total
      }
      
      console.log('====================================')
      console.log('🚀 PAYLOAD COMPLETO PARA SUNAT:')
      console.log('====================================')
      console.log(JSON.stringify(datosSunat, null, 2))
      console.log('====================================')
      
      // 2. Enviar a SUNAT
      console.log('🌐 Enviando a SUNAT (POST https://app.apisunat.pe/api/test/documents)...')
      const responseSunat = await sunatService.emitirComprobante(datosSunat)
      
      console.log('📥 Respuesta completa de SUNAT:')
      console.log(JSON.stringify(responseSunat, null, 2))
      
      if (!responseSunat.success) {
        console.error('❌ ERROR DE SUNAT:', responseSunat)
        throw new Error(responseSunat.message || 'Error al emitir comprobante en SUNAT')
      }
      
      console.log('✅ Comprobante aceptado por SUNAT')
      console.log('📄 Datos del comprobante:', responseSunat.data)
      
      // 3. Preparar datos para guardar en BD local
      const datosLocal = {
        id_empresa: 1,
        documento: formData.tipo.toLowerCase(),
        serie: serie,
        numero: numero,
        fecha_de_emision: fechaEmision,
        fecha_de_vencimiento: fechaVencimientoStr,
        moneda: formData.moneda,
        orden_compra_servicio: null,
        tipo_operacion: '0101',
        cliente_tipo_de_documento: clienteTipoDocumento,
        cliente_numero_de_documento: formData.clienteDocumento,
        cliente_denominacion: formData.clienteNombre,
        cliente_direccion: formData.clienteDireccion || '-',
        items: itemsSunat,
        total_igv: totales.igv,
        total_gravada: totales.subtotal,
        total: totales.total,
        payload: responseSunat.data // Estado, hash, xml, cdr, pdf
      }
      
      console.log('💾 Guardando en BD local...', datosLocal)
      
      // 4. Guardar en BD local
      const responseLocal = await apiFacturacion.post('/comprobantes', datosLocal)
      
      console.log('✅ Comprobante guardado en BD:', responseLocal.data)
      
      // 5. Actualizar correlativo en la tabla series
      try {
        console.log('🔄 Actualizando correlativo en tabla series...')
        console.log('📊 Datos para actualizar:', {
          serieId: serieActual.id,
          correlativo_actual: numeroComprobante
        })
        
        const responseActualizar = await apiFacturacion.put(`/series/${serieActual.id}`, {
          correlativo_actual: numeroComprobante
        })
        
        console.log('✅ Correlativo actualizado:', responseActualizar.data)
        
        // Actualizar el estado local de series
        setSeries(prevSeries => 
          prevSeries.map(s => 
            s.id === serieActual.id 
              ? { ...s, correlativo_actual: numeroComprobante }
              : s
          )
        )
        setSerieActual(prev => ({ ...prev, correlativo_actual: numeroComprobante }))
        
      } catch (errActualizar) {
        console.warn('⚠️ No se pudo actualizar el correlativo:', errActualizar.response?.data?.message || errActualizar.message)
        // No detener el flujo, solo advertir
      }
      
      setSuccess('✅ Factura/Boleta emitida exitosamente y guardada en BD')
      
      // Redirigir al detalle del comprobante después de 2 segundos
      setTimeout(() => {
        if (responseLocal.data.id) {
          navigate(`/comprobantes/${responseLocal.data.id}`)
        } else {
          navigate('/comprobantes')
        }
      }, 2000)
      
    } catch (err) {
      console.error('❌ Error al emitir comprobante:', err)
      setError('❌ Error: ' + (err.response?.data?.message || err.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nueva Factura/Boleta</h1>
          <p className="text-base-content/70">Emisión de comprobante electrónico</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-ghost">
          ← Volver
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Formulario Principal */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Tipo de Comprobante, Serie/Número y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Tipo de Comprobante *</span>
              </label>
              <select 
                className="select select-bordered select-lg"
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                <option value="BOLETA">📄 Boleta</option>
                <option value="FACTURA">📋 Factura</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Serie *</span>
              </label>
              <input 
                type="text"
                placeholder="F001 o B001"
                className="input input-bordered input-lg font-mono font-bold text-primary"
                value={serieActual ? serieActual.serie : ''}
                onChange={(e) => {
                  if (serieActual) {
                    setSerieActual({ ...serieActual, serie: e.target.value.toUpperCase() })
                  }
                }}
                maxLength={4}
              />
              <label className="label">
                <span className="label-text-alt">
                  Editable
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Número *</span>
              </label>
              <input 
                type="number"
                placeholder="1234"
                className="input input-bordered input-lg font-mono font-bold text-primary"
                value={numeroComprobante || ''}
                onChange={(e) => setNumeroComprobante(parseInt(e.target.value) || 0)}
                min="1"
              />
              <label className="label">
                <span className="label-text-alt">
                  Editable
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Fecha de Emisión *</span>
              </label>
              <input 
                type="date"
                className="input input-bordered input-lg"
                value={formData.fechaEmision}
                onChange={(e) => handleInputChange('fechaEmision', e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Moneda</span>
              </label>
              <select 
                className="select select-bordered select-lg"
                value={formData.moneda}
                onChange={(e) => handleInputChange('moneda', e.target.value)}
              >
                <option value="PEN">🇵🇪 Soles (PEN)</option>
                <option value="USD">🇺🇸 Dólares (USD)</option>
              </select>
            </div>
          </div>

          <div className="divider">DATOS DEL CLIENTE</div>

          {/* Datos del Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Tipo de Documento *</span>
              </label>
              <select 
                className="select select-bordered"
                value={formData.clienteTipoDoc}
                onChange={(e) => handleInputChange('clienteTipoDoc', e.target.value)}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-bold">Número de Documento *</span>
              </label>
              <div className="join w-full">
                <input 
                  type="text"
                  placeholder={formData.clienteTipoDoc === 'RUC' ? '20123456789 (11 dígitos)' : formData.clienteTipoDoc === 'DNI' ? '12345678 (8 dígitos)' : 'Número de documento'}
                  className="input input-bordered join-item flex-1"
                  value={formData.clienteDocumento}
                  onChange={(e) => handleInputChange('clienteDocumento', e.target.value)}
                  onBlur={autodetectarTipoDocumento}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      buscarCliente()
                    }
                  }}
                  maxLength={20}
                />
                <button 
                  className="btn btn-primary join-item"
                  onClick={buscarCliente}
                  disabled={buscandoCliente}
                >
                  {buscandoCliente ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Buscando...
                    </>
                  ) : (
                    '🔍 Buscar'
                  )}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt">
                  {formData.clienteTipoDoc === 'RUC' 
                    ? 'Escribe 11 dígitos para RUC. Se autodetecta al salir del campo.' 
                    : formData.clienteTipoDoc === 'DNI'
                    ? 'Escribe 8 dígitos para DNI. Se autodetecta al salir del campo.'
                    : 'El tipo se detecta automáticamente: 8 dígitos = DNI, 11 dígitos = RUC'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">
                  {formData.tipo === 'FACTURA' ? 'Razón Social *' : 'Nombre Completo *'}
                </span>
              </label>
              <input 
                type="text"
                placeholder="Nombre del cliente"
                className="input input-bordered"
                value={formData.clienteNombre}
                onChange={(e) => handleInputChange('clienteNombre', e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <input 
                type="email"
                placeholder="cliente@email.com"
                className="input input-bordered"
                value={formData.clienteEmail}
                onChange={(e) => handleInputChange('clienteEmail', e.target.value)}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Dirección {formData.tipo === 'FACTURA' && '*'}</span>
            </label>
            <input 
              type="text"
              placeholder="Dirección del cliente (escribe '-' si no tiene dirección)"
              className="input input-bordered"
              value={formData.clienteDireccion}
              onChange={(e) => handleInputChange('clienteDireccion', e.target.value)}
              onBlur={(e) => {
                // Si está vacío al perder foco, llenar con "-"
                if (!e.target.value.trim()) {
                  handleInputChange('clienteDireccion', '-')
                }
              }}
            />
            <label className="label">
              <span className="label-text-alt text-warning">
                Si no tiene dirección, se llenará automáticamente con "-"
              </span>
            </label>
          </div>

          <div className="divider">DETALLE DEL SERVICIO</div>

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="w-16">#</th>
                  <th>Descripción *</th>
                  <th className="w-24">Cantidad *</th>
                  <th className="w-32">Precio Unit. *</th>
                  <th className="w-32">Total</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input 
                        type="text"
                        placeholder="Descripción del servicio"
                        className="input input-bordered input-sm w-full"
                        value={item.descripcion}
                        onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number"
                        step="0.01"
                        min="0"
                        className="input input-bordered input-sm w-full"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number"
                        step="0.01"
                        min="0"
                        className="input input-bordered input-sm w-full"
                        value={item.precioUnitario}
                        onChange={(e) => handleItemChange(index, 'precioUnitario', e.target.value)}
                      />
                    </td>
                    <td className="font-bold">
                      S/ {parseFloat(item.total || 0).toFixed(2)}
                    </td>
                    <td>
                      {formData.items.length > 1 && (
                        <button 
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => eliminarItem(index)}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={agregarItem} className="btn btn-outline btn-sm mt-2">
            ➕ Agregar Item
          </button>

          {/* Totales */}
          <div className="flex justify-end mt-6">
            <div className="card bg-base-100 w-full md:w-96">
              <div className="card-body">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>S/ {totales.subtotal}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>IGV (18%):</span>
                  <span>S/ {totales.igv}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between text-2xl font-bold">
                  <span>TOTAL:</span>
                  <span className="text-primary">S/ {totales.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="card-actions justify-end mt-6">
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button 
              onClick={guardarComprobante}
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : '💾 Guardar y Emitir'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Cliente No Encontrado */}
      <Modal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        title="Cliente no encontrado"
        size="sm"
      >
        <p>El cliente no fue encontrado en la base de datos ni en SUNAT/RENIEC.</p>
        <p className="mt-2">Por favor, ingrese los datos manualmente.</p>
        <div className="alert alert-warning mt-4">
          <span>Asegúrese de que el documento ingresado sea correcto.</span>
        </div>
      </Modal>
    </div>
  )
}

export default NuevaFactura
