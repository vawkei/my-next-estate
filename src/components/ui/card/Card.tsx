"use client";

import React from "react";

const Card:React.FC<{children:React.ReactNode}> = (props) => {
    return ( 
        // <div className="bg-gray-400 shadow-md rounded-3xl p-4 min-w-64 min-h-60" >
        <div className="bg-white shadow-2xl rounded-3xl p-4 min-w-32 min-h-60" >
            {props.children}
        </div>
     );
}
 
export default Card;