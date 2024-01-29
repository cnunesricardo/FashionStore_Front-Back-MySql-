const dbConnection = require('./conn');

const getProducts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products';

        dbConnection.query(query, (err, results) => {
            if(err){
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

const searchProducts = (searchTerm) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE product_title LIKE ? OR product_description LIKE ?';
        const searchTermLike =  `%${searchTerm}%`;

        dbConnection.query(query, [searchTermLike, searchTermLike], (err, results) => {
            if(err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

const getProductById = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT products.product_id, products.product_title, products.product_price, products.product_description, products.product_image, products.product_rate, products.product_count, categories.category_name, categories.category_id
        FROM products 
        INNER JOIN categories 
        ON products.category_id = categories.category_id
        WHERE products.product_id = ?;`

        dbConnection.query(query, [productId], (err, result) => {
            if(err){
                reject(err)
            } else {
                if(result.length > 0){
                    resolve(result[0])
                } else {
                    resolve(null) 
                }
            }
        })

    })  
}

const getProductsWithCategories = () => {
    return new Promise((resolve, reject) => {
        const query = 
        `SELECT products.product_id, products.product_title, products.product_price, products.product_description, products.product_image, products.product_rate, products.product_count, categories.category_name
        FROM products INNER JOIN categories 
        ON products.category_id = categories.category_id
        ORDER BY product_id;`

        dbConnection.query(query, (err, result) => {
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        })
    });
}

const getProductsPaginated = (startIndex, pageSize) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products ORDER BY product_title LIMIT ?, ?';
        const values = [startIndex, pageSize];

        dbConnection.query(query, values, (err, result) => {
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const deleteProductsByCategoryId = (category_id) => {
    return  new Promise((resolve, reject) => {
        const query = 'DELETE FROM products WHERE category_id = ?';
        
        dbConnection.query(query, [category_id], (err, result) => {
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const createProduct = (
    product_title, 
    product_price,
    product_description,
    product_image,
    product_rate,
    product_count,
    category_id
) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO products (product_title, product_price, product_description, product_image, product_rate, product_count, category_id) VALUES (?,?,?,?,?,?,?)`;
        VALUES = [
            product_title, 
            product_price,
            product_description,
            product_image,
            product_rate,
            product_count,
            category_id
        ];

        console.log("DataProduct")
        console.log(product_title, product_price, product_description, product_image, product_rate, product_count, category_id)



        dbConnection.query(query, VALUES, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result)
            }
        })
    })
}

const updateProduct = (
    product_title, 
    product_price,
    product_description,
    category_id,
    product_id
) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE products 
                            SET product_title = ?,
                                product_price = ?,
                                product_description = ?,
                                category_id = ?
                            WHERE product_id = ?`;
        const values = [
            product_title, 
            product_price,
            product_description,
            category_id,
            product_id
        ];

        console.log("DataProductUpdate")
        console.log(product_title, product_price, product_description, category_id, product_id)



        dbConnection.query(query, values, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result)
            }
        })
    })
}

const updatePhoto = (
    product_image,
    product_id,
    product_oldimage
) => {
    return new Promise((resolve, reject) => {
        const fs = require ("fs");
        const path = require('path');
        const currentPath = process.cwd();
        const rootPath = `${currentPath}/.`;
        const fileToDelete=path.join(rootPath, 'public/upload', product_oldimage)
        
        
        const query = "UPDATE products SET product_image = ? WHERE product_id = ?"
        const values = [product_image, product_id];

        console.log("DataPhotoUpdate")
        console.log(product_image, product_id, product_oldimage)

        dbConnection.query(query, values, (err, result) => {
            if(err){
                reject(err);
                console.log(err)
            } else {
                console.log(product_oldimage)
                fs.unlink(fileToDelete, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully:', fileToDelete);
                    }
                });                
                resolve(result)
            }
        })
    })
}



const deleteProduct = ( product_id, product_image ) => {
    return new Promise((resolve, reject) => {
        const fs = require ("fs");
        const path = require('path');
        const query = 'DELETE FROM products WHERE (product_id = ?)';
        const values = [ product_id ];
        const currentPath = process.cwd();
        const rootPath = `${currentPath}/.`;
        const fileToDelete=path.join(rootPath, 'public/upload', product_image)
                
        dbConnection.query(query, values, (err, result) => {            
            if(err){
                reject(err);
            } else {
                fs.unlink(fileToDelete, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully:', fileToDelete);
                    }
                });                
                resolve(result)
            }
        })
    })
}


module.exports = {
    getProducts,
    getProductById,
    getProductsWithCategories,
    getProductsPaginated,
    deleteProductsByCategoryId,
    createProduct,
    searchProducts,
    updateProduct,
    deleteProduct,
    updatePhoto
}   