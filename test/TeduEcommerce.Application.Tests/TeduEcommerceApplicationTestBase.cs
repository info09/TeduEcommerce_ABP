using Volo.Abp.Modularity;

namespace TeduEcommerce;

public abstract class TeduEcommerceApplicationTestBase<TStartupModule> : TeduEcommerceTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
