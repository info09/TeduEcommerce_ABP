using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace TeduEcommerce.Catalog.Manufacturers;

public interface IManufacturersAppService : ICrudAppService<ManufacturerDto, Guid, PagedResultRequestDto, CreateUpdateManufactureDto, CreateUpdateManufactureDto>
{
    Task<PagedResultDto<ManufacturerInListDto>> GetListFilterAsync(BaseListFilterDto input);
    Task<List<ManufacturerInListDto>> GetListAllAsync();
    Task DeleteMultiple(IEnumerable<Guid> ids);
}
