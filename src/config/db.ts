import mysql from 'mysql2/promise';

import * as dotenv from 'dotenv';
dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults
export const db = mysql.createPool({
    host:       process.env.DB_HOST || "",
    user:       process.env.DB_USER || "",
    password:   process.env.DB_PASSWORD || "",
    database:   process.env.DB_NAME || "",
    port:       parseInt (process.env.DB_PORT || "3306") //prova ta bort 3306 när allt fungerar, jag förstrå inte varför det ska stå där
});

export const connectToDatabase= async () => {
    try{
        await db.getConnection();
        console.log ('Connected to DB')
    }
    catch (error: unknown){
        console.log ('Error, no DB connection:' + error)
    }
}
