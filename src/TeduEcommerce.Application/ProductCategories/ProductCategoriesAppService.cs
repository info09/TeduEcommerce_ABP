using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace TeduEcommerce.ProductCategories
{
    public class ProductCategoriesAppService : CrudAppService<ProductCategory, ProductCategoryDto, Guid, PagedResultRequestDto, CreateUpdateProductCategoryDto, CreateUpdateProductCategoryDto>,
        IProductCategoriesAppService
    {
        public ProductCategoriesAppService(IRepository<ProductCategory, Guid> repository) : base(repository)
        {
        }
    }
}
