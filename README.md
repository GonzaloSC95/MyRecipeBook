### **MyRecipeBook – Recetario Personal Digital**

- MyRecipeBook es una aplicación web diseñada para gestionar recetas culinarias de manera intuitiva y segura. Permite a los usuarios crear, editar, eliminar y consultar sus recetas personales en un entorno privado.

### **Objetivos específicos**

- Implementar un sistema de autenticación y autorización que permita a cada usuario acceder a un espacio privado.
- Crear una interfaz sencilla, intuitiva y adaptable para que el usuario pueda gestionar sus recetas sin dificultad.
- Permitir el registro completo de recetas con sus respectivos ingredientes, instrucciones, imágenes y categorías personalizadas.
- Diseñar una arquitectura modular que facilite futuras ampliaciones como filtros, favoritos, o generación de listas de compras.

### **Descripción del funcionamiento**

- La aplicación se inicia en una pantalla de login. Si el usuario no tiene cuenta, puede registrarse fácilmente. Una vez autenticado, accede a un panel privado donde puede gestionar todas sus recetas.

- Desde el panel privado, el usuario podrá:

  - Crear nuevas recetas completando un formulario estructurado con título, ingredientes, pasos, imagen opcional, tiempo de cocción y categoría.
  - Ver todas sus recetas en forma de tarjetas organizadas por categorías personalizadas.
  - Editar o eliminar recetas ya registradas.
  - Subir imágenes propias asociadas a cada receta.
  - Consultar sus recetas por medio de un buscador interno.

## **Asignaturas del ciclo involucradas**

| **Clave** | **Asignatura**                             | **Aplicación en el proyecto**                                                         |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| 01        | Bases de datos                             | Diseño de entidades como usuario, receta, ingrediente, categoría. Uso de MySQL.       |
| 02        | Entornos de desarrollo                     | Configuración y gestión de Spring Boot, Angular, Git, y herramientas complementarias. |
| 05        | Programación                               | Lógica de negocio en Java: estructuras de control y validaciones..                    |
| 06        | Sistemas informáticos                      | Configuración del entorno local y simulación de despliegue en servidor.               |
| 07        | Desarrollo web en entorno cliente          | Construcción del frontend con Angular: componentes, formularios, servicios, rutas.    |
| 08        | Desarrollo web en entorno servidor         | Desarrollo de la API RESTful con Spring Boot.                                         |
| 10        | Diseño de interfaces web                   | Interfaz clara y accesible, con estructura moderna, adaptable y fácil de navegar.     |
| 11        | Empresa e iniciativa emprendedora          | Enfoque del proyecto como solución digital útil para personas con hábitos de cocina.  |
| 13        | Proyecto de desarrollo de aplicaciones web | Desarrollo integral del proyecto en aproximadamente 40 horas.                         |

## **Tecnologías y herramientas**

| **Categoría**     | **Herramientas y tecnologías**                |
| ----------------- | --------------------------------------------- |
| Lenguaje backend  | Java 17                                       |
| Framework backend | Spring Boot                                   |
| Base de datos     | MySQL                                         |
| Frontend          | Angular 16, HTML5, CSS3, Bootstrap 5          |
| IDE               | NetBeans (Java), Visual Studio Code (Angular) |

| Control de versiones     | Git + GitHub                                                  |
| ------------------------ | ------------------------------------------------------------- |
| Gestor de dependencias   | Maven                                                         |
| Herramientas adicionales | Postman (testeo de API), Canva (diseño de interfaces, iconos) |

## **Apartados a implementar (funcionalidades)**

### **Módulo de autenticación**

- Registro de usuario con validaciones básicas.
- Inicio de sesión seguro con control de acceso.
- Autenticación mediante tokens (JWT).

### **Gestión de recetas**

- Creación de recetas con nombre, categoría, ingredientes, pasos, imágenes y notas personales.
- Edición de recetas ya registradas.
- Eliminación segura de recetas.
- Visualización de recetas en tarjetas personalizadas con imagen, resumen y acceso al detalle.

### **Organización y clasificación**

- Posibilidad de organizar las recetas por categorías definidas por el propio usuario (ejemplo: postres, comidas rápidas, veganas).
- Filtro por categorías.

### **Interfaz de usuario**

- Interfaz moderna, clara y funcional.
- Navegación fluida con menú lateral y formularios intuitivos.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales: **backend** y **frontend**.

### Backend

El backend está construido con **Spring Boot** y utiliza **MySQL** como base de datos. Las principales características incluyen:

- **API REST** para gestionar recetas.
- Autenticación de usuarios mediante JWT.
- Inicialización de la base de datos con datos de ejemplo.

#### Estructura de Directorios

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── myrecipebook/
│   │   │           ├── controller/
│   │   │           ├── model/
│   │   │           ├── repository/
│   │   │           ├── service/
│   │   │           └── MyRecipeBookApplication.java
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   └── data.sql
│   │   └── webapp/
│   │       └── WEB-INF/
│   │           └── web.xml
├── pom.xml
└── README.md
```

### Frontend

El frontend está desarrollado con **Angular** y utiliza **Bootstrap 5** para el diseño. Las características incluyen:

- Interfaz de usuario responsiva y accesible.
- Gestión de recetas a través de componentes Angular.
- Integración con la API del backend.

#### Estructura de Directorios

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Instalación

Para ejecutar el proyecto, sigue estos pasos:

1. **Clona el repositorio:**

   ```
   git clone <URL del repositorio>
   ```

2. **Configura el backend:**

   - Navega al directorio `backend`.
   - Modifica el archivo `application.properties` para configurar la conexión a la base de datos.
   - Ejecuta el proyecto con Maven:
     ```
     mvn spring-boot:run
     ```

3. **Configura el frontend:**
   - Navega al directorio `frontend`.
   - Instala las dependencias:
     ```
     npm install
     ```
   - Ejecuta el proyecto:
     ```
     ng serve
     ```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE.
