using Microsoft.Extensions.Localization;
using TeduEcommerce.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace TeduEcommerce;

[Dependency(ReplaceServices = true)]
public class TeduEcommerceBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<TeduEcommerceResource> _localizer;

    public TeduEcommerceBrandingProvider(IStringLocalizer<TeduEcommerceResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
