//controller/productController.ts

import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ICategoriesDBResponse } from "../models/ICategoryDBResponse";

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla produkter med GET: http://localhost:3000/products
//DONE
export const fetchAllProducts = async (req: Request, res: Response) => {
    const searchTitle = req.query.search as string;
    const sortTitle = req.query.sortTitle as string;
    const sortPrice = req.query.sortPrice as string;
    console.log("Sökord:", searchTitle);
    
    let sql = 'SELECT * FROM products';
    const params: string[] = [];
    const conditions: string[] =[];
    const orderBy: string[] = [];

    try {
        //Skall kunna söka produkter efter produkttitel
        //DONE
        if (searchTitle) {
            conditions.push ('title LIKE ?');
            params.push(`%${searchTitle}%`);
        }

        if (sortTitle && (sortTitle === 'asc' || sortTitle === 'desc')) {
            orderBy.push(`title ${sortTitle.toUpperCase()}`);
        }

        //Skall kunna sortera produktlistan efter pris, både (asc/desc)
        //DONE
        if (sortPrice && (sortPrice === 'asc' || sortPrice === 'desc')) {
            orderBy.push(`price ${sortPrice.toUpperCase()}`);
        }
    
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        if (orderBy.length > 0) {
            sql += ' ORDER BY ' + orderBy.join(', ');
        }

        const [rows] = await db.query<RowDataPacket[]>(sql, params);
        res.json(rows)
    }

    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        res.status(500).json({ error: message });
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla produkter tillhörande en viss kategori med GET: http://localhost:3000/categories/:id/products
//DONE
export const fetchProductsByCategoryId = async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    try {
    const sql = `
        SELECT * FROM products
        WHERE categories_id =  ?
    `;
    
    //man skriver ? här som placeholder iställer för WHERE id =  ${id} för att förhindra dataintrång. ? hämtas ändå som id nedan.
    const [rows] = await db.query<ICategoriesDBResponse[]>(sql, [categoryId]);
    const category = rows[0];
    if (!category) {
        res.status(404).json({message: 'category hittades inte, finns ej i arrayen'})
        return;
    }
    res.json (rows);
    } 
    
    catch (error: unknown) {
        res.status(500).json({ error: error, message: "Server error vid sortering" });
    }
}; 
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta enskild produkt med GET: http://localhost:3000/products/:id
//DONE
export const fetchProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
    const sql = `
        SELECT products. *,
        categories.name AS category_name
        FROM products
        LEFT JOIN categories
        ON products.categories_id = categories.id
        WHERE products.id =  ?
    `;
    //man skriver ? här som placeholder iställer för WHERE id =  ${id} för att förhindra dataintrång. ? hämtas ändå som id nedan.
    
    const [rows] = await db.query<ICategoriesDBResponse[]>(sql, [productId]);
    const product = rows[0];
    if (!product) {
        res.status(404).json({message: 'product hittades inte, finns ej i arrayen'})
        return;
    }
    res.json (rows);
    } 
    
    catch (error: unknown) {
        res.status(500).json({ error: error, message: "Server error vid sortering" });
    }
}; 
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Skapa ny produkt med POST: http://localhost:3000/products
//DONE
export const createProduct = async (req: Request, res: Response): Promise<Response | void> => {
    const {categories_id, title, description, price, image} = req.body;

    //Kolla om något av de obligatoriska fälten tomma eller saknas
    try{
        const requiredFields = { categories_id, title, description, price, image };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ message: `Please provide ${key}` });
            }
        }

        try{
            //Kolla om sorten redan finns
            const checkSql = `SELECT * FROM products WHERE title = ?`;
            const [existing_product] = await db.query<RowDataPacket[]>(checkSql, [title]);

            if (existing_product.length > 0) {
                return res.status(409).json ({message: "Produkten finns redan. Lägg till en annan"});
            }

            const sql = `
                INSERT INTO products (categories_id, title, description, price, image)
                VALUES (?, ?, ?, ?, ?)
            `
            const [result] = await db.query<ResultSetHeader>( sql, [categories_id, title, description, price, image])
            res.status(201).json({message: 'Ny produkt tillagd', id: result.insertId});
        }

        catch(error: unknown){
            const message = error instanceof Error ? error.message : 'Unkown error'
            res.status(500).json({error: message});
        }
    }
    
    catch (error: unknown) {
        res.status(500).json({error: error, message: "Server error vid post, dvs tillägg av ny prudukt"});
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Uppdatera befintlig produkt med PATCH: http://localhost:3000/products/:id
//DONE
export const updateProduct = async (req: Request, res: Response) => {
    const {title, description, price, image, categories_id} = req.body;
    const { id } = req.params; // Hämtar ID från URL:en

    try {
        //Felmeddelande om ngt saknas
        if (!id) {
            res.status(400).json({ error: "products:id is required" });
            return;
        }

        const fieldsToUpdate: string[] = [];
        const values: (string | number)[] = [];
        const allowedFields: Record<string, string | number | undefined> = {
            title,
            description,
            price,
            image,
            categories_id
        };

        for (const [key, value] of Object.entries(allowedFields)) {
            if (value !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fieldsToUpdate.length === 0) {
            res.status(400).json({ message: "No valid fields provided for update" });
            return;
        }

        const sql = `
            UPDATE products
            SET ${fieldsToUpdate.join(", ")}
            WHERE id = ?
        `;

        values.push(id);
        const [result] = await db.query<ResultSetHeader>(sql, values);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Produkt hittades ej" });
            return;
        }
        res.status(200).json({message: 'Produkt uppdaterad', id, affectedFields: fieldsToUpdate.map(f => f.split(" ")[0])});
    }

    catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({error: message, message: "Server error vid uppdatering av produkter"});
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Radera befintlig produkt med DELETE: http://localhost:3000/products/:id
//DONE
export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
        const sql = `
            DELETE FROM products 
            WHERE id = ?
        `

        const [result] = await db.query<ResultSetHeader>(sql, [id])
        if (result.affectedRows === 0) {
            res.status (404).json({message: 'Produkt hittades inte'})
            return;
        }
    res.json({message: "Produkt borttagen"});
    }

    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        res.status (500).json ({error: message})
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/




//TODO:
//Lägg till kontroll att stock finns med i produktlistan