using System;

namespace TeduEcommerce.Products.Attributes;

public class ProductAttributeListFilterDto : BaseListFilterDto
{
    public Guid ProductId { get; set; }
}
