// import { Protect } from "@clerk/nextjs";
import React, { FC } from "react";

const DashboardLayout: FC<{ children: React.ReactNode }> = (props) => {
  return (
    //Protect component doesnt load anything if you aint loggedIn. It just basically stops the children from rendering.Theres a much better method, to redirect them back if the aint logged in using the middleware file.

    // <Protect>
    //   <div>{props.children}</div>
    // </Protect>

    <div>{props.children}</div>
  );
};

export default DashboardLayout;
