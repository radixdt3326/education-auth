import express, { json } from 'express';

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log("Seeder file running from:", __dirname);
// console.log("Resolved path to common:", path.resolve(__dirname, "../utils/common"));

import { genPasswordHash } from '../utils/common';
import pool from '../Db_connection/dbConfig';

// (async () => {

//     // const { genPasswordHash } = await import("../utils/common.ts");
//     // const {pool} = await import('../Db_connection/dbConfig.ts');

//     // console.log("test123")


// })();

const seeds = async ()=>{
    const sampleData = [
        {
            email: "testuser@test.com",
            password_salt: "",
            password_hash: "",
            password_algo: "",
            role: 'admin'
        },
        {
            email: "testuser1@test.com",
            password_salt: "",
            password_hash: "",
            password_algo: "",
            role: 'user'
        }
    ]

    const usersWithHashes = await Promise.all(
        sampleData.map(async (item) => {
            const passwordHashDetail = await genPasswordHash("test@0987");
            return {
                email: item.email,
                password_salt: passwordHashDetail.salt,
                password_hash: passwordHashDetail.hash,
                password_algo: passwordHashDetail.algo,
                role: item.role
            };
        })
    );


    // Convert data into query format
    const values = usersWithHashes
        .map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`)
        .join(", ");



    const query = `
      INSERT INTO user_table (email, password_salt, password_hash, password_algo, role)
      VALUES ${values}
      RETURNING *;
    `;

    // Flatten values into an array for parameterized queries
    const queryParams = usersWithHashes.flatMap((user) => [
        user.email,
        user.password_salt,
        user.password_hash,
        user.password_algo,
        user.role
    ]);

    try {
        const { rows } = await pool.query(query, queryParams);
        console.log("rows Added successfully-->", rows)
    } catch (e) {
        console.log(e.message)
    }
}

seeds();
