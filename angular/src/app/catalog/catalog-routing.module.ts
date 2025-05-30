import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AttributeComponent } from './attribute/attribute.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';

const routes: Routes = [
  { path: 'product', component: ProductComponent },
  { path: 'attribute', component: AttributeComponent },
  { path: 'product-category', component: ProductCategoryComponent },
  { path: 'manufacturer', component: ManufacturerComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
