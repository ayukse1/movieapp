import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { CategoriesModule } from './category/categories.module';
import { AboutModule } from './about/about.module';

@NgModule({
  declarations: [                  //components
    AppComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [                       //modules
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    CategoriesModule,
    AboutModule
  ],
  providers: [                     //services
  ],                   
  bootstrap: [AppComponent]        //starter component
})
export class AppModule { }
