//controller/categoriesController.ts

import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla kategorier med GET: http://localhost:3000/categories
//DONE
export const fetchAllCategories = async (req: Request, res: Response) => {

    const search = req.query.search as string;
    const sort = req.query.sort as string;
    console.log("Sökord:", search);

    let sql = 'SELECT * FROM categories';
    let params: string[] = [];
    let searchSQL = "";
    let sortSQL = "";

    try {
        if (search) {
            searchSQL = ' WHERE name LIKE ?';
            params = [`%${search}%`];
        }

        if (sort) {
            const OrderBy = sort === 'desc' ? 'DESC' : 'ASC';
            sortSQL = ' ORDER BY name ' + OrderBy;
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
//Skapa ny kategori med POST: http://localhost:3000/categories
//DONE
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const {name} = req.body;
    try{
        //Felmeddelande om ngt saknas
        if (!name) {
            res.status(400).json({message: "Please provide name"});
            return;
        }

        try{
            //Kolla om sorten redan finns
            const checkSql = `SELECT * FROM categories WHERE name = ?`;
            const [existing] = await db.query<RowDataPacket[]>(checkSql, [name]);

            if (existing.length > 0) {
                res.status(409).json ({message: "Kategorin finns redan. Lägg till en annan"});
            }

            const sql = `
                INSERT INTO categories (name)
                VALUES (?)
            `
            const [result] = await db.query<ResultSetHeader>( sql, [name])
                res.status(201).json({message: 'Ny kategori tillagd', id: result.insertId});
            }
            
            catch(error: unknown){
                const message = error instanceof Error ? error.message : 'Unkown error'
                res.status(500).json({error: message});
            }
        }

    catch (error: unknown) {
        res.status(500).json({error: error, message: "Server error vid post, dvs tillägg av ny kategori"});
        next(error);
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Uppdatera befintlig kategori med PATCH: http://localhost:3000/categories/:id
//DONE
export const updateCategory = async (req: Request, res: Response) => {
    const {name} = req.body;
    const { id } = req.params; // Hämtar ID från URL:en

    try {
        //Felmeddelande om ngt saknas
        if (!name) {
            res.status(400).json({message: "Please provide name"});
            return;
        }

        if (!id) {
            res.status(400).json({ error: "categories:id is required" });
            return;
        }

        const sql = `
            UPDATE categories
            SET name = ?
            WHERE id = ?
        `;
        const [result] = await db.query<ResultSetHeader>(sql, [name, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Kategori hittades ej" });
            return;
        }
        res.status(200).json({message: 'Kategori uppdaterad', id: id, affectedRows: result.affectedRows});
    }

    catch (error: unknown) {
        res.status(500).json({error: error, message: "Server error vid uppdatering av kategori"});
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Radera befintlig kategori med DELETE: http://localhost:3000/categories/:id
//DONE
export const deleteCategory = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
        const sql = `
            DELETE FROM categories 
            WHERE id = ?
        `
        const [result] = await db.query<ResultSetHeader>(sql, [id])
        if (result.affectedRows === 0) {
            res.status (404).json({message: 'Kategori hittades inte'})
            return;
        }

    res.json({message: "Kategori borttagen"});
    }

    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        res.status (500).json ({error: message})
    }
};
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/