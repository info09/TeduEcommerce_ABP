using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace TeduEcommerce.Orders;

public class Order : FullAuditedAggregateRoot<Guid>
{
    public string Code { get; set; } = default!;
    public OrderStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public double ShippingFee { get; set; }
    public double Tax { get; set; }
    public double Total { get; set; }
    public double Subtotal { get; set; }
    public double Discount { get; set; }
    public double GrandTotal { get; set; }
    public string CustomerName { get; set; } = default!;
    public string CustomerPhoneNumber { get; set; } = default!;
    public string CustomerAddress { get; set; } = default!;
    public string CustomerEmail { get; set; } = default!;
    public Guid? CustomerUserId { get; set; }
}
