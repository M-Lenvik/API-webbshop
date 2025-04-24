//controller/productController.ts

import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ICategoriesDBResponse } from "../models/ICategoryDBResponse";

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla produkter med GET: http://localhost:3000/products
//DONE/extra
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
//DONE/extra
export const fetchProductsByCategoryId = async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    try {
    const sql = `
        SELECT products.*
        FROM products
        JOIN categories_type 
            ON products.id = categories_type.product_id
        WHERE categories_type.category_id = ?;
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
//DONE/extra
export const fetchProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
    const sql = `
        SELECT products.*, 
        categories.name AS category_name
        FROM products
        LEFT JOIN categories_type 
            ON products.id = categories_type.product_id
        LEFT JOIN categories 
            ON categories_type.category_id = categories.id
        WHERE products.id = ?;
    `;
    
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
//DONE /extra
export const createProduct = async (req: Request, res: Response): Promise<Response | void> => {
    const {category_ids, title, description, price, image} = req.body;

    //Kolla om något av de obligatoriska fälten tomma eller saknas
    try{
        const requiredFields = { category_ids, title, description, price, image };
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
                INSERT INTO products (title, description, price, image)
                VALUES (?, ?, ?, ?)
            `
            const [productResult] = await db.query<ResultSetHeader>( sql, [title, description, price, image])
            
            const productId = productResult.insertId;

            //Skapa relation i mellantabellen
            const insertCategorySql = `
                INSERT INTO categories_type (category_id, product_id)
                VALUES ?
            `;

            const categoryData = category_ids.map((categoryId: number) => [categoryId, productId]);
            await db.query(insertCategorySql, [categoryData]);
                return res.status(201).json({message: 'Ny produkt tillagd', id: productId});
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
//DONE /extra
export const updateProduct = async (req: Request, res: Response) => {
    const {title, description, price, image, category_ids} = req.body;
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
            image
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

        if (Array.isArray(category_ids)) {
            //Ta bort gamla kopplingar
            const deleteSql = `
            DELETE FROM categories_type 
            WHERE product_id = ?
            `;
            
            await db.query(deleteSql, [id]);
      
            //Lägg till nya kopplingar
            const insertSql = `
              INSERT INTO categories_type (category_id, product_id)
              VALUES ?
            `;
            const categoryData = category_ids.map((categoryId: number) => [categoryId, Number(id)]);
            await db.query(insertSql, [categoryData]);
        }
      
        res.status(200).json({
            message: "Produkt uppdaterad",
            id,
            updatedFields: fieldsToUpdate.map(f => f.split(" ")[0]),
        });
    }

    catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({error: message, message: "Server error vid uppdatering av produkter"});
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Radera befintlig produkt med DELETE: http://localhost:3000/products/:id
//DONE /extra
export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
        //Ta först bort kopplingen i mellantabellen och därefter produkten
        const deleteRelationsSql = `
        DELETE FROM categories_type 
        WHERE product_id = ?
    `;

    await db.query(deleteRelationsSql, [id]);

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