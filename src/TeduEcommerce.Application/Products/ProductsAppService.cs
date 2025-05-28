using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TeduEcommerce.ProductCategories;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.BlobStoring;
using Volo.Abp.Domain.Repositories;

namespace TeduEcommerce.Products;

public class ProductsAppService : CrudAppService<Product, ProductDto, Guid, PagedResultRequestDto, CreateUpdateProductDto, CreateUpdateProductDto>, IProductsAppService
{
    private readonly ProductManager _productManager;
    private readonly IRepository<ProductCategory, Guid> _productCategoryRepository;
    private readonly IBlobContainer<ProductThumbnailPictureContainer> _fileContainer;

    public ProductsAppService(IRepository<Product, Guid> repository, ProductManager productManager, IRepository<ProductCategory, Guid> productCategoryRepository, IBlobContainer<ProductThumbnailPictureContainer> fileContainer) : base(repository)
    {
        _productManager = productManager;
        _productCategoryRepository = productCategoryRepository;
        _fileContainer = fileContainer;
    }

    public async Task DeleteMultiple(IEnumerable<Guid> ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current!.SaveChangesAsync(); // Ensure changes are saved
    }

    public async Task<List<ProductInListDto>> GetListAllAsync()
    {
        var query = await Repository.GetQueryableAsync();
        query = query.Where(i => i.IsActive);
        var data = await AsyncExecuter.ToListAsync(query);
        return ObjectMapper.Map<List<Product>, List<ProductInListDto>>(data);
    }

    public async Task<PagedResultDto<ProductInListDto>> GetListFilterAsync(ProductListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrEmpty(input.Keyword), x => x.Name.Contains(input.Keyword!));
        query = query.WhereIf(input.CategoryId.HasValue, x => x.CategoryId == input.CategoryId!.Value);

        var totalCount = await AsyncExecuter.LongCountAsync(query);
        var data = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));
        return new PagedResultDto<ProductInListDto>(totalCount, ObjectMapper.Map<List<Product>, List<ProductInListDto>>(data));
    }

    public override async Task<ProductDto> CreateAsync(CreateUpdateProductDto input)
    {
        var product = await _productManager.CreateAsync(input.ManufacturerId, input.Name, input.Code, input.Slug,
            input.ProductType, input.SKU, input.SortOrder, input.Visibility, input.IsActive,
            input.CategoryId, input.SeoMetaDescription, input.Description,
            input.SellPrice);

        if(input.ThumbnailPictureContent != null && input.ThumbnailPictureContent.Length > 0)
        {
            await SaveThumbnailPictureAsync(input.ThumbnailPictureName, input.ThumbnailPictureContent);
            product.ThumbnailPicture = input.ThumbnailPictureName;
        }

        var result = await Repository.InsertAsync(product, autoSave: true);

        return ObjectMapper.Map<Product, ProductDto>(result);
    }

    public override async Task<ProductDto> UpdateAsync(Guid id, CreateUpdateProductDto input)
    {
        var product = await Repository.GetAsync(id) ?? throw new Exception($"Product with id '{id}' not found.");

        product.ManufacturerId = input.ManufacturerId;
        product.Name = input.Name;
        product.Code = input.Code;
        product.Slug = input.Slug;
        product.ProductType = input.ProductType;
        product.SKU = input.SKU;
        product.SortOrder = input.SortOrder;
        product.Visibility = input.Visibility;
        product.IsActive = input.IsActive;
        
        product.SeoMetaDescription = input.SeoMetaDescription;
        product.Description = input.Description;
        if (input.ThumbnailPictureContent != null && input.ThumbnailPictureContent.Length > 0)
        {
            await SaveThumbnailPictureAsync(input.ThumbnailPictureName, input.ThumbnailPictureContent);
            product.ThumbnailPicture = input.ThumbnailPictureName;

        }
        product.SellPrice = input.SellPrice;

        if(product.CategoryId != input.CategoryId)
        {
            product.CategoryId = input.CategoryId;
            var category = await _productCategoryRepository.GetAsync(input.CategoryId);
            product.CategoryName = category?.Name;
            product.CategorySlug = category?.Slug;
        }
        

        var result = await Repository.UpdateAsync(product, autoSave: true);
        return ObjectMapper.Map<Product, ProductDto>(result);
    }

    private async Task SaveThumbnailPictureAsync(string fileName, string base64)
    {
        var regex = new Regex(@"^[\w/\:.-]+;base64,");
        base64 = regex.Replace(base64, string.Empty);
        var bytes = Convert.FromBase64String(base64);
        await _fileContainer.SaveAsync(fileName, bytes);
    }
}
