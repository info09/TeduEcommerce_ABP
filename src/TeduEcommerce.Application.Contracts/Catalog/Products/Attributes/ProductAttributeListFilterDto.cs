using System;

namespace TeduEcommerce.Catalog.Products.Attributes;

public class ProductAttributeListFilterDto : BaseListFilterDto
{
    public Guid ProductId { get; set; }
}
