using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace TeduEcommerce.Manufacturers;

public class Manufacturer : CreationAuditedAggregateRoot<Guid>
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string CoverPicture { get; set; } = default!;
    public bool Visibility { get; set; }
    public bool IsActive { get; set; }
    public string Country { get; set; } = default!;
}
