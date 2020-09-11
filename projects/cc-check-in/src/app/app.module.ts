import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { SortablejsModule } from 'ngx-sortablejs';
import { RootStoreModule } from '@campus-cloud/store';
import { HttpClientModule } from '@angular/common/http';
import { APP_PROVIDERS } from '@campus-cloud/config/providers';
import { SharedModule } from '@campus-cloud/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RootStoreModule,
    SharedModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    SortablejsModule.forRoot({ animation: 150 })
  ],
  providers: [...APP_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
