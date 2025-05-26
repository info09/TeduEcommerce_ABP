using Xunit;

namespace TeduEcommerce.EntityFrameworkCore;

[CollectionDefinition(TeduEcommerceTestConsts.CollectionDefinitionName)]
public class TeduEcommerceEntityFrameworkCoreCollection : ICollectionFixture<TeduEcommerceEntityFrameworkCoreFixture>
{

}
