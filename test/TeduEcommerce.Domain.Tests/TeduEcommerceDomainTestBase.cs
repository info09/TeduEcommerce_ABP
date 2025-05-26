using Volo.Abp.Modularity;

namespace TeduEcommerce;

/* Inherit from this class for your domain layer tests. */
public abstract class TeduEcommerceDomainTestBase<TStartupModule> : TeduEcommerceTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
