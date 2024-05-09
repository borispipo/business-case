const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/****
    Crèe un model Mongoose avec des méthodes bien définies et essentielles
    @param {string} schemaName, le nom du schema mongoose
    @param {mongoose.Schema}, le schema mongoose
    @param {string} primaryKey, le nom de la clé primaire du model
    @param {boolean} deleteId, spécifie si le champ _id sera supprimé des données sauvegardées
    @retun {instance of MongooseModel}
*/
module.exports = function(schemaName,Schema,primaryKey, deleteId){
    if(deleteId !== false){
        Schema.set('toJSON', {
            virtuals: true,
            versionKey:false,
            transform: function (doc, ret) {delete ret._id;delete ret.__v; }
        });
    }
    const Model = mongoose.model(schemaName,Schema);
    /****@see : https://mongoosejs.com/docs/api/model.html#Model.updateOne() */
    /****
        upsert data to model
        Usage : Model.upsert(packageId<string |ObjectId>, {...dataToUpsert},options)
                : Model.pusert({[primaryKey]:aString<string|ObjectId>,...rest},{...dataToUpsert},options);
        @param {object | string | ObjectId} condition
        @param {object} dataToUpsert
        @param {object} options
        @param {Array}, ...rest,
    */
    const upsert = Model._upsert = Model.upsert = (condition,dataToUpsert,options,...rest)=>{
        options = Object.assign({},options);
        options.upsert = typeof options.upsert =="boolean"? options.upsert : true;
        options.runValidators = typeof options.runValidators =="boolean" ? options.runValidators : true;
        if(typeof condition =="string" && condition || condition instanceof ObjectId){
            condition = {[primaryKey] : condition};
        } else condition = Object.assign({},condition);
        return Model.updateOne(condition,dataToUpsert,options,...rest);
        
    }  
    /***
        Fait un upsert dans la collection liée au model 
        @param {string | ObjectId} primaryKeyValue, la valeur de la clé primaire associée au model
        @return {Promise<Object>}
    */
    Model.upsertById = (primaryKeyValue,...rest)=>{
        return upsert({[primaryKey]:primaryKeyValue},...rest);
    }
    /***
        retourne l'unique donnée dont la clé primaire est passée en paramètre
        @param {string | ObjectId} primaryKeyValue, la valeur de la clé primaire associée au model
    */
    Model.getOne = (primaryKeyValue)=>{
        return Model.findOne({[primaryKey]:primaryKeyValue}).exec();
    }
    /****
        Supprime le document dont la valeur de la clé primaire est passée en paramètre
        @param {String | ObjectId}, primaryKeyValue, la valeur de la clée primaire
        @return <Promise>
    */
    Model.delete = (primaryKeyValue)=>{
        return Model.deleteOne({ [primaryKey]: primaryKeyValue});
    }
    Model.count = (...options)=> Model.estimatedDocumentCount(...options);
    Model.schemaName = schemaName;
    Model.primaryKey = primaryKey;
    return Model;
}