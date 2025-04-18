//models/categories.ts





//jag tror att jag kan ta bort den här filen, den är inte i bruk längre

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