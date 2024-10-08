const Product = require('../models/product.model');

const sanitize = require('mongo-sanitize');

async function getAllProducts(req, res, next) {
	try {
		let products;
		let searchQuery = req.query.search || ''; 

		if(searchQuery) {
			searchQuery = sanitize(searchQuery);
			products = await Product.search(searchQuery);

		} else {
			// DB내의 키-값 쌍이, Product 클래스의 파라미터로 들어가, 각각의 객체 정보 생성
			products = await Product.findAll();
		}

		products.forEach(product => {
			product.formattedPrice = product.formatPrice();
		});
		res.render('customer/products/all-products', {products: products, searchQuery: searchQuery});

	} catch (error) {
		error.code = 500;
		next(error);		
	};
};

async function getProductDetails(req, res, next) {
	try {
		let product = await Product.findById(req.params.id);
		// 한국 화폐로 표시
		product.formattedPrice = product.formatPrice();
		res.render('customer/products/product-details', {product: product});
	} catch (error) {
		error.code = 404;
		next(error);
	};
	// console.log(product);
}



module.exports = {
	getAllProducts: getAllProducts,
	getProductDetails: getProductDetails
};