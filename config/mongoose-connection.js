const mongoose = require('mongoose');
const debug = require('debug')("development:mongoose");
const config = require('config');
mongoose
.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(()=>{
    debug('connected');
})
.catch((err)=>{
    console.log(err);
})
module.exports=mongoose.connection