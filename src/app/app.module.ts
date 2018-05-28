import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

@NgModule({
	//Elenco dei componenti di cui è composta l'applicazione
	declarations: [
		AppComponent,
		ArticleComponent
	],
	//Lista di moduli esterni di cui ha bisogno l'applicazione
	imports: [
		BrowserModule,
		HttpModule,
		ReactiveFormsModule
	],
	//Servizi iniettabili all'interno di qualsiasi classe ne abbia bisogno (sono Singleton)
	providers: [
		ArticleService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }