using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace TeduEcommerce.System.Roles;

public class RolesAppService : CrudAppService<IdentityRole, RoleDto, Guid, PagedResultRequestDto, CreateUpdateRoleDto, CreateUpdateRoleDto>, IRolesAppService
{
    public RolesAppService(IRepository<IdentityRole, Guid> repository) : base(repository)
    {
    }

    public async Task DeleteMultipleAsync(Guid[] ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current!.SaveChangesAsync(); // Ensure changes are saved
    }

    public async Task<List<RoleInListDto>> GetListAllAsync()
    {
        var query = await Repository.GetQueryableAsync();
        var data = await AsyncExecuter.ToListAsync(query);
        return ObjectMapper.Map<List<IdentityRole>, List<RoleInListDto>>(data);
    }

    public async Task<PagedResultDto<RoleInListDto>> GetListFilterAsync(BaseListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrWhiteSpace(input.Keyword), x => x.Name.Contains(input.Keyword!));
        var totalCount = await AsyncExecuter.LongCountAsync(query);
        var data = await AsyncExecuter.ToListAsync(query.OrderByDescending(i => i.CreationTime).Skip(input.SkipCount).Take(input.MaxResultCount));
        return new PagedResultDto<RoleInListDto>(totalCount, ObjectMapper.Map<List<IdentityRole>, List<RoleInListDto>>(data));
    }
}
