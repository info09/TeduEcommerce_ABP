using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace TeduEcommerce.Inventories;

public class Inventory : AuditedAggregateRoot<Guid>
{
    public Guid ProductId { get; set; }
    public string SKU { get; set; } = default!;
    public int StockQuantity { get; set; }
}
