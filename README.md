# API Hacker's Internet

## Requerimientos para instalar de manera local.
- Visual Estudio Code
- PostgreSQL
- Pgadmin
- Node.js

## Instalacion y dependencias 
Clonar el repositorio con el siguiente comando
```sh
- git clone https://github.com/JuanPabloo890/tesis.git 
```

Para instalar todas las dependencias utilizar el comando
```sh
- npm i 
```
Teniendo todas las dependencias instaladasdas necesitamos realizar una configuracion mas.

## Se necesita crear un archivo .env con los siguientes parametros
Las primeras son las credencials de la base de datos, las que dicen email se necesita el usuario de la cuenta en donde se mandaran los correos y la contraseña de la aplicacion.
En la cuenta de Gmail necesitamos tener la verificación en 2 pasos para poder usar la contraseña de aplicaión.

```sh
- DB_USER="tus credenciasles"
- DB_HOST="tus credenciasles"
- DB_NAME="tus credenciasles"
- DB_PASSWORD="tus credenciasles"
- DB_PORT="tus credenciasles"
- DB_SSL="tus credenciasles"

- EMAIL_USER="tus credenciasles"
- EMAIL_PASS="tus credenciasles" 
```

## Manera Local y en la nube
### Para realizarlo de manera local se requiere lo siguiente.
En Postgresql vamos a crear una base de datos y vamos a copiar los parametros de la base de datos creada como: user, host, DB name, password, puerto.

### Para realizarlo de en la nube se requiere lo siguiente.
Tener una cuenta en render y crear una base de datos de PostgreSQL desde render 
Una vez creada la base de datos necesitamos pasar esas variables a la aplicación de PostgreSQL.

## Uso 
Teniendo todas las configuraciones realizadas para correr la api neceistamos colocar el siguiente comando.
```sh
- npm run dev
```
### Swagger
Para realizar pruebas locales se pude usar el enlace de Swagger que localmente esta en el puerto http://localhost:3000/api-docs.
Pero tambien se puede realizar desde el enlace de render junto con swagger https://tesis-kphi.onrender.com/api-docs.
En este se selecciona si se quiere de manera local realizar una peticion o en la nube.

### Base de datos
Se necesita crear la base de datos con parametros quemados de parte del administrador 

```sh
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO Administrador (correo, nombre, telefono, password)
VALUES ('ejemplo@gmail.com', 'Nombre Apellido', '0911111111', crypt('contraadmin123', gen_salt('bf')));
```
