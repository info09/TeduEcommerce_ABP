using Volo.Abp.Identity;

namespace TeduEcommerce;

public static class TeduEcommerceConsts
{
    public const string DbTablePrefix = "App";
    public const string? DbSchema = null;
    public const string AdminEmailDefaultValue = IdentityDataSeedContributor.AdminEmailDefaultValue;
    public const string AdminPasswordDefaultValue = IdentityDataSeedContributor.AdminPasswordDefaultValue;

    public const string ProductIdentitySettingId = "Product";
    public const string ProductIdentitySettingPrefix = "P";
}
