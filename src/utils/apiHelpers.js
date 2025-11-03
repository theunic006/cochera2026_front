// Función para manejar errores de API y devolver un formato estándar
export function handleApiError(error) {
  return {
    success: false,
    message: error?.response?.data?.message || error.message || 'Error desconocido',
    status: error?.response?.status || null,
    data: null
  };
}

// Función para normalizar respuestas con paginación
export function normalizePaginationResponse(response, page = 1, perPage = 15) {
  const rolesData = response.data?.data || response.data;
  
  return {
    success: true,
    data: rolesData,
    pagination: response.data?.pagination || {
      current_page: page,
      per_page: perPage,
      total: response.data?.total || rolesData?.length || 0
    }
  };
}
