import React from "react";

const Button: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <button className=" bg-gray-500 rounded-xl shadow-2xl py-2 px-6">
      {props.children}
    </button>
  );
};

export default Button;