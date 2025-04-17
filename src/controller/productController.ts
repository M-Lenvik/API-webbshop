//controller/productController.ts

import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ICategoriesDBResponse } from "../models/ICategoryDBResponse";

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla produkter med GET: http://localhost:3000/products
export const fetchAllProducts = async (req: Request, res: Response) => {

    const search = req.query.search as string;
    const sort = req.query.sort as string;

    console.log("Sökord:", search);
    let sql = 'SELECT * FROM products';
    let params: string[] = [];
    let searchSQL = "";
    let sortSQL = "";

    try {
        if (search) {
            searchSQL = ' WHERE title LIKE ?';
            params = [`%${search}%`];
        }

        if (sort) {
            const OrderBy = sort === 'desc' ? 'DESC' : 'ASC';
            sortSQL = ' ORDER BY title ' + OrderBy;
        }

        sql = sql + searchSQL + sortSQL;
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
export const fetchProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
    const sql = `
        SELECT products. *,
        categories.name AS category_name
        FROM products
        JOIN categories
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
export const createProduct = async (req: Request, res: Response) => {
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