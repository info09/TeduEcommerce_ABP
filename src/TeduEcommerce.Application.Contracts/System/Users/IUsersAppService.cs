using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace TeduEcommerce.System.Users;

public interface IUsersAppService : ICrudAppService<UserDto, Guid, PagedResultRequestDto, CreateUserDto, UpdateUserDto>
{
    Task DeleteMultipleAsync(IEnumerable<Guid> ids);
    Task<PagedResultDto<UserInListDto>> GetListFilterAsync(BaseListFilterDto input);
    Task<List<UserInListDto>> GetListAllAsync(string? filterKeyword);
}
