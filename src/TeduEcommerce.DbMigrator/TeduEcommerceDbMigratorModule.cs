using TeduEcommerce.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace TeduEcommerce.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(TeduEcommerceEntityFrameworkCoreModule),
    typeof(TeduEcommerceApplicationContractsModule)
)]
public class TeduEcommerceDbMigratorModule : AbpModule
{
}
