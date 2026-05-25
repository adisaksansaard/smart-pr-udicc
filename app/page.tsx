"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./lib/firebase";

export default function Home() {

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [newsList, setNewsList] = useState<any[]>([]);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "news"), {
        title,
        detail,
        createdAt: new Date(),
      });

      fetchNews();

      alert("บันทึกสำเร็จ");

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const fetchNews = async () => {
    const querySnapshot = await getDocs(
      collection(db, "news")
    );

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNewsList(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <section className="max-w-3xl mx-auto space-y-4">

        <h1 className="text-4xl font-bold">
          Smart PR UDICC
        </h1>

        <input
  type="text"
  placeholder="หัวข้อข่าว"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full border p-4 rounded-xl text-black bg-white"
/>

        <textarea
  placeholder="รายละเอียดข่าว"
  value={detail}
  onChange={(e) => setDetail(e.target.value)}
  className="w-full border p-4 rounded-xl h-40 text-black bg-white"
/>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-6 py-4 rounded-xl font-bold"
        >
          Generate ข่าวอัตโนมัติ
        </button>

        <div className="space-y-4 mt-10">

          {newsList.map((item) => (

            <div
              key={item.id}
              className="bg-white text-black p-4 rounded-xl"
            >
              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <p>{item.detail}</p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}