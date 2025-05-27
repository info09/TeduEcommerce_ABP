using Volo.Abp.Application.Dtos;

namespace TeduEcommerce;

public class BaseListFilterDto : PagedResultRequestDto
{
    public string? Keyword { get; set; }
}
