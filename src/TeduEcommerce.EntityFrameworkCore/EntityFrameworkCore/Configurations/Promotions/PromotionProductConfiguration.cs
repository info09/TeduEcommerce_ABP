using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeduEcommerce.Promotions;

namespace TeduEcommerce.EntityFrameworkCore.Configurations.Promotions;

public class PromotionProductConfiguration : IEntityTypeConfiguration<PromotionProduct>
{
    public void Configure(EntityTypeBuilder<PromotionProduct> builder)
    {
        builder.ToTable(TeduEcommerceConsts.DbTablePrefix + "PromotionProducts");
        builder.HasKey(x => x.Id);
    }
}
