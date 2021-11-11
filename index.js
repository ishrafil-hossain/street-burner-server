const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6gag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        // console.log('database connnect successfully');
        const database = client.db('street_burner');
        const purchasesCollection = database.collection('purchases');
        // const productsCollection = database.collection('products');
        // const usersCollection = database.collection('users');
        // const adminCollection = database.collection('admin');

        app.post('/purchases', async (req, res) => {
            const purchase = req.body;
            const result = await purchasesCollection.insertOne(purchase);
            console.log(result);
            res.json({ message: 'hello' })
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello street-burner')
})

app.listen(port, () => {
    console.log(`Listening port :${port}`)
})