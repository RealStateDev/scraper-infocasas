export interface PropertySearchSlots {
  transaction: "venta" | "alquiler";
  property_type:
    | "casas"
    | "departamentos"
    | "terrenos"
    | "locales-comerciales"
    | "oficinas"
    | "chacras-o-campos"
    | "duplex"
    | "edificios-u-hoteles";
  city: string;
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
}
