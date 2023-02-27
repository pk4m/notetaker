import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";
import { Header } from "~/components/Header";
import { type Topic } from "@prisma/client";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="An app to take notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic|null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}  
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="divider"></div>
        <input 
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};