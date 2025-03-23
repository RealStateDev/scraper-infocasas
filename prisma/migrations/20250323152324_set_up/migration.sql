-- CreateTable
CREATE TABLE "busquedas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "criterio_busqueda" TEXT NOT NULL,
    "fecha_busqueda" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "busquedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "propiedad_id" INTEGER,
    "fecha_agregado" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propiedades" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "zona" VARCHAR(255),
    "dormitorios" INTEGER,
    "banos" INTEGER,
    "tipo_propiedad" VARCHAR(100),
    "estado_propiedad" VARCHAR(50),
    "estado_publicacion" VARCHAR(50),
    "garajes" INTEGER,
    "es_departamento" BOOLEAN,
    "acepta_mascotas" BOOLEAN,
    "m2_edificados" DECIMAL(10,2),
    "tiene_balcon" BOOLEAN,
    "es_casa" BOOLEAN,
    "m2_terreno" DECIMAL(10,2),
    "plantas" INTEGER,
    "tiene_patio" BOOLEAN,
    "ubicacion_descripcion" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "descripcion" TEXT,
    "comodidades" TEXT,
    "url" TEXT,
    "fecha_entrada" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT,

    CONSTRAINT "propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propiedades_scraping" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "zona" VARCHAR(255),
    "dormitorios" INTEGER,
    "banos" INTEGER,
    "tipo_propiedad" VARCHAR(100),
    "estado_propiedad" VARCHAR(50),
    "estado_publicacion" VARCHAR(50),
    "garajes" INTEGER,
    "es_departamento" BOOLEAN,
    "acepta_mascotas" BOOLEAN,
    "m2_edificados" DECIMAL(10,2),
    "tiene_balcon" BOOLEAN,
    "es_casa" BOOLEAN,
    "m2_terreno" DECIMAL(10,2),
    "plantas" INTEGER,
    "tiene_patio" BOOLEAN,
    "ubicacion_descripcion" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "descripcion" TEXT,
    "comodidades" TEXT,
    "url" TEXT,
    "fecha_entrada" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_scraping" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT,

    CONSTRAINT "propiedades_scraping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_progreso" (
    "id" SERIAL NOT NULL,
    "fuente" VARCHAR(255) NOT NULL,
    "ultima_url" TEXT,
    "ultima_fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraping_progreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "tipo_suscripcion" VARCHAR(50) NOT NULL,
    "fecha_inicio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(6),

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "busquedas" ADD CONSTRAINT "busquedas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_propiedad_id_fkey" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
