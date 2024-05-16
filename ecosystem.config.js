module.exports = {
  apps : [
    {
        "name": "business-case",
        "script": "index.js",
        "cwd": "./",
    		env: {
    			NODE_ENV: 'development',
    			PORT : '3255',
    		},
    		env_production: {
    		  NODE_ENV: 'production',
    		  PORT : '3255',
    		}
	 }
  ],

};
