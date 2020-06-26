'use strict'
var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
var controller = {
    
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en FRAMEWORK JS',
            autor: 'Victor Robles WEB',
            url: 'victorroblesweb.com',
            hola,
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        var params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        }
        catch(error){

            return res.status(200).send({
                message: 'Disculpa, pero hubo un error'
            })
        }
        if(validate_title && validate_content){
            var article = new Article();

            //asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //guardar articulo
            article.save((error, articleStored)=>{
                if(error || !articleStored){
                    return res.status(404).send({
                            status: 'error',
                            message: 'El articulo no se ha guardado!!!'
                    });
                }
                 //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
            })
            });
           
        }
        else {
            return res.status(200).send({
                message: 'Los datos no son validos'
            })
        }
       
    },
    getArticles:(req, res) => {
        var last  = req.params.last;
        var query =  Article.find({});
        if(last || last != undefined){
            query.limit(1);
        }
       query.sort('-id').exec((err, articles)=>
        {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos!!!'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status: 'success',
                    message:'No hay articulos para mostrar!!!'
                }); 
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        }
        );
    },
    getArticle: (req, res) => {
        var articleId = req.params.id;
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'bad request',
                message:'no existe el articulo'
            });
        }
        Article.findById(articleId, (err, article)=>
        {
            
            if(err || !article){
                return res.status(404).send({
                    status: 'success',
                    message:'No existe el articulo!!!'
                }); 
            }
            return res.status(200).send({
                status: 'success',
                article
            });
        });
        
    },
    updateArticle: (req, res) => {
        var articleId = req.params.id;
        var params = req.body;
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        }
        catch(error){
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            })
        }
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'bad request',
                message:'introduz un id valido'
            });
        }
        try {
            if(validate_content && validate_title){
                Article.findByIdAndUpdate(articleId, 
                    {
                        title: params.title,
                        content: params.content
                    }).exec();
                    return res.status(200).send({
                        status: 'success',
                        message: 'Articulo actualizado con exito'
                    });
            }
            else {
                return res.status(200).send({
                    status: 'success',
                    message: 'la validación no es correcta'
                });
            }
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar el articulo!!!'
            });
        }
       
        
    },
    deleteArticle: (req, res) => {
        var articleId = req.params.id;
        var params = req.body;
        
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'bad request',
                message:'introduz un id valido'
            });
        }
        try {
         
                Article.findByIdAndRemove(articleId).exec();
                return res.status(200).send({
                    status: 'success',
                    message: 'Articulo eliminado con exito'
                });
          
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar el articulo!!!'
            });
        }
       
    },
    upload: (req, res) => {
        var file_name = 'image no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.files.image.path;
    
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        }
        else {
            try {
                var articleId = req.params.id;
                Article.findByIdAndUpdate(articleId, {image: file_name}).exec();
                return res.status(200).send({
                    status: 'success',
                    article: file_name
                });
            } catch (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al guardar la imagen',
                    error
                });
            }
            
        }
       
        
    },
    download: (req, res) => {
        var articleId = req.params.id;
        try {
            Article.findById(articleId, (err, article)=>
            {
                
                if(err || !article){
                    return res.status(404).send({
                        status: 'success',
                        message:'No existe el articulo!!!'
                    }); 
                }
                var path_file = './upload/articles/'+article.image;
                
                    fs.exists(path_file, (exists) => {
                        if(exists){
                            return res.sendFile(path.resolve(path_file));
                        }
                        else {
                            return res.status(404).send({
                                status: 'error',
                                message: '¡La imagen no existe!'
                            })
                        }
                    });
            
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: error
            });
        }
     
       
    },
    search: (req, res) => {

        var searchString = req.params.search;
        Article.find({
            '$or': [
                {"title": {'$regex': searchString, "$options": 'i'}},
                {"content": {'$regex': searchString, "$options": 'i'}}
            ]
        }).sort([['date', 'descending']])
            .exec((err, articles)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }
                if(!articles || articles.length === 0){
                    return res.status(200).send({
                        status: 'success',
                        message: 'No existen articulos para mostrar, que coincidan con la busqueda'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
                
            });

    }

}
module.exports = controller;