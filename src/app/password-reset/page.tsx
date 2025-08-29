"use client";

import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PasswordReset = () => {
  const { isSignedIn } = useAuth();
  //👆this tells us if the user is signin or not. the user shouldnt be signed in if he wants to reset his password.
  const { isLoaded, signIn, setActive } = useSignIn();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulVerification, setSuccessfulVerification] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  const enteredEmailOnChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredEmail(e.target.value);
  };

  const enteredPasswordOnchangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredPassword(e.target.value);
  };

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn
        ?.create({
          strategy: "reset_password_email_code",
          identifier: enteredEmail,
        })
        .then(() => {
          setSuccessfulVerification(true);
        });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "verification error";
      console.log("verify error", message);
    }
  };
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: enteredPassword,
      });
      if (response?.status === "complete") {
        // router.push("/custom-signin")
        setActive!({ session: response.createdSessionId });
        // router.push("/dashboard");
        setIsActive(true);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "verification error";
      console.log("verify error", message);
    }
  };

  if (!isLoaded) {
    return null;
  }

  // if (isSignedIn) {
  //   router.push("/dashboard");
  // }
  if (isActive) {
    return (
      <div>
        <h1 className="bg-orange-400 text-center">You have been LoggedIn</h1>
      </div>
    );
  }

  //   useEffect(() => {
  //   if (isActive) {
  //     //router.push("/dashboard");
  //     <div>
  //       <h1>You have been LoggedIn</h1>
  //     </div>
  //   }
  // }, [isActive]);

  if (!isSignedIn) {
    return (
      <div className="max-w-xl mx-auto">
        <Card>
          {!successfulVerification ? (
            <>
              <form action="" onSubmit={verifyEmail}>
                <div className="mb-2 flex flex-col">
                  <label htmlFor="" className="p-2">
                    Email:
                  </label>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    name="identifier"
                    value={enteredEmail}
                    placeholder="please enter your email"
                    onChange={enteredEmailOnChangeHandler}
                  />
                </div>
                <div className="text-center">
                  <Button>Verify</Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <form action="" onSubmit={handleReset}>
                <div className="mb-2 flex flex-col">
                  <label htmlFor="" className="p-2">
                    Password
                  </label>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    value={enteredPassword}
                    placeholder="************"
                    onChange={enteredPasswordOnchangeHandler}
                  />
                </div>
                <div className="mb-2 flex flex-col">
                  <label htmlFor="" className="p-2">
                    Code
                  </label>
                  <input
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    value={code}
                    name="code"
                    placeholder="code"
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <Button>Reset</Button>
                </div>
              </form>
            </>
          )}
          <div></div>
        </Card>
      </div>
    );
  }
};

export default PasswordReset;
