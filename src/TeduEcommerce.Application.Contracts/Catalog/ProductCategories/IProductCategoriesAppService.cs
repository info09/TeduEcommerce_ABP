using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeduEcommerce.Products;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace TeduEcommerce.Catalog.ProductCategories;

public interface IProductCategoriesAppService : ICrudAppService<ProductCategoryDto, Guid, PagedResultRequestDto, CreateUpdateProductCategoryDto, CreateUpdateProductCategoryDto>
{
    Task<PagedResultDto<ProductCategoryInListDto>> GetListFilterAsync(BaseListFilterDto input);
    Task<List<ProductCategoryInListDto>> GetListAllAsync();
    Task DeleteMultiple(IEnumerable<Guid> ids);
    Task<string> GetSuggestNewCodeAsync();
}
