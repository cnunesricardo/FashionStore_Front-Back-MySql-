const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/categoryController');


router.get('/', (req, res) => {
    categoryController.getCategories()
        .then((categoriesData) => {
            res.json(categoriesData)

        })
        .catch((error) => {
            res.status(500).send('Erro ao obter categorias!' + error)
        }) 

})

router.get('/categoriesOrderByName', (req, res) => {
    categoryController.categoriesOrderByName()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.status(500).send('Erro ao obter categorias ordenadas pelo nome. Detalhes: ' + error)
        })
})


router.post('/', (req, res) => {
    const {category_name} = req.body;
    console.log(req.body)
    categoryController.createCategory(category_name)
        .then((result) => {
            res.status(200).json({message: 'Categoria criada com sucesso! Id: ' + result.insertId})
        })
        .catch((error) => {
            res.status(500).send('Erro ao inserir categoria!' + error)
        })
})

router.delete('/:id', (req, res) => {
    const {category_id} = req.params.id;
    console.log(category_id)
    categoryController.deleteCategory(req.params.id)
        .then((result) => {
            res.status(200).send("Excluido com sucesso!")
        })
        .catch((error) => {
            res.status(500).send('Erro ao excluir categoria! ' + error)
        })
})

router.put('/', (req, res) => {

    console.log(req.body)

    const{category_name, category_id} = req.body;
    
    categoryController.updateCategory(category_name, category_id)
        .then((result) => {
            res.status(200).send("Update com sucesso!")
        })
        .catch((error) => {
            res.status(500).send('Erro ao atualizar categoria! ' + error)
        })
})

module.exports = router;