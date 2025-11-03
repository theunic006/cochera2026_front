import React, { useState, useCallback } from 'react';
import { Input, Button, message } from 'antd';
import sunatService from '../../../services/sunatService';
import facturaService from '../services/facturaService';

/**
 * Componente para consultar primero en BD local, luego en SUNAT/RENIEC
 * y llenar campos automáticamente
 * @param {string} rucCliente - Número de RUC o DNI
 * @param {function} setRucCliente - Función para actualizar RUC
 * @param {string} razonSocial - Valor actual de razón social
 * @param {function} setRazonSocial - Función para actualizar razón social
 * @param {string} direccion - Valor actual de dirección
 * @param {function} setDireccion - Función para actualizar dirección
 * @param {function} onEnviarSunat - Función para enviar a SUNAT
 * @param {boolean} enviandoSunat - Estado de carga del envío
 */
const ConsultaSunat = ({ rucCliente, setRucCliente, razonSocial, setRazonSocial, direccion, setDireccion, onEnviarSunat, enviandoSunat }) => {
  const [consultando, setConsultando] = useState(false);

  // ✅ OPTIMIZACIÓN: useCallback - Consultar SUNAT/RENIEC
  const handleConsultar = useCallback(async () => {
    if (!rucCliente) {
      message.warning('Ingrese un número de RUC o DNI');
      return;
    }

    if (rucCliente.length !== 11 && rucCliente.length !== 8) {
      message.warning('Ingrese un RUC válido (11 dígitos) o DNI (8 dígitos)');
      return;
    }

    setConsultando(true);
    message.loading('Buscando cliente...', 0);

    try {
      const esRUC = rucCliente.length === 11;
      
      console.log('🔍 Iniciando búsqueda de cliente:', rucCliente);
      console.log('📋 Tipo detectado:', esRUC ? 'RUC (11 dígitos)' : 'DNI (8 dígitos)');

      // =============================================
      // 1. BUSCAR PRIMERO EN BD LOCAL
      // =============================================
      console.log('🗄️ Paso 1: Buscando en BD local...');
      try {
        const resultadoBD = await facturaService.buscarClientePorDocumento(rucCliente);
        
        if (resultadoBD.success && resultadoBD.data) {
          const cliente = resultadoBD.data;
          console.log('✅ Cliente encontrado en BD local:', cliente);
          
          // Construir nombre completo según los campos disponibles
          let nombreCompleto = '';
          if (cliente.razon_social) {
            nombreCompleto = cliente.razon_social;
          } else if (cliente.nombres) {
            nombreCompleto = `${cliente.nombres || ''} ${cliente.apepaterno || ''} ${cliente.apematerno || ''}`.trim();
          }
          
          // Llenar campos
          setRazonSocial(nombreCompleto);
          setDireccion(cliente.direccion || '-');
          
          message.destroy();
          message.success('✅ Cliente encontrado en base de datos local');
          setConsultando(false);
          return; // ⭐ SALIR aquí si encontró en BD local
        } else {
          console.log('⚠️ Cliente no encontrado en BD local, continuando a API externa...');
        }
      } catch (errBD) {
        console.log('⚠️ Error al buscar en BD local:', errBD.message);
        console.log('🔍 Continuando a API externa...');
      }

      // =============================================
      // 2. SI NO SE ENCUENTRA EN BD, BUSCAR EN API EXTERNA (SUNAT/RENIEC)
      // =============================================
      console.log('🌐 Paso 2: Buscando en API externa...');
      message.destroy();
      message.loading('Consultando ' + (esRUC ? 'SUNAT' : 'RENIEC') + '...', 0);

      let clienteExterno = null;
      let datosParaGuardar = null;

      if (esRUC) {
        // ===== CONSULTAR RUC EN SUNAT =====
        console.log('🔍 Consultando RUC en SUNAT:', rucCliente);
        const resultSunat = await sunatService.consultarRUC(rucCliente);
        
        if (resultSunat.success && resultSunat.data) {
          console.log('✅ RUC encontrado en SUNAT:', resultSunat.data);
          
          clienteExterno = {
            razon_social: resultSunat.data.razon_social || resultSunat.data.razonSocial || '',
            direccion: resultSunat.data.direccion_fiscal || resultSunat.data.direccion || '-',
            email: resultSunat.data.email || ''
          };

          // Preparar datos para guardar en BD
          datosParaGuardar = {
            tipo_documento: 'RUC',
            numero_documento: rucCliente,
            razon_social: clienteExterno.razon_social,
            direccion: clienteExterno.direccion,
            email: clienteExterno.email,
            telefono: resultSunat.data.telefono || null,
            estado: 1
          };
        } else {
          console.log('❌ RUC no encontrado en SUNAT');
          message.destroy();
          message.error('RUC no encontrado en SUNAT');
          setConsultando(false);
          return;
        }
      } else {
        // ===== CONSULTAR DNI EN RENIEC =====
        console.log('🔍 Consultando DNI en RENIEC:', rucCliente);
        const resultReniec = await sunatService.consultarDNI(rucCliente);
        
        if (resultReniec.success && resultReniec.data) {
          console.log('✅ DNI encontrado en RENIEC:', resultReniec.data);
          
          // Construir nombre completo
          const nombreCompleto = resultReniec.data.nombre_completo || 
            `${resultReniec.data.nombres || ''} ${resultReniec.data.apellido_paterno || ''} ${resultReniec.data.apellido_materno || ''}`.trim() ||
            `${resultReniec.data.nombres || ''} ${resultReniec.data.apellidos || ''}`.trim();
          
          clienteExterno = {
            razon_social: nombreCompleto,
            direccion: '-', // DNI no trae dirección
            email: ''
          };

          // Preparar datos para guardar en BD
          datosParaGuardar = {
            tipo_documento: 'DNI',
            numero_documento: rucCliente,
            nombres: resultReniec.data.nombres || '',
            apepaterno: resultReniec.data.apellido_paterno || resultReniec.data.apellidos?.split(' ')[0] || '',
            apematerno: resultReniec.data.apellido_materno || resultReniec.data.apellidos?.split(' ')[1] || '',
            razon_social: nombreCompleto,
            direccion: '-',
            estado: 1
          };
        } else {
          console.log('❌ DNI no encontrado en RENIEC');
          message.destroy();
          message.error('DNI no encontrado en RENIEC');
          setConsultando(false);
          return;
        }
      }

      // =============================================
      // 3. GUARDAR EN BD LOCAL
      // =============================================
      if (clienteExterno && datosParaGuardar) {
        console.log('💾 Paso 3: Guardando cliente en BD local...');
        try {
          await facturaService.guardarCliente(datosParaGuardar);
          console.log('✅ Cliente guardado en BD local');
        } catch (errGuardar) {
          console.warn('⚠️ No se pudo guardar en BD local:', errGuardar.message);
          // No bloqueamos el flujo si falla el guardado
        }

        // Llenar campos en el formulario
        setRazonSocial(clienteExterno.razon_social);
        setDireccion(clienteExterno.direccion);
        
        message.destroy();
        message.success('✅ Datos obtenidos de ' + (esRUC ? 'SUNAT' : 'RENIEC') + ' y guardados en BD');
      }

    } catch (error) {
      console.error('❌ Error al consultar:', error);
      message.destroy();
      message.error('Error al consultar: ' + (error.message || 'Error desconocido'));
    } finally {
      setConsultando(false);
    }
  }, [rucCliente, setRazonSocial, setDireccion]);

  return (
    <div style={{ marginBottom: 16, padding: 16, background: '#272727ff', borderRadius: 8 }}>
      {/* Input RUC */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Ingrese num. RUC (11 dígitos)"
            value={rucCliente}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setRucCliente(value);
            }}
          />
          <Button
            type="primary"
            size="large"
            loading={consultando}
            onClick={handleConsultar}
            style={{ 
              background: '#1890ff', 
              borderColor: '#1890ff',
              minWidth: 120
            }}
          >
            Consultar
          </Button>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Input
          placeholder="Razón Social"
          value={razonSocial}
          onChange={(e) => setRazonSocial(e.target.value)}
          size="large"
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          size="large"
        />
      </div>
      
      {/* Botón Enviar SUNAT */}
      {onEnviarSunat && (
        <div>
          <Button
            type="primary"
            size="large"
            block
            loading={enviandoSunat}
            onClick={onEnviarSunat}
            icon={<span>📤</span>}
            style={{ 
              background: '#52c41a', 
              borderColor: '#52c41a',
              fontWeight: 600
            }}
          >
            Enviar a SUNAT
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConsultaSunat;
