# scraper-infocasas
 
### Comandos
#### Express: 
> Una vez clonado el repositorio se deben instalar las dependecias.

> Ejecutar comando:
* npm install

#### Prisma:  
> Crea el archivo .env con la DATABASE_URL DATABASE_URL="postgresql://<tu usuario>:<tu contraseña>@localhost:5432/<tu nombre de la bd>?schema=public"

> Ejecutar para probar la conexion: 
* npx prisma studio

> Comando Util: Sicronizar tablas sin borrar(cada vez que se haga un cambio en la bd se debe de correr este comando)
* npx prisma db push

*Si se abre el prisma estudio, la conexion con la base de datos fue exitosa.*

#### Iniciar el Servidor Express.js local:   
* npx ts-node src/server.ts

#### Probar la api:   
> Ejecutar en Postman:
* GET http://localhost:5000/api/scraping/start?start=2&end=2 
* Estructura del  Body: Para ver los valores que deben tener Json,vea el tipo SearchParams en generalTypes.tsx
 <
   {
    "tranType": "venta" ,
    "propType": "duplex" ,
    "city": "luque" 
   }
 >
  

Cuando se modifica el esquema ejecutar:

Luego correr comandos :
1- npx prisma migrate dev --name add_chat_and_messages

2-npx prisma db push

3-npx prisma generate (editado)





