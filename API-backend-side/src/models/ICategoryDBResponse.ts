//models/ICategoryDBResponse.ts

import { RowDataPacket } from "mysql2";

export interface ICategoriesDBResponse extends RowDataPacket {
    //kommer innifrån
    category_id: number;
    name: string;
}