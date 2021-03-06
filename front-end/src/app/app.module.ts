import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkerService } from './services/marker.service';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup/popup.component';
import { createCustomElement } from '@angular/elements';
import { MatButtonModule } from '@angular/material/button'
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from './services/account.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { ColorService } from './services/color.service';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ImageService } from './services/Image.service';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageModalComponent } from './image-modal/image-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    LoginComponent,
    ImageModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    MatTabsModule,
    ColorSketchModule,
    ContextMenuModule.forRoot(),
    MatTableModule,
    MatDialogModule
  ],
  providers: [MarkerService,AccountService, ColorService, ImageService],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const PopupElement = createCustomElement(PopupComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
  }
 }
