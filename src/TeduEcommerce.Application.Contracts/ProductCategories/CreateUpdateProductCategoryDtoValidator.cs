using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeduEcommerce.ProductCategories;

public class CreateUpdateProductCategoryDtoValidator : AbstractValidator<CreateUpdateProductCategoryDto>
{
    public CreateUpdateProductCategoryDtoValidator()
    {
        RuleFor(i => i.Name).NotEmpty().MaximumLength(50);
        RuleFor(i => i.Code).NotEmpty().MaximumLength(50);
        RuleFor(i => i.Slug).NotEmpty().MaximumLength(50);
        RuleFor(i => i.CoverPicture).NotEmpty().MaximumLength(250);
        RuleFor(i => i.SeoMetaDescription).NotEmpty().MaximumLength(250);
    }
}
