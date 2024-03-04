const express = require('express');
const bodyParser = require('body-parser');

const client = require('./connection');
const app = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');

client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database:', err);
    } else {
        console.log('Connected to the database');
    } 
});

//api  menu_makanan

// app.get('/api/menu_makanan', (req, res) => {
//     client.query('SELECT * FROM menu_makanan', (err, result) => {
//         if (!err) {
//             res.send(result.rows); // Mengirimkan hasil query sebagai respons
//         } else {
//             console.log(err.message);
//             res.status(500).send('Internal Server Error'); // Mengirimkan pesan kesalahan jika terjadi kesalahan
//         }
//     });
// });

app.post('/api/menu_makanan', (req, res) => {
    const newData = req.body;
    client.query('INSERT INTO menu_makanan (no, Title, description, price) VALUES ($1, $2, $3, $4)', [newData.no, newData.Title, newData.description, newData.price], (err, result) => {
        if (err) {
            console.error('Failed to add data to database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data added successfully');
            res.status(200).send('Data added successfully');
        }
    });
});

// Endpoint untuk mengupdate data menu makanan
app.put('/api/menu_makanan/up', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    client.query('UPDATE menu_makanan SET description = $1 WHERE no = $2', [updatedData.description, id], (err, result) => {
        if (err) {
            console.error('Failed to update data in database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data updated successfully');
            res.status(200).send('Data updated successfully');
        }
    });
});


// Endpoint untuk menghapus data menu makanan
app.delete('/api/menu_makanan/:id', (req, res) => {
    const id = req.params.id;
    client.query('DELETE FROM menu_makanan WHERE no = $1', [id], (err, result) => {
        if (err) {
            console.error('Failed to delete data from database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data deleted successfully');
            res.status(200).send('Data deleted successfully');
        }
    });
});


// Endpoint untuk mendapatkan daftar menu makanan
app.get('/api/menu', (req, res) => {
    client.query('SELECT * FROM menu_makanan', (err, result) => {
        if (!err) {
            const menuItems = result.rows.map(row => row.Title);
            res.send(menuItems);
        } else {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/api/lumpia', (req, res) => {
    // Query database untuk mendapatkan data
    client.query('SELECT * FROM menu_makanan', (err, result) => {
        if (!err) {
            console.log(result) // Buat HTML secara dinamis menggunakan template literals
            res.render('index',{data:result.rows})
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error'); // Mengirimkan pesan kesalahan jika terjadi kesalahan
        }
    });
});

// app.get('/api/menu_makanan', (req, res) => {
//     // Query database untuk mendapatkan data
//     client.query('SELECT * FROM menu_makanan', (err, result) => {
//         if (err) {
//             console.error('Failed to fetch menu data from database:', err);
//             return res.status(500).send('Internal Server Error');
//         }
        
//         // Jika query berhasil, kirimkan hasilnya ke halaman HTML
//         res.render('index', { menuItems: result.rows });
//     });
// });
// console.log = result ;

app.listen(3001, () => {
    console.log('Server running in port 3001');
});