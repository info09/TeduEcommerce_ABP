using System;
using Volo.Abp.Domain.Entities;

namespace TeduEcommerce.InventoryTickets;

public class InventoryTicketItem : Entity<Guid>
{
    public Guid TicketId { get; set; }
    public Guid ProductId { get; set; }
    public string SKU { get; set; } = default!;
    public int Quantity { get; set; }
    public string BatchNumber { get; set; } = default!;
    public DateTime? ExpiredDate { get; set; }
}
