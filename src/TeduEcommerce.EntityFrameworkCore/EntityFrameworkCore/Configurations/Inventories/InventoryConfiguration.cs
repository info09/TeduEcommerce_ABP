using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeduEcommerce.Inventories;

namespace TeduEcommerce.EntityFrameworkCore.Configurations.Inventories;

public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
{
    public void Configure(EntityTypeBuilder<Inventory> builder)
    {
        builder.ToTable(TeduEcommerceConsts.DbTablePrefix + "Inventories");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.SKU).HasMaxLength(50).IsUnicode(false).IsRequired();
        builder.Property(i => i.StockQuantity).IsRequired();
    }
}
