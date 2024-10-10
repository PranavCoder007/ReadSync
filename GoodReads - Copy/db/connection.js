const mongoose=require('mongoose')

// const url ="mongodb+srv://adityaatlasproject:spit1513@cluster0.o8lhvxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB=(url)=>{
  return mongoose
   .connect(url)
   .then(() => {
      console.log("Connected to the mongodb database");
    })
   .catch((error) => {
      console.log(error.name);
    });
}

module.exports = connectDB;