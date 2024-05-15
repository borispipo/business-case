const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/***
    handle request error
*/
const handleError = (e,res)=>{
    const status = typeof e?.status =='number' ? e.status : 500;
    const r = {message:typeof(e) =='string' && e? e : e && (e?.message) || e?.toString()||null,status};
    if(process.env.NODE_ENV !== "production"){
        console.log(e,`error gnenerated on handling request`)
    }
    if(res && typeof res?.json =="function" && typeof res?.status =="function"){
        return res.status(status).json(r);
    }
    return r;
}

module.exports = {
    handleError,
    /***
        handle de la requête Get qui retourne toutes les données associées au model Model
        @param {Object} Model, le model crée à l'aide de la méthode factory de /models/factory
    */
    get : (Model)=>{
        return async(req,res)=>{
            try {
                const data = await Model.find().exec();
                res.json(data);
            } catch(e){
                handleError(e,res);
            }
        }
    },
        
    /***
    handle de la requête getOne permettant de retourner un élément dont le model est passé en paramètre
        @param {Object} Model, le model crée à l'aide de la méthode factory de /models/factory
    */
    getOne : (Model)=>{
        return async (req,res)=>{
            try {
                const data = await Model.getOne(req.params.id);
                return res.json(data);
            } catch(e){
                return handleError(e,res);
            }   
        }
    },
    
    /***
        handle de la requête POST, qui crère un nouveau document via le model passé en paramètre
        @param {Object} Model, le model crée à l'aide de la méthode factory de /models/factory
    */
    post : (Model,options)=>{
        return async (req,res)=>{
            options = Object.assign({},options);
            const {beforeInsert} = options;
            try {
                if(typeof beforeInsert ==='function'){
                    await beforeInsert(Object.assign({},req.body),req,res);
                }
                const id = new ObjectId();
                await Model.upsert({[Model.primaryKey]:id},req.body);
                const data = await Model.getOne(id);
                if(typeof options.afterInsert =="function"){
                    await options.afterInsert(data,req,res);
                }
                return res.json(data);
            } catch(e){
                return handleError(e,res);
            }
        }
    },
    
    /***
        handle de la requête PUT, qui modifie un document via le model passé en paramètre
        @param {Object} Model, le model crée à l'aide de la méthode factory de /models/factory
    */
    put : (Model,options)=>{
        return async (req,res)=>{
            try {
                const primaryKeyValue = req.params.id;
                if((!primaryKeyValue || typeof primaryKeyValue != "string") && !(primaryKeyValue instanceof ObjectId)){
                    throw {message : "Impossible de mettre à jour le document, Merci de spécifier une valeur de l'id valide"};
                }
                options = Object.assign({},options);
                const toUpdate = Object.assign({},req.body);
                if(typeof options.beforeUpdate =="function"){
                    await options.beforeUpdate(toUpdate,req,res);
                }
                const data = await Model.upsert({[Model.primaryKey]:primaryKeyValue},toUpdate,{runValidators:true}).exec();
                if(typeof options.afterUpdate =="function"){
                    await options.afterUpdate({data:Object.assign({},req.body),result:data,[Model.primaryKey]:primaryKeyValue},req,res);
                }
                return res.json(data);
            } catch(e){
                return handleError(e,res);
            }
        }
    },
    
    /***
        handle de la requête POST, qui supprime un nouveau document via le model passé en paramètre
        @param {Object} Model, le model crée à l'aide de la méthode factory de /models/factory
    */
    delete : (Model,options)=>{
        return async (req,res)=>{
            options = Object.assign({},options);
            try {
                if(typeof options.beforeDelete =="function"){
                    await options.beforeDelete(req,res);
                }
                const data = await Model.delete(req.params.id);
                if(typeof options.afterDelete ==="function"){
                    await options.afterDelete(data,req,res);
                }
                return res.json(data);
            } catch(e){
                return handleError(e,res);
            }   
        }
    },
};