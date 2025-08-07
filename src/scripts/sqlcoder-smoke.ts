import { generateSql } from "../services/sqlcoderRunner.service";

(async () => {
  const sql = await generateSql({
    transaction: "alquiler",
    property_type: "departamentos",
    city: "asuncion",
    price_min: 2000000,
    price_max: 5000000,
  });
  console.log(sql);
})();
