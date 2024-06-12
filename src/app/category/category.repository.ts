import { Category } from "./category.model";

export class CategoryRepository {
    private categories: Category[];

    constructor() {
        this.categories = [
            {id: 1, name: 'Macera'},
            {id: 2, name: 'Romantik'},
            {id: 3, name: 'Bilim Kurgu'},
            {id: 4, name: 'Komedi'}
        ];
    };

    getCategories(): Category[] {
        return this.categories;
    }
}