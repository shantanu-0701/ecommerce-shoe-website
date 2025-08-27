const express = require('express');
const router = express.Router();
const ownerModel = require('../models/ownermodel');

if(process.env.NODE_ENV==='development')
{
    router.post('/create',async (req,res)=>{
       let owners = await ownerModel.find();
       if(owners.length > 0){
        return res.status(302).send('you dont have authority !!');
       }
       let {fullname,email,password}=req.body;
       let createdowner=await ownerModel.create({
            fullname,
            email,
            password
        }
       )
       res.status(200).send(createdowner);
    })
}

router.get('/admin', (req, res) => {
    res.render('createproducts');
});

module.exports = router;
