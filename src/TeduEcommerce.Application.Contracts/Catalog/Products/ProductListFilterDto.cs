using System;

namespace TeduEcommerce.Catalog.Products;

public class ProductListFilterDto : BaseListFilterDto
{
    public Guid? CategoryId { get; set; }
}
