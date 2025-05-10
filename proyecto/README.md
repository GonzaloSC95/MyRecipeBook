# 📘 MyRecipeBook – Recetario Personal Digital

MyRecipeBook es una aplicación web que permite a cada usuario gestionar su propio recetario de cocina de forma privada, segura y personalizada. Desarrollada como proyecto académico, esta herramienta integra conocimientos de backend con Spring Boot y frontend con Angular, además de conceptos de diseño UI, bases de datos y despliegue local.

## 🔧 Tecnologías utilizadas

- **Lenguaje Backend:** Java 21
- **Framework Backend:** Spring Boot 3.4.4
- **Base de datos:** MySQL
- **Lenguaje Frontend:** Angular 19, HTML5, CSS3
- **Framework Frontend:** Bootstrap 5
- **IDE:** Visual Studio Code
- **Control de versiones:** Git + GitHub
- **Gestor de dependencias:** Maven
- **Servidor:** Local (localhost)

## 🚀 Pasos para levantar el proyecto en LOCAL

```bash
git clone https://github.com/GonzaloSC95/MyRecipeBook.git
cd MyRecipeBook\Proyecto
1. Configurar y ejecutar el backend
a. Abrir Visual Studio Code y entrar a la carpeta:

my-recipe-book-backend/
b. Configurar la base de datos en src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/recipe_db
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
spring.jpa.hibernate.ddl-auto=update

c. Ejecutar el backend con Maven:
Si tenés Maven global:
mvn spring-boot:run
O con wrapper incluido:

./mvnw spring-boot:run
La API estará activa en: http://localhost:8080

3. Ejecutar el frontend

a. En una nueva terminal, moverse a:
my-recipe-book-frontend/

b. Instalar las dependencias:
npm install

c. Levantar el servidor de desarrollo Angular:
ng serve
El frontend estará activo en: http://localhost:4200

```
