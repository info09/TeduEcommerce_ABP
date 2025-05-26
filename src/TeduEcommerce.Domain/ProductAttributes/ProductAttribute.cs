using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace TeduEcommerce.Attributes;

public class ProductAttribute : CreationAuditedAggregateRoot<Guid>
{
    public string Code { get; set; } = default!;
    public ProductAttributeType DataType { get; set; }
    public string Label { get; set; } = default!;
    public int SortOrder { get; set; }
    public bool Visibility { get; set; }
    public bool IsActive { get; set; }
    public bool IsRequired { get; set; }
    public bool IsUnique { get; set; }
    public string Note { get; set; } = default!;
}
