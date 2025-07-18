import mongoose from "mongoose";


let initialize = false;

const connect = async () => {
  try {

    if(initialize){
        console.log("mongodb already connected");
        return
    };

    const uri = process.env.MONGODB_URI
    if(!uri){
        throw new Error("No mongodb string found")
    };
    
    const  connected = await mongoose.connect(uri);
    if(connected){
        initialize = true;
        console.log("mongodb connected successfully")
    }

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to connect to mongo";
    console.log(`Connection Error:${message}`);
    return new Response(`Connection Error:${message}`, { status: 500 });
  }
};

export default connect;

