import dotenv from 'dotenv'
import mysql2 from 'mysql2/promise'

dotenv.config({path: "./source-bd/.env"})
console.log("URI DO BANCO:", process.env.URI);

export const pool = mysql2.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,

    // //IA
    //     // Configuração para exigir conexão segura (SSL REQUIRED)
    // ssl: {
    //     // Aceita certificados autoassinados ou conexões SSL sem validar a CA
    //     rejectUnauthorized: false 
    // },
    
    uri: process.env.URI,
    waitForConnections :true,
    connectionLimit: 35,
})