const cors = require('cors')
const express = require('express')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const cartRoutes = require('./routes/cartRoutes')
var path = require('path');

const app = express();
const port = 3001;

app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve('./public/upload')));
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")))

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/carts', cartRoutes)

app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:' + port);
})
