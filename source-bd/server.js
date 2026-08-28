import express, { json } from "express";
import cors from "cors";
import { pool } from "./bd.js";

const app = express();
export const PORT = process.env.PORT || 3000;
/* dica da IA colocar o ||3000, porque se 
não rodar na porta desejada roda na 3000 */
app.use(cors());
app.use(express.json());

//GET NO MYSQL
app.get("/posts", async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT id, titulo, texto, url, humor, tipo_post, DATE_FORMAT(criado_em, '%d/%m/%Y às %H:%i') AS criado_em 
      FROM posts 
      ORDER BY id DESC
    `);
    res.json(posts);
  } catch (erro) {
    console.error("Erro em pegar posts: ", erro);
  }
});

// POSTAR NO MYSQL
app.post("/posts", async (req, res) => {
  try {
    const { TipoPost, TipoHumor, Titulo, Texto, Url } = req.body;

    const [result] = await pool.query(
      `INSERT INTO posts (titulo, texto, url, humor, tipo_post, criado_em) VALUES (?, ?, ?, ?, ?, NOW() - INTERVAL 3 HOUR)`,
      [Titulo, Texto, Url, TipoHumor, TipoPost,],
    );
    console.log(result);
  } catch (erro) {
    console.error("ERRO NO POST:", erro);
  }
});

//DELETAR NO SQL
app.delete("/posts/:id", async (req,res) =>{
    try{
        const {id} = req.params;
        const [resultado] = await pool.query(
            `DELETE FROM posts WHERE id =  ?`, [id]
        )
        console.log(resultado)

    } catch(erro){
        console.error("Erro: ", erro)
    }
})

// final do codigo
app.listen(PORT, () => {
  console.log(
    `servidor rodando na porta ${PORT}! url de acesso http://localhost:${PORT}`,
  );
});
