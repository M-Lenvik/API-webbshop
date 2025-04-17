//models/categories.ts

export class Categories {
    //kommer innifrån
    id: number = 0;
    name: string = "";


    //detta data kommer som request utifrån
    //this.id kommer från classen
    constructor(name: string) {
        this.id = Math.round(Math.random() * 1000);
        this.name = name;
    }
}