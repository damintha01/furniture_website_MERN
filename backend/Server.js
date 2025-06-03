const express=require('express'); 
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();

const app=express();

const PORT=process.env.PORT || 5050; 

app.use(cors()); 
app.use(bodyParser.json()); 
 
const URL=process.env.MONGODB_URL; 

mongoose.connect(URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>console.log("MongoDB connected")).catch((err)=>console.log(err)); 

const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB connection success");
});




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}); 




