import { TransactionType, PropertyType, CityList } from "./generalTypes";

export class ScrapigUrl {
  type: TransactionType;
  city: CityList;
  propertyType: PropertyType;

  constructor(type: TransactionType,city: CityList, propertyType: PropertyType) {
    this.type = type;
    this.city = city;
    this.propertyType = propertyType;
  }


  get getUrl() {
   return  `https://www.infocasas.com.py/${this.type}/${this.propertyType}/${this.city}`;
  }
}

