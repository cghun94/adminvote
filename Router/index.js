const express = require('express');
const app = express();

app.get('/',function(req,res){
    res.send('Hello Worle!');
});

app.listen(3000, function(){
    console.log('server start');
});