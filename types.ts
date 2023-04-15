import { Dispatch, SetStateAction } from 'react';

import { SearchMode } from './client/constants/search-mode';
import { SourceSlant } from './client/constants/source-slant';

/** Source List Type Definition */

export type Source = {
	id: string;
	name: string;
	url: string;
	slant?: SourceSlant;
};

/** Headline Search Request Type Definition */

export type SearchRequest = {
	sources: string;
	spectrumSearchAll: 'Y' | 'N';
	keyword: string;
	previousDays: number;
};

/** Headline Search Result Type Definitions */

export type NewsApiArticle = {
	source: {
		id: string;
		name: string;
	};
	title: string;
	description: string;
	url: string;
	publishedAt: string;
	author?: string | null;
	urlToImage?: string;
	content?: string;
};

export type TwitterArticle = {
	author_id: string;
	id: string;
	text: string;
	sourceName: string;
};

export type Article = NewsApiArticle | TwitterArticle;
export const isNewsApiArticle = (article: Article): article is NewsApiArticle => {
	return (article as NewsApiArticle).title !== undefined;
};

export type ArticleMap = { [key: string]: Article[] };

/** Saved Search Result Type Definitions */

export type SavedResult = {
	_id?: string;
	name: string;
	articleMap: ArticleMap;
	isSearchAll: boolean;
	sourceList: Source[];
	userId?: string;
	createdAt?: string;
	imagePath?: string;
};

export type SavedResultSummary = {
	_id: string;
	name: string;
	createdAt: string;
};

/** Blog Post Type Definitions */

export type BlogPost = {
	author: string;
	title: string;
	slug: string;
	content: string;
	_id?: string;
	excerpt?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type BlogPostSummary = {
	author: string;
	title: string;
	slug: string;
	_id: string;
	excerpt: string;
	createdAt: string;
	updatedAt: string;
};

/** Feedback Email Type Definition */

export type FeedbackMessage = {
	name: string;
	email: string;
	reason: string;
	message: string;
};

/** Client Context Type Definitions */

export type ShowAlertFn = (level: string, message: string) => void;

export type SearchResult =
	| {
			sourceListToSearch: Source[];
			isSearchAll: boolean;
			articleMap: ArticleMap;
			savedResultId: string;
			savedResultName: string;
	  }
	| Record<string, never>;
export type SetResultContextFn = Dispatch<SetStateAction<SearchResult>>;
export type ResultContextType = [SearchResult, SetResultContextFn];

/** Client Search Form Type Definition */

export type SearchFormState = {
	keyword: string;
	previousDays: number;
	sourceSlant?: SourceSlant;
	spectrumSearchAll: 'Y' | 'N';
	selectedSourceIds: string[];
};

export interface SearchFormWithMode extends SearchFormState {
	searchMode: SearchMode;
}

/** API Responses */

export type ListItem<T> = {
	[prop in keyof T]: string;
};

export interface ListResponse<T> {
	items: ListItem<T>[];
	pageCount: number;
}

export type ItemSavedResponse = {
	itemId?: string;
};

export type ItemDeletedResponse = {
	itemDeleted: boolean;
};

export type FeedbackSentResponse = {
	feedbackSent: boolean;
};
