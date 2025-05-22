import { TransactionType, PropertyType, CityList, DepartamentoList} from "./generalTypes";

export class ScrapigUrl {
  type: TransactionType;
  city: CityList;
  departamento: DepartamentoList;
  propertyType: PropertyType;

  constructor(type: TransactionType,city: CityList, departamento:DepartamentoList, propertyType: PropertyType) {
    this.type = type;
    this.city = city;
    this.departamento = departamento;
    this.propertyType = propertyType;
  }


  get getUrl() {
    if (this.city == 'asuncion') 
    {
      return  `https://www.infocasas.com.py/${this.type}/${this.propertyType}/${this.city}?&ordenListado=3`;
    }
    else 
    {
      return  `https://www.infocasas.com.py/${this.type}/${this.propertyType}/${this.departamento}/${this.city}?&ordenListado=3` 
    }
  }
}

//https://www.infocasas.com.py/venta/casas/central/luque?&ordenListado=3
//https://www.infocasas.com.py/venta/casas/luque/pagina5?&ordenListado=3
//https://www.infocasas.com.py/venta/casas/central/luque/pagina2?&ordenListado=3
//https://www.infocasas.com.py/venta/casas/central/san-lorenzo/pagina2?&ordenListado=3