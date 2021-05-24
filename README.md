# HR-PROJECT CODE.ID BATCH#9


##  How to run this code
1. Pastikan postgres db running
2. Clone this repository
3. Update config/config.js sesuaikan dengan config local 
4. Open command line in the cloned folder, lalu exec command berikut :
   > yarn install
   > yarn start, untuk running/debug applikasi
   > yarn reverse:db, untuk reverse tables di db menjadi models
   
5. Test (http://localhost:3000/api/regions/) di postman
   
---- 

## Nodemon supaya bisa debug gunakan : 
### edit nodemon.json
{
    "verbose": false,
    "watch": [
      "./server"
    ],
    "exec" : "babel-node ./server/server.js"
},

### untuk built-up : 

{
    "verbose": false,
    "watch": [
      "./server"
    ],
    "exec": "webpack --mode=development --config webpack.config.server.js && node ./dist/server.generated.js"
}
