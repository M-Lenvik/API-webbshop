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