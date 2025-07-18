import User from "../models/user";
import connect from "../db/connect";

export const createOrUpdateUser =async ()=>{
    try{
        await connect();
        const user =await User.findOneAndUpdate(
            // {clerkId:},
            // {
            //     $set:{
            //         first_name:,
            //         last_name:,
            //         email:,
            //         image_url:,
            //     }
            // },
            {upsert:true,new:true}
        )
    }catch(error){
        const message = error instanceof Error ?error.message:"something went wrong";
        console.log(`Error createOrUpdateUser:`,message);
        return new Response(`Error createOrUpdateUser:${message}`,{status:500})
    };
} 