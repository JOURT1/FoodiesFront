# FoodiesBNB Platform

Una plataforma web para conectar foodies con restaurantes locales, desarrollada con Angular y Node.js.

## 🚀 Características

- **Sistema de autenticación** - Registro e inicio de sesión de usuarios
- **Dashboard interactivo** - Exploración de restaurantes
- **Formulario de aplicación para Foodies** - Proceso de registro para creadores de contenido
- **Panel de administración de restaurantes** - Gestión de establecimientos
- **Diseño responsivo** - Optimizado para dispositivos móviles y desktop

## 🛠️ Tecnologías

### Frontend
- **Angular 17+** - Framework principal
- **TypeScript** - Lenguaje de programación
- **CSS3** - Estilos y diseño responsivo
- **Angular Reactive Forms** - Manejo de formularios

### Backend
- **Node.js** - Servidor backend
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- MongoDB

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

### Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

## 🏗️ Estructura del Proyecto

```
FoodiesBNB/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── foodie-application/
│   │   │   └── sidebar/
│   │   ├── services/
│   │   ├── guards/
│   │   └── validators/
│   └── assets/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
└── package.json
```

## 🚀 Funcionalidades

### Para Usuarios
- Registro y autenticación
- Exploración de restaurantes
- Filtros por ubicación y tipo de cocina
- Sistema de favoritos

### Para Foodies
- Formulario de aplicación especializado
- Validación de redes sociales
- Subida de archivos (screenshots, fotos)
- Verificación de requisitos

### Para Restaurantes
- Panel de gestión
- Registro de establecimientos
- Administración de información

## 🔧 Configuración

### Variables de Entorno
Crear un archivo `.env` en el directorio backend:

```env
MONGODB_URI=mongodb://localhost:27017/foodiesbnb
JWT_SECRET=tu_secret_key
PORT=3000
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **JOURT1** - *Desarrollo inicial* - [JOURT1](https://github.com/JOURT1)

## 🎯 Roadmap

- [ ] Integración con APIs de redes sociales
- [ ] Sistema de notificaciones
- [ ] Panel de analytics
- [ ] App móvil
- [ ] Sistema de reviews
- [ ] Integración con servicios de pago

---

⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil!
