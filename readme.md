Environnement de développement

Créeer un fichier d'environnement `".env"` à la racine du projet puis y ajouter la variable d'environnement " MONGODB_URL, représentant l'url de la base de données mongo_db, encodant à la fois le nom d'utilisateur et le mot de pass de la forme : `mongodb+srv://{{username}}:{{password}}@{{host}}`

1.  Installation des packages : `npm install`
2.  Server API REST : `npm run start-server`
3.  Serve web-driver : `npm run serve-driver`
4.  Serve Web tracker : `npm run serve-tracker`
5.  Serve Web-admin : `npm run serve-admin`

**Environnemnet de production :**

1.  Build the main application : `npm run build`
2.  Build and start the application : `npm run start-prod`
3.  Build web-driver : `ng build web-driver`
4.  Build web-admin : `ng build web-admin`
5.  build web-tracker : `ng build web-tracker`

Access app url :

1.  web-admin : `{{host}}:{{port}}/web-admin`
2.  web-tracker : `{{host}}:{{port}}/web-tracker`
3.  web-driver : `{{host}}:{{port}}/web-driver`
