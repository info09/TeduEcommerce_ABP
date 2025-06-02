using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace TeduEcommerce.System.Users;

public class UsersAppService : CrudAppService<IdentityUser, UserDto, Guid, PagedResultRequestDto, CreateUserDto, UpdateUserDto>, IUsersAppService
{
    private readonly IdentityUserManager _identityUserManager;
    public UsersAppService(IRepository<IdentityUser, Guid> repository, IdentityUserManager identityUserManager) : base(repository)
    {
        _identityUserManager = identityUserManager;
    }

    public async Task DeleteMultipleAsync(IEnumerable<Guid> ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current!.SaveChangesAsync();
    }

    public async Task<List<UserInListDto>> GetListAllAsync(string? filterKeyword)
    {
        var query = await Repository.GetQueryableAsync();
        if (!string.IsNullOrEmpty(filterKeyword))
        {
            query = query.Where(i => i.Name.Contains(filterKeyword) || i.Email.Contains(filterKeyword) || i.PhoneNumber.Contains(filterKeyword));
        }

        var data = await AsyncExecuter.ToListAsync(query);
        return ObjectMapper.Map<List<IdentityUser>, List<UserInListDto>>(data);
    }

    public async Task<PagedResultDto<UserInListDto>> GetListFilterAsync(BaseListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();

        if (!input.Keyword.IsNullOrWhiteSpace())
        {
            input.Keyword = input.Keyword.ToLower();
            query = query.Where(i => i.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        i.Email.ToLower().Contains(input.Keyword.ToLower()) ||
                                        i.PhoneNumber.ToLower().Contains(input.Keyword.ToLower()));

        }

        query = query.OrderByDescending(i => i.CreationTime);

        var totalCount = await AsyncExecuter.CountAsync(query);

        query = query.Skip(input.SkipCount).Take(input.MaxResultCount);

        var data = await AsyncExecuter.ToListAsync(query);

        return new PagedResultDto<UserInListDto>(
            totalCount,
            ObjectMapper.Map<List<IdentityUser>, List<UserInListDto>>(data)
        );
    }

    public override async Task<UserDto> CreateAsync(CreateUserDto input)
    {
        var query = await Repository.GetQueryableAsync();
        var isUserNameExited = query.Any(i => i.UserName == input.UserName);
        if (isUserNameExited)
        {
            throw new UserFriendlyException("Tên đăng nhập đã tồn tại");
        }
        var isEmailExited = query.Any(i => i.Email == input.Email);
        if (isEmailExited)
        {
            throw new UserFriendlyException("Email đã tồn tại");
        }

        var userId = Guid.NewGuid();
        var user = new IdentityUser(userId, input.UserName, input.Email)
        {
            Name = input.Name,
            Surname = input.Surname
        };
        user.SetPhoneNumber(input.PhoneNumber, true);
        var result = await _identityUserManager.CreateAsync(user, input.Password);
        if (result.Succeeded)
        {
            return ObjectMapper.Map<IdentityUser, UserDto>(user);
        }
        else
        {
            List<IdentityError> errors = result.Errors.ToList();
            string errorMessage = "";
            foreach (var error in errors)
            {
                errorMessage += error.Description + "\n";
            }
            throw new UserFriendlyException(errorMessage);
        }
    }

    public override async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto input)
    {
        var user = await _identityUserManager.FindByIdAsync(id.ToString()) ?? throw new UserFriendlyException("Không tìm thấy người dùng");
        user.Name = input.Name;
        user.SetPhoneNumber(input.PhoneNumber, true);
        user.Surname = input.Surname;
        var result = await _identityUserManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return ObjectMapper.Map<IdentityUser, UserDto>(user);
        }
        else
        {
            List<IdentityError> errors = result.Errors.ToList();
            string errorMessage = "";
            foreach (var error in errors)
            {
                errorMessage += error.Description + "\n";
            }
            throw new UserFriendlyException(errorMessage);

        }
    }

    public override async Task<UserDto> GetAsync(Guid id)
    {
        var user = await _identityUserManager.FindByIdAsync(id.ToString()) ?? throw new UserFriendlyException("Không tìm thấy người dùng");
        var userDto = ObjectMapper.Map<IdentityUser, UserDto>(user);
        var roles = await _identityUserManager.GetRolesAsync(user);
        userDto.Roles = roles;
        return userDto;
    }

    public async Task AssignRolesAsync(Guid userId, string[] roleNames)
    {
        var user = await _identityUserManager.FindByIdAsync(userId.ToString()) ?? throw new UserFriendlyException("Không tìm thấy người dùng");
        var currentRoles = await _identityUserManager.GetRolesAsync(user);
        var removedResult = await _identityUserManager.RemoveFromRolesAsync(user, currentRoles);
        var addedResult = await _identityUserManager.AddToRolesAsync(user, roleNames);
        if (!addedResult.Succeeded || !removedResult.Succeeded)
        {
            List<IdentityError> addedErrorList = addedResult.Errors.ToList();
            List<IdentityError> removedErrorList = removedResult.Errors.ToList();
            var errorList = new List<IdentityError>();
            errorList.AddRange(addedErrorList);
            errorList.AddRange(removedErrorList);
            string errors = "";

            foreach (var error in errorList)
            {
                errors += error.Description.ToString();
            }
            throw new UserFriendlyException(errors);
        }
    }

    public async Task SetPasswordAsync(Guid userId, SetPasswordDto input)
    {
        var user = await _identityUserManager.FindByIdAsync(userId.ToString()) ?? throw new UserFriendlyException("Không tìm thấy người dùng");
        var token = await _identityUserManager.GeneratePasswordResetTokenAsync(user);
        var result = await _identityUserManager.ResetPasswordAsync(user, token, input.NewPassword);
        if (!result.Succeeded)
        {
            List<IdentityError> errors = result.Errors.ToList();
            string errorMessage = "";
            foreach (var error in errors)
            {
                errorMessage += error.Description + "\n";
            }
            throw new UserFriendlyException(errorMessage);
        }
    }
}
