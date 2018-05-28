import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from './article.service';
import { Article } from './article';

@Component({
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

	//Elenco di tutti i record
	allArticles: Article[];
	//Codice ritornato dall'operazione HTTP
	statusCode: number;
	//Flag di richiesta elaborazione in corso
	requestProcessing = false;
	//Id del record
	articleIdToUpdate = null;
	//Abbiamo richiesto un processo di validazione del form,
	//ovvero abbiamo cliccato su uno dei tasti del form (update o create) 
	//o sul tasto edit della lista (in quest'ultimo caso non dovrebbe essere necessario) 
	processValidation = false;
	//Form
	articleForm = new FormGroup({
		title: new FormControl('', Validators.required),
		category: new FormControl('', Validators.required)
	});

	/*===========================================================================*
	| constructor()                                                              |
	| Per ottenere un'istanza di ArticleService                                  |
	*===========================================================================*/
	constructor(private articleService: ArticleService) {
	}

	/*===========================================================================*
	| ngOnInit()                                                                 |
	*===========================================================================*/
	ngOnInit(): void {
		this.getAllArticles();
	}

	/*===========================================================================*
	| preProcessConfigurations()                                                 |
	*===========================================================================*/
	//Impostiamo le configurazioni prima di processare una richiesta
	preProcessConfigurations() {
		//Azzeriamo il codice ritornato dall'ultima operazione HTTP
		this.statusCode = null;
		//Impostiamo a true il flag di richiesta elaborazione in corso
		this.requestProcessing = true;
	}

	/*===========================================================================*
	| getAllArticles()                                                           |
	*===========================================================================*/
	getAllArticles() {
		this.articleService.getAllArticles()
			.subscribe(
				data => this.allArticles = data,
				errorCode => this.statusCode = errorCode);
	}

	/*===========================================================================*
	| loadArticleToEdit()                                                        |
	*===========================================================================*/
	loadArticleToEdit(articleId: string) {
		this.preProcessConfigurations();
		this.articleService.getArticleById(articleId)
			.subscribe(
				article => {
					this.articleIdToUpdate = article.articleId;
					//Riempiamo i campi del form
					this.articleForm.setValue({title: article.title, category: article.category});
					//Richiesta di validazione dei campi del form
					//(non dovrebbe esserci bisogno in quanto sono già nel db)
					//this.processValidation = true;
					//La richiesta di elaborazione è terminata
					this.requestProcessing = false;
				},
				errorCode => this.statusCode = errorCode);
	}

	/*===========================================================================*
	| onArticleFormSubmit()                                                      |
	*===========================================================================*/
	onArticleFormSubmit() {
		this.processValidation = true;
		//Se il processo di validazione fallisce usciamo dal metodo
		if (this.articleForm.invalid) {
			return;
		}
		//Altrimenti
		this.preProcessConfigurations();
		let title = this.articleForm.get('title').value.trim();
		let category = this.articleForm.get('category').value.trim();
		//Se l'articolo non esiste lo creiamo
		if (this.articleIdToUpdate === null) {
			let article = new Article(null, title, category);
			this.articleService.createArticle(article)
				.subscribe(successCode => {
					//Impostiamo un codice positivo ritornato dall'operazione HTTP
					this.statusCode = successCode;
					//Aggiorniamo la lista
					this.getAllArticles();
					//Torniamo alla homepage
					this.backToCreateArticle();
				}, errorCode => this.statusCode = errorCode);
		}
		//Se l'articolo esiste lo modifichiamo
		else {
			let article = new Article(this.articleIdToUpdate, title, category);
			this.articleService.updateArticle(article)
				.subscribe(successCode => {
					this.statusCode = successCode;
					this.getAllArticles();
					this.backToCreateArticle();
				}, errorCode => this.statusCode = errorCode);
		}
	}

	/*===========================================================================*
	| deleteArticle()                                                            |
	*===========================================================================*/
	deleteArticle(articleId: string) {
		this.preProcessConfigurations();
		this.articleService.deleteArticleById(articleId)
			.subscribe(successCode => {
				this.statusCode = successCode;
				this.getAllArticles();
				this.backToCreateArticle();
			}, errorCode => this.statusCode = errorCode);
	}

	/*===========================================================================*
	| backToCreateArticle()                                                      |
	*===========================================================================*/
	//Torniamo all'homepage (reimpostiamo tutti i valori iniziali)
	backToCreateArticle() {
		this.articleIdToUpdate = null;
		this.articleForm.reset();
		this.processValidation = false;
	}
}