using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace TeduEcommerce.System.Roles;

public interface IRolesAppService : ICrudAppService<RoleDto, Guid, PagedResultRequestDto, CreateUpdateRoleDto, CreateUpdateRoleDto>
{
    Task<PagedResultDto<RoleInListDto>> GetListFilterAsync(BaseListFilterDto input);
    Task<List<RoleInListDto>> GetListAllAsync();
    Task DeleteMultipleAsync(Guid[] ids);
}
