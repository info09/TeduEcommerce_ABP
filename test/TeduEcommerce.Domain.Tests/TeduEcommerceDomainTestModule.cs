using Volo.Abp.Modularity;

namespace TeduEcommerce;

[DependsOn(
    typeof(TeduEcommerceDomainModule),
    typeof(TeduEcommerceTestBaseModule)
)]
public class TeduEcommerceDomainTestModule : AbpModule
{

}
