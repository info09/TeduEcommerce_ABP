import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AttributeComponent } from './attribute/attribute.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { AuthGuard, PermissionGuard } from '@abp/ng.core';

const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [PermissionGuard],
    data: { requiredPolicy: 'TeduEcomAdminCatalog.Product' },
  },
  {
    path: 'attribute',
    component: AttributeComponent,
    canActivate: [PermissionGuard],
    data: { requiredPolicy: 'TeduEcomAdminCatalog.Attribute' },
  },
  {
    path: 'product-category',
    component: ProductCategoryComponent,
    canActivate: [PermissionGuard],
    data: { requiredPolicy: 'TeduEcomAdminCatalog.ProductCategory' },
  },
  {
    path: 'manufacturer',
    component: ManufacturerComponent,
    canActivate: [PermissionGuard],
    data: { requiredPolicy: 'TeduEcomAdminCatalog.Manufacturer' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
