using System;
using Volo.Abp.Domain.Entities;

namespace TeduEcommerce.Products;

public class ProductTag : Entity
{
    public Guid ProductId { get; set; }
    public string TagId { get; set; } = default!;

    public override object[] GetKeys()
    {
        return new object[] { ProductId, TagId };
    }
}