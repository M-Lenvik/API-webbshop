# Kurs: API-utveckling

## Utbildning till Frontend developer på Medieinstitutet

Detta är första gången jag arbetar med APIer. Se uppgiftsbeskrivning nedan.

Skapad av **Marie Lenvik** <br> https://github.com/M-Lenvik

## Innehållsförteckning

1. [Beskrivning av sidan](#beskrivning-av-sidan)
2. [Kom igång med projektet](#kom-igång-med-projektet)
3. [Tekniker som använts](#tekniker-som-använts)
4. [Uppgiftsbeskrivning](#beskrivning-av-sidan)
5. [Sammanfattning](#sammanfattning)
6. [Skärmdumpar](#skärmdump)
7. [Slutbetyg](#slutbetyg)

## Beskrivning av sidan
<p>Denna sida är skapad för en uppgift som en del i utbildningen till Frontend utvecklare på Medieinstititet. <br>
Detta är en webshop skapad utifrån en databas som jag också skapat. <br> <br>
OBS! Att fokus i denna uppgift enbart har legat på att skapa databaser och kopplingar till denna, dvs bara backend. Inget fokus alls har legat på frontend delen. Jag har själv valt att presentera kategorier och produkter på en webbsida. Detta ingick alltså inte i uppgiften och därmed har jag inte hunnit skapa en bättre design än detta.</p>

## Kom igång med projektet
Ladda ner tabellerna till databasen och importera i exempelvis myPHPadmin: <br>
[webshop.sql är filen för detta. Finns även bland filerna ovan.](https://github.com/M-Lenvik/API-webbshop/blob/main/webshop.sql)

**Installera genom följande:**
```
npm install
```

```
npm run dev
```

## Tekniker som använts
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)  <br>
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)  <br>
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)  <br>
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)


## Uppgiftsbeskrivning

**Inlämning 1 - API-utveckling och DB-normalisering**

**Uppgiftsbeskrivning och krav** <br>
Ni skall göra ett normaliserat ER-diagram och ett API för en produktkatalog i en e-shop.
Det gäller specifikt produkter och tillhörande kategorier.

Tabellen "products" skall innehålla följande information:
- title
- description
- stock
- price
- image
- created_date

Tabellen "categories" skall innehålla följande information:
- name

Obs: Ytterligare fält för PK och FK får ni lägga till på egen hand, så att DB-tabellerna funkar korrekt enligt beskrivning nedan.

**Uppgiftskrav på G-nivå** <br>
Skapa ett korrekt normaliserat ER-diagram efter följande beskrivning:

- En e-shop har produkter och kategorier

- Produkter kan tillhöra en kategori i taget

Skapa tabellerna med relevanta PK-fält och nycklar i PHPMyAdmin

Tilldela fält till tabell(er) som möjliggör korrekt relation mellan tabellerna i PHPMyAdmin

Skapa CRUD för kategorier, med följande endpoints:

- Hämta alla kategorier med GET: http://localhost:3000/categories

- Hämta alla produkter tillhörande en viss kategori med GET: http://localhost:3000/categories/:id/products

- Skapa ny kategori med POST: http://localhost:3000/categories

- Uppdatera befintlig kategori med PATCH: http://localhost:3000/categories/:id

- Radera befintlig kategori med DELETE: http://localhost:3000/categories/:id

Skapa CRUD för produkter, med följande endpoints:

- Hämta alla produkter med GET: http://localhost:3000/products

- Hämta enskild produkt med GET: http://localhost:3000/products/:id

- Skapa ny produkt med POST: http://localhost:3000/products

- Uppdatera befintlig produkt med PATCH: http://localhost:3000/products/:id

- Radera befintlig produkt med DELETE: http://localhost:3000/products/:id

**Uppgiftskrav på VG-nivå** <br>
Allt som G-nivån innefattar, med följande skillnader/tillägg:

Skapa ett korrekt normaliserat ER-diagram efter följande beskrivning:

- En e-shop har produkter och kategorier
- Produkter kan tillhöra flera kategorier

Lägg till FK-nycklar/index som säkerställer att produkter endast kan tilldelas kategorier som finns

Utöver endpoints på G-nivå, skall även följande filtrering/sökning skapas för:

- Hämta alla produkter med
GET: http://localhost:3000/products

- - Ska kunna söka produkter efter produkt-titel
- - Ska kunna sortera produktlistan efter pris, både (asc/desc)

Errorhantering med korrekta HTTP-statuskoder och lämpliga felmeddelanden

Validera produkter vid POST & PATCH:
Det skall inte gå att skapa/uppdatera produkter, samt passande felmeddelande skall visas, om något av följande obligatoriska fält saknas:
- title
- description
- stock
- price


## Sammanfattning
**Detta är vad som gjorts för uppgiften:** <br>
- Skapa ett ER Diagram
- Skapa tabeller i phpMyAdmin efter ER diagrammet
- Skapa SQL för CRUD (Create, Read, Update, Delete) för categorier och produkter

**Extra utöver uppgiften:** <br>
- Visa kategorier och dess produkter på en webbsida
- Möjlighet att söka, sortera, filtrera, ta bort via webbsidan

## Bilder
**ER Diagram** <br>
![ER-diagram_VG_uppgift drawio](https://github.com/user-attachments/assets/ffc997a4-d9e2-4642-8bfb-0a963be97e09)

**Databastabeller**<br>
Tabellstruktur<br>
<img width="491" alt="Tabeller" src="https://github.com/user-attachments/assets/c27bdb9f-3a33-4f50-ab88-fd355fd658df" /><br>
Categories<br>
<img width="443" alt="categories" src="https://github.com/user-attachments/assets/e2847e61-d289-4f1b-b097-27360956a926" /><br>
Categories_type<br>
<img width="425" alt="categories_type" src="https://github.com/user-attachments/assets/7cf18d9a-32db-431d-a0a5-527f8ae2e777" /><br>
Products<br>
<img width="495" alt="products" src="https://github.com/user-attachments/assets/e9ab8e9e-ad47-4de3-9ecc-d83aafbc7bd2" /><br><br>
**Webbsidan**<br>
<img width="353" alt="image" src="https://github.com/user-attachments/assets/d9832d45-efa1-471b-b528-085c7daacb2c"/>

## Slutbetyg
<!--![Betyg API utveckling, individuell uppgift]-->
