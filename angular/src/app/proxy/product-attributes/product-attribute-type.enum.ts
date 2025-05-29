import { mapEnumToOptions } from '@abp/ng.core';

export enum ProductAttributeType {
  Date = 1,
  Varchar = 2,
  Text = 3,
  Int = 4,
  Decimal = 5,
}

export const productAttributeTypeOptions = mapEnumToOptions(ProductAttributeType);
