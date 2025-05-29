import type { BaseListFilterDto } from '../../models';
import type { ProductAttributeType } from '../../product-attributes/product-attribute-type.enum';

export interface AddUpdateProductAttributeDto {
  productId?: string;
  attributeId?: string;
  dateTimeValue?: string;
  decimalValue?: number;
  intValue?: number;
  varcharValue?: string;
  textValue?: string;
}

export interface ProductAttributeListFilterDto extends BaseListFilterDto {
  productId?: string;
}

export interface ProductAttributeValueDto {
  id?: string;
  productId?: string;
  attributeId?: string;
  code?: string;
  dataType: ProductAttributeType;
  label?: string;
  dateTimeValue?: string;
  decimalValue?: number;
  intValue?: number;
  textValue?: string;
  varcharValue?: string;
  dateTimeId?: string;
  decimalId?: string;
  intId?: string;
  textId?: string;
  varcharId?: string;
}
