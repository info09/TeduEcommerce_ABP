import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditorModule } from 'primeng/editor';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail.component';
import { ProductAttributeComponent } from './product/product-attribute.component';
import { SharedModule } from 'primeng/api';
import { CatalogRoutingModule } from './catalog-routing.module';
import { TeduSharedModule } from '../shared/modules/tedu-shared.module';
import { AttributeDetailComponent } from './attribute/attribute-detail.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeComponent } from './attribute/attribute.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ProductComponent,
    ProductDetailComponent,
    ProductAttributeComponent,
    ProductCategoryComponent,
    AttributeComponent,
    AttributeDetailComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    CatalogRoutingModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    BlockUIModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    EditorModule,
    TeduSharedModule,
    BadgeModule,
    ImageModule,
    ConfirmDialogModule,
    CalendarModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ProductDetailComponent,
    ProductAttributeComponent,
    AttributeDetailComponent,
    AttributeComponent,
  ],
})
export class CatalogModule {}
