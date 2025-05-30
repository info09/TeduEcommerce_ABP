using System.Threading.Tasks;
using TeduEcommerce.IdentitySettings;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace TeduEcommerce.ProductCategories;

public class ProductCategoryCodeGenerator(IRepository<IdentitySetting, string> identitySettingRepository) : ITransientDependency
{
    private readonly IRepository<IdentitySetting, string> _identitySettingRepository = identitySettingRepository;

    public async Task<string> GenerateCodeAsync()
    {
        string newCode;
        var identitySetting = await _identitySettingRepository.FindAsync(TeduEcommerceConsts.ProductCategoryIdentitySettingId);

        if (identitySetting == null)
        {
            identitySetting = await _identitySettingRepository.InsertAsync(
                new IdentitySetting(
                    TeduEcommerceConsts.ProductCategoryIdentitySettingId,
                    "Danh mục Sản phẩm",
                    TeduEcommerceConsts.ProductCategoryIdentitySettingPrefix,
                    1, // Start from 1
                    1 // Increment by 1
                )
            );
            newCode = $"{identitySetting.Prefix}{identitySetting.CurrentNumber:D5}";
        }
        else
        {
            identitySetting.CurrentNumber += identitySetting.StepNumber;
            newCode = $"{identitySetting.Prefix}{identitySetting.CurrentNumber:D5}"; // Format with leading zeros

            await _identitySettingRepository.UpdateAsync(identitySetting);
        }
        return newCode;
    }
}
