import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("<<<<<   ✅  Connection To DB    >>>");
  } catch (error) {
    console.log("<<<<<   ❌ Failed  Connection To DB    >>>");
    process.exit(1);
  }
};
export default connectDB;
