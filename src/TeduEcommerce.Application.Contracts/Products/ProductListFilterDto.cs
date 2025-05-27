using System;

namespace TeduEcommerce.Products;

public class ProductListFilterDto : BaseListFilterDto
{
    public Guid? CategoryId { get; set; }
}
