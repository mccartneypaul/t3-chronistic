import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import Button from "@mui/material/Button";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chronistic</title>
        <meta name="description" content="A story tracking tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Chronistic
          </h1>
          <p className="text-3xl text-white">A story tracking tool</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && (
        <>
          <span className="text-center text-2xl text-white">
            Logged in as {sessionData.user?.name}
          </span>
          <p className="text-2xl text-white">
            Get started creating your world with Chronistic!
          </p>
          <Button variant="contained">
            <Link href="/world">Get started!</Link>
          </Button>
        </>
      )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
