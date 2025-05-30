using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeduEcommerce.ProductCategories;
using TeduEcommerce.Products;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace TeduEcommerce.Catalog.ProductCategories;

[Authorize]
public class ProductCategoriesAppService : CrudAppService<ProductCategory, 
                                                            ProductCategoryDto, 
                                                            Guid, 
                                                            PagedResultRequestDto, 
                                                            CreateUpdateProductCategoryDto,
                                                            CreateUpdateProductCategoryDto>, IProductCategoriesAppService
{
    private readonly ProductCategoryCodeGenerator _categoryCodeGenerator;
    public ProductCategoriesAppService(IRepository<ProductCategory, Guid> repository, ProductCategoryCodeGenerator categoryCodeGenerator) : base(repository)
    {
        _categoryCodeGenerator = categoryCodeGenerator;
    }

    public async Task DeleteMultiple(IEnumerable<Guid> ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current!.SaveChangesAsync(); // Ensure changes are saved
    }

    public async Task<List<ProductCategoryInListDto>> GetListAllAsync()
    {
        var query = await Repository.GetQueryableAsync();
        query = query.Where(i => i.IsActive);
        var data = await AsyncExecuter.ToListAsync(query);
        return ObjectMapper.Map<List<ProductCategory>, List<ProductCategoryInListDto>>(data);
    }

    public async Task<PagedResultDto<ProductCategoryInListDto>> GetListFilterAsync(BaseListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrWhiteSpace(input.Keyword), x => x.Name.Contains(input.Keyword!));

        var totalCount = await AsyncExecuter.LongCountAsync(query);
        var data = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));

        return new PagedResultDto<ProductCategoryInListDto>(totalCount, ObjectMapper.Map<List<ProductCategory>, List<ProductCategoryInListDto>>(data));
    }

    public async Task<string> GetSuggestNewCodeAsync()
    {
        return await _categoryCodeGenerator.GenerateCodeAsync();
    }
}
