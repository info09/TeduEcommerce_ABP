using System;
using Volo.Abp.Application.Dtos;

namespace TeduEcommerce.Catalog.ProductCategories;

public class ProductCategoryDto : IEntityDto<Guid>
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public int SortOrder { get; set; }
    public string CoverPicture { get; set; } = default!;
    public bool Visibility { get; set; }
    public bool IsActive { get; set; }
    public Guid? ParentId { get; set; }
    public string SeoMetaDescription { get; set; } = default!;
    public Guid Id { get; set; }
}
