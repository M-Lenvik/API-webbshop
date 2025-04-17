//controller/categoriesController.ts

import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ICategories } from "../models/ICategories";
import { ICategoriesDBResponse } from "../models/ICategoriesDBResponse";


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
//Hämta alla kategorier med GET: http://localhost:3000/categories
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






