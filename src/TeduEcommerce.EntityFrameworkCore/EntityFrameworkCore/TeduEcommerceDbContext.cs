using Microsoft.EntityFrameworkCore;
using TeduEcommerce.EntityFrameworkCore.Configurations.Inventories;
using TeduEcommerce.EntityFrameworkCore.Configurations.InventoryTickets;
using TeduEcommerce.EntityFrameworkCore.Configurations.Manufacturers;
using TeduEcommerce.EntityFrameworkCore.Configurations.Orders;
using TeduEcommerce.EntityFrameworkCore.Configurations.ProductAttributes;
using TeduEcommerce.EntityFrameworkCore.Configurations.ProductCategories;
using TeduEcommerce.EntityFrameworkCore.Configurations.Products;
using TeduEcommerce.EntityFrameworkCore.Configurations.Promotions;
using TeduEcommerce.Inventories;
using TeduEcommerce.InventoryTickets;
using TeduEcommerce.Manufacturers;
using TeduEcommerce.Orders;
using TeduEcommerce.ProductAttributes;
using TeduEcommerce.ProductCategories;
using TeduEcommerce.Products;
using TeduEcommerce.Promotions;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace TeduEcommerce.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class TeduEcommerceDbContext :
    AbpDbContext<TeduEcommerceDbContext>,
    ITenantManagementDbContext,
    IIdentityDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */


    #region Entities from the modules

    /* Notice: We only implemented IIdentityProDbContext and ISaasDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityProDbContext and ISaasDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    // Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    //Ecommerce
    public DbSet<ProductAttribute> ProductAttributes { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<InventoryTicket> InventoryTickets { get; set; }
    public DbSet<InventoryTicketItem> InventoryTicketItems { get; set; }
    public DbSet<Manufacturer> Manufacturers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderTransaction> OrderTransactions { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductAttributeDateTime> ProductAttributeDateTimes { get; set; }
    public DbSet<ProductAttributeDecimal> ProductAttributeDecimals { get; set; }
    public DbSet<ProductAttributeInt> ProductAttributeInts { get; set; }
    public DbSet<ProductAttributeVarchar> ProductAttributeVarchars { get; set; }
    public DbSet<ProductAttributeText> ProductAttributeTexts { get; set; }
    public DbSet<ProductLink> ProductLinks { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<ProductTag> ProductTags { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<PromotionCategory> PromotionCategories { get; set; }
    public DbSet<PromotionManufacturer> PromotionManufacturers { get; set; }
    public DbSet<PromotionProduct> PromotionProducts { get; set; }
    public DbSet<PromotionUsageHistory> PromotionUsageHistories { get; set; }

    #endregion

    public TeduEcommerceDbContext(DbContextOptions<TeduEcommerceDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureBlobStoring();

        //Ecommerce
        builder.ApplyConfiguration(new ProductAttributeConfiguration());

        builder.ApplyConfiguration(new InventoryConfiguration());

        builder.ApplyConfiguration(new InventoryTicketConfiguration());
        builder.ApplyConfiguration(new InventoryTicketItemConfiguration());

        builder.ApplyConfiguration(new ManufacturerConfiguration());

        builder.ApplyConfiguration(new OrderConfiguration());
        builder.ApplyConfiguration(new OrderItemConfiguration());
        builder.ApplyConfiguration(new OrderTransactionConfiguration());

        builder.ApplyConfiguration(new ProductCategoryConfiguration());

        builder.ApplyConfiguration(new ProductConfiguration());
        builder.ApplyConfiguration(new ProductLinkConfiguration());
        builder.ApplyConfiguration(new ProductReviewConfiguration());
        builder.ApplyConfiguration(new ProductTagConfiguration());
        builder.ApplyConfiguration(new TagConfiguration());
        builder.ApplyConfiguration(new ProductAttributeDateTimeConfiguration());
        builder.ApplyConfiguration(new ProductAttributeDecimalConfiguration());
        builder.ApplyConfiguration(new ProductAttributeIntConfiguration());
        builder.ApplyConfiguration(new ProductAttributeTextConfiguration());
        builder.ApplyConfiguration(new ProductAttributeVarcharConfiguration());

        builder.ApplyConfiguration(new PromotionConfiguration());
        builder.ApplyConfiguration(new PromotionCategoryConfiguration());
        builder.ApplyConfiguration(new PromotionManufacturerConfiguration());
        builder.ApplyConfiguration(new PromotionProductConfiguration());
        builder.ApplyConfiguration(new PromotionUsageHistoryConfiguration());


        /* Configure your own tables/entities inside here */

        //builder.Entity<YourEntity>(b =>
        //{
        //    b.ToTable(TeduEcommerceConsts.DbTablePrefix + "YourEntities", TeduEcommerceConsts.DbSchema);
        //    b.ConfigureByConvention(); //auto configure for the base class props
        //    //...
        //});
    }
}
