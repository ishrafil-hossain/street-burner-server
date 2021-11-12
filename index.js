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
        const usersCollection = database.collection('users');
        // const productsCollection = database.collection('products');
        // const usersCollection = database.collection('users');
        // const adminCollection = database.collection('admin');

        app.get('/purchases', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = purchasesCollection.find(query);
            const purchases = await cursor.toArray();
            res.json(purchases);
        })

        app.post('/purchases', async (req, res) => {
            const purchase = req.body;
            const result = await purchasesCollection.insertOne(purchase);
            res.json(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result)
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
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