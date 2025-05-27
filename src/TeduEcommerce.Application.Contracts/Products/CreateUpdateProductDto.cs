using System;

namespace TeduEcommerce.Products;

public class CreateUpdateProductDto
{
    public Guid ManufacturerId { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public ProductType ProductType { get; set; }
    public string SKU { get; set; } = default!;
    public int SortOrder { get; set; }
    public bool Visibility { get; set; }
    public bool IsActive { get; set; }
    public double SellPrice { get; set; }
    public Guid CategoryId { get; set; }
    public string SeoMetaDescription { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string ThumbnailPicture { get; set; } = default!;
}
