using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace TeduEcommerce.ProductAttributes;

public class ProductAttributesAppService : CrudAppService<ProductAttribute, ProductAttributeDto, Guid, PagedResultRequestDto, CreateUpdateProductAttributeDto, CreateUpdateProductAttributeDto>, IProductAttributesAppService
{
    public ProductAttributesAppService(IRepository<ProductAttribute, Guid> repository) : base(repository)
    {
    }

    public async Task DeleteMultipleAsync(IEnumerable<Guid> ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current!.SaveChangesAsync(); // Ensure changes are saved
    }

    public async Task<List<ProductAttributeInListDto>> GetListAllAsync()
    {
        var query = await Repository.GetQueryableAsync();
        query = query.Where(i => i.IsActive);
        var data = await AsyncExecuter.ToListAsync(query);
        return ObjectMapper.Map<List<ProductAttribute>, List<ProductAttributeInListDto>>(data);
    }

    public async Task<PagedResultDto<ProductAttributeInListDto>> GetListFilterAsync(BaseListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrEmpty(input.Keyword), x => x.Label.Contains(input.Keyword!));

        var totalCount = await AsyncExecuter.LongCountAsync(query);
        var data = await AsyncExecuter.ToListAsync(query.OrderByDescending(i => i.CreationTime).Skip(input.SkipCount).Take(input.MaxResultCount));
        return new PagedResultDto<ProductAttributeInListDto>(totalCount, ObjectMapper.Map<List<ProductAttribute>, List<ProductAttributeInListDto>>(data));
    }
}
