const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MONGODB conncted on ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
// async로 바꿔쓸 수도 있다. 그렇게 하면 async 대신 function 써줘야 됨
// module.exports = function(mongoose){}하고 app에서 mongoose define
