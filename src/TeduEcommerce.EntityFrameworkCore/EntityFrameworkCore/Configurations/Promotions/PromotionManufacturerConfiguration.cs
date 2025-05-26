using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeduEcommerce.Promotions;

namespace TeduEcommerce.EntityFrameworkCore.Configurations.Promotions;

public class PromotionManufacturerConfiguration : IEntityTypeConfiguration<PromotionManufacturer>
{
    public void Configure(EntityTypeBuilder<PromotionManufacturer> builder)
    {
        builder.ToTable(TeduEcommerceConsts.DbTablePrefix + "PromotionManufacturers");
        builder.HasKey(x => x.Id);
    }
}
