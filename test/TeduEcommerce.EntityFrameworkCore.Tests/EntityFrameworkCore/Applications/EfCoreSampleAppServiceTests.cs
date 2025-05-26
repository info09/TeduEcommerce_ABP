using TeduEcommerce.Samples;
using Xunit;

namespace TeduEcommerce.EntityFrameworkCore.Applications;

[Collection(TeduEcommerceTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<TeduEcommerceEntityFrameworkCoreTestModule>
{

}
