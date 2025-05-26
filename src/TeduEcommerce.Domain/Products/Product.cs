using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace TeduEcommerce.Products;

public class Product : AuditedAggregateRoot<Guid>
{
    public Guid ManufacturerId { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public ProductType ProductType { get; set; }
    public string SKU { get; set; } = default!;
    public int SortOrder { get; set; }
    public bool Visiblity { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
    public string SeoMetaDescription { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string ThumbnailPicture { get; set; } = default!;
}