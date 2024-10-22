import mongoose from "mongoose";


export const Connection = async (username,password)=>{
    const URL = `mongodb+srv://${username}:${password}@entrevo.acjm3.mongodb.net/?retryWrites=true&w=majority&appName=Entrevo`;
    try{
        await mongoose.connect(URL,{useUnifiedTopology:true, useNewUrlParser : true});
        console.log('Database connected Successfully');
    }catch(error){
        console.log(`error while connecting with database`,error.message);
    }
}
export default Connection;  