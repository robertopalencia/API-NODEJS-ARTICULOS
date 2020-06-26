'use strict'

var express = require('express');

var ArticleController = require('../controllers/ArticleController')

var router = express.Router();
var multiparty = require('connect-multiparty');
var mpUpload = multiparty({uploadDir: './upload/articles'});
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-controlador', ArticleController.test);
router.post('/save', ArticleController.save);
router.post('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.updateArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.post('/upload-image/:id',mpUpload, ArticleController.upload);
router.get('/get-image/:id',mpUpload, ArticleController.download);
router.get('/search/:search', ArticleController.search);

module.exports = router;