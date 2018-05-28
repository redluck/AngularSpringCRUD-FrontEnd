import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Article } from './article';

@Injectable()
export class ArticleService {

	//URL per le operazioni CRUD
	allArticlesUrl = "http://localhost:8080/user/all-articles";
	articleUrl = "http://localhost:8080/user/article";

	/*===========================================================================*
	| constructor()                                                              |
	| Per ottenere un'istanza di Http                                            |
	*===========================================================================*/
	constructor(private http: Http) {
	}

	/*===========================================================================*
	| getAllArticles()                                                           |
	*===========================================================================*/
	getAllArticles(): Observable<Article[]> {
		return this.http.get(this.allArticlesUrl)
			.map(response => response.json())
			.catch(error => {
				return Observable.throw(error)
			});
	}

	/*===========================================================================*
	| getArticleById()                                                           |
	*===========================================================================*/
	getArticleById(articleId: string): Observable<Article> {
		//Secondo parametro "options?" da passare al metodo Http.get()
		//(costituito da un Headers e da un URLSearchParam)
		let myHeaders = new Headers({'Content-Type': 'application/json'});
		let myParams = new URLSearchParams();
		myParams.set('id', articleId);
		let options = new RequestOptions({headers: myHeaders, params: myParams});
		
		return this.http.get(this.articleUrl, options)
			.map(response => response.json())
			.catch(error => {
				return Observable.throw(error)
			});
	}
	
	/*===========================================================================*
	| createArticle()                                                            |
	*===========================================================================*/
	createArticle(article: Article): Observable<number> {
		//Terzo parametro "options?" da passare al metodo Http.post()
		//(costituito da un Headers)
		let myHeaders = new Headers({'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: myHeaders});
		
		return this.http.post(this.articleUrl, article, options)
			.map(response => response.status)
			.catch(error => {
				return Observable.throw(error)
			});
	}

	/*===========================================================================*
	| updateArticle() [modificarne la logica]                                    |
	*===========================================================================*/
	updateArticle(article: Article): Observable<number> {
		//Terzo parametro "options?" da passare al metodo Http.put()
		//(costituito da un Headers)
		let myHeaders = new Headers({'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: myHeaders});
		
		return this.http.put(this.articleUrl, article, options)
			.map(response => response.status)
			.catch(error => {
				return Observable.throw(error)
			});
	}

	/*===========================================================================*
	| deleteArticleById()                                                        |
	*===========================================================================*/
	deleteArticleById(articleId: string): Observable<number> {
		//Secondo parametro "options?" da passare al metodo Http.get()
		//(costituito da un Headers e da un URLSearchParam)
		let myHeaders = new Headers({'Content-Type': 'application/json'});
		let myParams = new URLSearchParams();
		myParams.set('id', articleId);
		let options = new RequestOptions({headers: myHeaders, params: myParams});
		
		return this.http.delete(this.articleUrl, options)
			.map(response => response.status)
			.catch(error => {
				return Observable.throw(error)
			});
	}
}