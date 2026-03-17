# Sistema de Gestión de Mesas de Restaurante v2.0

Un sistema completo para la gestión de mesas de restaurante con funcionalidades avanzadas de asignación, reservas y estadísticas.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **📊 Panel de Estadísticas en Tiempo Real**
  - Contadores de mesas disponibles, ocupadas y reservadas
  - Visualización clara del estado general del restaurante

- **🎯 Asignación Inteligente de Mesas**
  - Formulario para ingresar número de personas antes de asignar
  - Validación automática de capacidad
  - Registro de nombre del cliente y observaciones

- **🤖 Sugerencia Automática de Mesas**
  - Sistema inteligente que recomienda las mejores mesas disponibles
  - Tres modos de búsqueda: capacidad exacta, superior o más cercana
  - Filtrado por número de personas

- **📅 Sistema de Reservas**
  - Creación de reservas con fecha y hora
  - Asignación automática de mesa preferida o alternativa
  - Gestión completa de clientes y grupos

- **🔍 Filtros y Búsqueda Avanzada**
  - Filtrado por estado (disponible/ocupada/reservada)
  - Filtrado por capacidad de mesa
  - Búsqueda por número de mesa

- **📱 Diseño Responsivo y Moderno**
  - Interfaz elegante con animaciones suaves
  - Totalmente adaptable a dispositivos móviles
  - Gradientes modernos y efectos visuales

- **ℹ️ Gestión Detallada de Mesas**
  - Información completa de cada mesa
  - Historial de clientes y tiempos
  - Observaciones personalizadas

## 🛠️ Instalación

### Requisitos Previos
- PHP 7.4 o superior
- MySQL/MariaDB
- Servidor web (Apache/Nginx)
- XAMPP (para desarrollo local)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <repositorio>
   cd restaurante-app
   ```

2. **Configurar la base de datos**
   - Importa el archivo `database.sql` en tu servidor MySQL
   - O ejecuta manualmente las consultas SQL proporcionadas

3. **Configurar la conexión**
   - Revisa el archivo `backend/conexion.php`
   - Ajusta las credenciales de tu base de datos

4. **Configurar el servidor web**
   - Asegúrate de que el directorio sea accesible vía web
   - Configura el document root si es necesario

5. **Acceder a la aplicación**
   - Abre tu navegador y visita `http://localhost/restaurante-app`

## 📁 Estructura del Proyecto

```
restaurante-app/
├── backend/
│   ├── conexion.php          # Conexión a la base de datos
│   └── api.php              # API REST para operaciones
├── css/
│   └── styles.css           # Estilos personalizados
├── js/
│   └── script.js            # Funcionalidades JavaScript
├── database.sql            # Estructura de la base de datos
├── index.php               # Página principal
└── README.md               # Este archivo
```

## 🎯 Uso del Sistema

### Asignar una Mesa
1. Haz clic en "Asignar Mesa" en una mesa disponible
2. Ingresa el nombre del cliente
3. Especifica el número de personas
4. Agrega observaciones si es necesario
5. Confirma la asignación

### Usar Sugerencia Inteligente
1. Haz clic en "Sugerir Mesa" en el menú superior
2. Ingresa el número de personas
3. Selecciona tu preferencia de capacidad
4. Revisa las mesas recomendadas
5. Selecciona la mesa deseada

### Crear una Reserva
1. Haz clic en "Nueva Reserva" en el menú superior
2. Completa los datos del cliente
3. Especifica fecha y hora
4. Elige una mesa preferida (opcional)
5. Confirma la reserva

### Filtrar Mesas
- Usa los filtros en la parte superior para buscar por estado, capacidad o número de mesa
- Los filtros se aplican instantáneamente

## 🗄️ Estructura de la Base de Datos

### Tabla: mesas
- `id` - Identificador único
- `numero_mesa` - Número de la mesa
- `capacidad` - Capacidad de personas
- `estado` - Estado actual (disponible/ocupada/reservada/mantenimiento)
- `cliente_nombre` - Nombre del cliente actual
- `cliente_cantidad` - Número de personas en la mesa
- `hora_entrada` - Hora de llegada del cliente
- `hora_salida` - Hora de salida del cliente
- `fecha_reserva` - Fecha de reserva (si aplica)
- `observaciones` - Notas adicionales
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

## 🔧 Personalización

### Agregar Nuevas Capacidades de Mesa
Modifica las opciones en el filtro de capacidad en `index.php`:
```html
<option value="10">10 personas</option>
```

### Personalizar Colores
Edita las clases CSS en `css/styles.css`:
```css
.border-success { border-color: #28a745 !important; }
.border-danger { border-color: #dc3545 !important; }
```

### Modificar Estados
Actualiza los estados en la base de datos y en la lógica del sistema.

## 🚀 Mejoras Futuras

- [ ] Panel de administración para gestión de mesas
- [ ] Sistema de reportes y estadísticas avanzadas
- [ ] Integración con sistemas de pago
- [ ] Notificaciones automáticas
- [ ] Aplicación móvil nativa
- [ ] Multi-usuario con roles y permisos
- [ ] Integración con redes sociales

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
1. Revisa los requisitos del sistema
2. Verifica la configuración de la base de datos
3. Consulta los logs de errores del servidor
4. Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

**Desarrollado con ❤️ para restaurantes modernos**
