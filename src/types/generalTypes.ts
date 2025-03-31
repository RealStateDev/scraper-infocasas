export interface PropertyData {
    es_casa: boolean;
    es_departamento: boolean;
    titulo: string;
    precio: number;
    zona?: string;
    dormitorios?: number;
    banos?: number;
    tipo_propiedad?: string;
    estado_propiedad?: string;
    garajes?: number;
    m2_edificados?: number;
    m2_terreno?: number;
    plantas?: number;
    descripcion?: string;
    latitud?: number;
    longitud?: number;
    url?: string;
    comodidades?: string;
    currency?: string;
    ciudad: string;
  }

export interface SearchParams {
  tranType: TransactionType;
  propType: PropertyType;
  city: CityList;
}

export type TransactionType = "venta" | "alquiler";

export type PropertyType =
  | "casas"
  | "departamentos"
  | "terrenos"
  | "locales-comerciales"
  | "oficinas"
  | "chacras-o-campos"
  | "duplex"
  | "edificios-u-hoteles";

export type CityList =
  | "asuncion"
  | "pedro-juan-caballero"
  | "capiata"
  | "san-lorenzo"
  | "nemby"
  | "lambare"
  | "luque"
  | "ciudad-del-este"
  | "concepcion"
  | "encarnacion"
  | "aregua"
  | "caacupe"
  | "villarrica"
  | "villa-hayes"
  | "coronel-oviedo"
  | "mariano-roque-alonso"
  | "limpio"
  | "ita"
  | "san-bernardino";