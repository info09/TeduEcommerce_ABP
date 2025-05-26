using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeduEcommerce.Promotions;

namespace TeduEcommerce.EntityFrameworkCore.Configurations.Promotions;

public class PromotionUsageHistoryConfiguration : IEntityTypeConfiguration<PromotionUsageHistory>
{
    public void Configure(EntityTypeBuilder<PromotionUsageHistory> builder)
    {
        builder.ToTable(TeduEcommerceConsts.DbTablePrefix + "PromotionUsageHistories");
        builder.HasKey(x => x.Id);
    }
}
