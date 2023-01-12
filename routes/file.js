

const multer=require('multer');
const express=require('express')
const file = require("../models/file")
const  userAuth =require( "../middleware/userAuthorize")
const fs=require('fs')
const router = new express.Router()

//Multer Config 

 // Added to create directories
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //Create diretories
    fs.mkdir('./uploads/',(err)=>{
       cb(null, './uploads/');
    });
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500
  },
  fileFilter: fileFilter
});

//------------------------------------------------------------------------


router.post("/file/add", userAuth ,upload.single("docFile"),  async (req, res) => {

    const Id = req.user._id;
    const file1 = new file({
        name:req.body.name,
        docFile:req.file.path,
        userId:Id
    })
  
    try {
      const savedfile = await file1.save();
      res.status(200).json(savedfile);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });


router.get("/file/getAll", userAuth ,async (req,res)=>{
 
    try {
        const files = await file.find({userId:req.user._id});
        res.status(200).json(files);
      } catch (err) {
        res.status(500).json(err.message);
      }
})


router.get("/file/getOne/:id",userAuth, async (req, res) => {
    try {
      const res_file = await file.findOne({_id:req.params.id, userId:req.user._id});
      res.status(200).json(res_file);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });


router.put("/file/update/:id",userAuth,upload.single("docfile"),async(req,res)=>{

    try{
      
        if(req.file.path)
        {
            const newFile= req.file.path
            try{
            const res= await file.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{
                $set:{docFile:newFile}},{new:true})
            }catch (err) {
                res.status(500).json(err.message);
              }
        }
        const updatedfile = await file.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedfile);

    }catch (err) {
        res.status(500).json(err.message);
      }
})


router.delete("/file/delete/:id", userAuth, async (req, res) => {
    try {
      await file.findOneAndDelete({_id:req.params.id, userId:req.user._id});
      res.status(200).json(" deleted.");
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

module.exports = router
//export { router as fileRouter }