"use client";

import React, { useState } from "react";
import Card from "../../components/ui/card/Card";
import Button from "../../components/ui/button/Button";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// import { SignUp } from "@clerk/clerk-react";

export default function RegisterComponent() {
  const { isLoaded, signUp, setActive } = useSignUp();
  //isLoaded checks if clerks been loaded or not.When clerk is loaded then it turns true
  //signUp takes up the data we submit to clerk:name,email,password
  // setActive is used to log in the user after conditions are met
  const { signIn } = useSignIn();
  const {signOut} = useClerk();

  const [enteredName, setEnteredName] = useState<string>("");
  const [enteredEmail, setEnteredEmail] = useState<string>("");
  const [enteredPassword, setEnteredPassword] = useState<string>("");
  const [errorMessage,setErrorMessage] = useState<string>("");

  const [haveAccount, setHaveAccount] = useState(false);
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const switchAuthModeHandler = () => {
    setHaveAccount((currentState) => !currentState);
  };

  const enteredNameOnChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredName(e.target.value);
  };

  const enteredEmailOnchangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredEmail(e.target.value);
  };

  const enteredPasswordOnchangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredPassword(e.target.value);
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (haveAccount) {
          //👇👇================ Login=========================👇👇
        if (
          enteredEmail.trim().length === 0 ||
          enteredPassword.trim().length === 0
        ) {
          return console.log("input fields shouldn't be empty");
        }

        try {
          const signInAttempt = await signIn?.create({
            password: enteredPassword,
            identifier: enteredEmail,
          });

          if (signInAttempt?.status === "complete") {
            await setActive!({ session: signInAttempt.createdSessionId });
            router.push("/dashboard");
          } else {
            console.log("signInAttemp:", signInAttempt);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "something went wrong";
          console.log("signIn Error:", message);
        }
      } else {
        //👇👇================ Register=========================👇👇

        if (
          enteredName.trim().length === 0 ||
          enteredEmail.trim().length === 0 ||
          enteredPassword.trim().length === 0
        ) {
          setErrorMessage("input fields shouldn't be empty")
          return console.log("input fields shouldn't be empty");
        }

        try {
          await signUp?.create({
            username: enteredName,
            emailAddress: enteredEmail,
            password: enteredPassword,
          });
          await signUp?.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setVerify(true);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "something went wrong";
          console.log("signUp Error:", message);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "something went wrong";
      console.log("error:", message);
    } finally {
      //   setIsSending(false);
      setEnteredName("");
      setEnteredEmail("");
      setEnteredPassword("");
    }

    console.log(enteredName);
    console.log(enteredEmail);
    console.log(enteredPassword);
  };
  // 👇👇VERIFICATION FUNCTION===============================👇👇
  const onHandleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt?.status === "complete") {
        // await setActive!({ session: signUpAttempt.createdSessionId });
        // router.push("/dashboard")

        //📒📒📒 Immediately end the session Clerk just created:
        // Clerk auto-creates a session when signup completes → user is technically logged in.
        // By calling signOut() right after verification, you clear that session.📒📒📒
      
        await signOut({ redirectUrl: "/custom-signin" });
        setHaveAccount(true);
        setVerify(false);
      } else {
        console.log("signUpAttemp:", signUpAttempt);
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

  return (
    <div className="max-w-xl mx-auto">
      <Card>
      {errorMessage&&<p className="bg-red-600 text-white p-2 text-center">{errorMessage}</p>}
        {/* {haveAccount ? "Login" : "Register"} */}
        {haveAccount ? (
          <p className="text-center">Login</p>
        ) : (
          <p className="text-center">Register</p>
        )}
        {verify ? (
          <form onSubmit={onHandleVerification}>
            <div className="mb-2 flex flex-col">
              <label htmlFor="" className="p-2">
                Code
              </label>
              <input
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
                value={code}
                placeholder="verification-code"
                name="code"
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="text-center">
              <Button>Submit</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSubmitHandler} className="p-4">
            {haveAccount ? (
              ""
            ) : (
              <div className="mb-2 flex flex-col">
                <label htmlFor="" className="p-2">
                  Name
                </label>
                <input
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  value={enteredName}
                  placeholder="please enter your name"
                  onChange={enteredNameOnChangeHandler}
                />
              </div>
            )}

            <div className="mb-2 flex flex-col">
              <label htmlFor="" className="p-2">
                Email
              </label>
              <input
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
                value={enteredEmail}
                placeholder="example@email.com"
                onChange={enteredEmailOnchangeHandler}
              />
            </div>
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
            <div className="text-center">
              <Button>Submit</Button>
            </div>
            {/* CAPTCHA target element */}
            <div id="clerk-captcha"></div>
            <div className="">
              <p onClick={switchAuthModeHandler}>
                {haveAccount
                  ? "create new account"
                  : "log in with existing account"}
              </p>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
