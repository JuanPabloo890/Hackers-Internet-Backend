# API Hacker's Internet

## Requerimientos para instalar de manera local.
- Visual Estudio Code
- PostgreSQL
- Pgadmin
- Node.js

## Instalacion y dependencias 
Clonar el repositorio con el siguiente comando
```sh
- git clone .... 
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
Una vez creada la base de datos necesitamos pasar esas variables a
