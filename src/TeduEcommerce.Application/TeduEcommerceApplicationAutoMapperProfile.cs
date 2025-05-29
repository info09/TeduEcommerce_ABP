using AutoMapper;
using TeduEcommerce.Catalog.Manufacturers;
using TeduEcommerce.Catalog.ProductAttributes;
using TeduEcommerce.Catalog.ProductCategories;
using TeduEcommerce.Catalog.Products;
using TeduEcommerce.Manufacturers;
using TeduEcommerce.ProductAttributes;
using TeduEcommerce.ProductCategories;
using TeduEcommerce.Products;

namespace TeduEcommerce;

public class TeduEcommerceApplicationAutoMapperProfile : Profile
{
    public TeduEcommerceApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
        
        //Product Category
        CreateMap<ProductCategory, ProductCategoryDto>();
        CreateMap<ProductCategory, ProductCategoryInListDto>();
        CreateMap<CreateUpdateProductDto, ProductCategory>();

        //Product
        CreateMap<Product, ProductDto>();
        CreateMap<Product, ProductInListDto>();
        CreateMap<CreateUpdateProductDto, Product>();

        //Manufacturer
        CreateMap<Manufacturer, ManufacturerDto>();
        CreateMap<Manufacturer, ManufacturerInListDto>();
        CreateMap<CreateUpdateManufactureDto, Manufacturer>();

        //ProductAttribute
        CreateMap<ProductAttribute, ProductAttributeDto>();
        CreateMap<ProductAttribute, ProductAttributeInListDto>();
        CreateMap<CreateUpdateProductAttributeDto, ProductAttribute>();
    }
}
