const express = require('express');
const { Pool } = require('pg');


const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    host: 'db.fdattmhrbmommrymhbyx.supabase.co',
    port: '5432',
    database: 'postgres',
    password: 'Nikte2019++',
    user:'postgres'
});

app.get('/usuarios', async (req, res)=>{
try{
    const {rows} = await pool.query(
        'SELECT * FROM personas'
    );
    const response = {
        ok: true,
        message: `datos desde el puerto ${port}`,
        data: rows
    };

    res.json(response);


    
}catch(error){
    console.error(error.stack);
    res.status(500).json({error: 'error del servidor'});

}});

app.post('/usuarios', async (req, res)=>{
    const {nombres, apellidos, carnet} = req.body;
    if(!nombres || !apellidos || !carnet){
        return res.status(400).json({ error: 'el nombre y el apellido son campos requierido'})
    }

    try{
        const sqlQuery = 'INSERT INTO personas (nombres, apellidos, carnet) VALUES($1, $2, $3) RETURNING *';
        const values = [nombres, apellidos, carnet];

        const {rows} = await pool.query(sqlQuery, values);
        res.status(201).json(rows[0]);
    }catch (error){
        if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya se encuentra registrado.' });
    }
    // Para cualquier otro error, enviamos un error 500
    console.error('Error al insertar el usuario:', error.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.listen(port, ()=>{
    console.log(`servidor activo en el puerto: ${port}`)
})
