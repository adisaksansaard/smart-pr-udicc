"use client";

import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "./lib/firebase";

export default function Home() {

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [newsList, setNewsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // เพิ่มข่าว
  // =========================

  const handleSubmit = async () => {

    if (!title || !detail) {
      alert("กรุณากรอกข้อมูล");
      return;
    }

    try {

      setLoading(true);

      let imageUrl = "";

      // =========================
      // Upload Image
      // =========================

      if (imageFile) {

        const imageRef = ref(
          storage,
          `news/${Date.now()}-${imageFile.name}`
        );

        await uploadBytes(imageRef, imageFile);

        imageUrl = await getDownloadURL(imageRef);
      }

      // =========================
      // Save Firestore
      // =========================

      await addDoc(collection(db, "news"), {
        title,
        detail,
        imageUrl,
        createdAt: new Date(),
      });

      setTitle("");
      setDetail("");
      setImageFile(null);

      fetchNews();

      alert("บันทึกข่าวสำเร็จ");

    } catch (error) {

      console.error(error);
      alert("เกิดข้อผิดพลาด");

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // ดึงข่าว
  // =========================

  const fetchNews = async () => {

    try {

      const q = query(
        collection(db, "news"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNewsList(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // ลบข่าว
  // =========================

  const deleteNews = async (id: string) => {

    const confirmDelete = confirm("ต้องการลบข่าวนี้ใช่ไหม");

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "news", id));

      fetchNews();

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // โหลดข่าวครั้งแรก
  // =========================

  useEffect(() => {
    fetchNews();
  }, []);

  return (

    <main className="min-h-screen bg-black text-white p-6">

      <section className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black">
            Smart PR UDICC
          </h1>

          <p className="text-gray-400 mt-2">
            ระบบจัดการข่าวประชาสัมพันธ์
          </p>

        </div>

        {/* FORM */}

        <div className="bg-zinc-900 p-6 rounded-3xl space-y-4 border border-zinc-800">

          <input
            type="text"
            placeholder="หัวข้อข่าว"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
          />

          <textarea
            placeholder="รายละเอียดข่าว"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full h-40 p-4 rounded-2xl bg-white text-black outline-none"
          />

          {/* Upload Image */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
              }

            }}
            className="w-full bg-white text-black p-4 rounded-2xl"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-2xl font-bold text-lg"
          >
            {loading ? "กำลังบันทึก..." : "Generate ข่าวอัตโนมัติ"}
          </button>

        </div>

        {/* NEWS */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            ข่าวทั้งหมด
          </h2>

          <div className="grid gap-6">

            {newsList.length === 0 && (

              <div className="bg-zinc-900 p-10 rounded-3xl text-center text-gray-400">
                ยังไม่มีข่าว
              </div>

            )}

            {newsList.map((item) => (

              <div
                key={item.id}
                className="bg-white text-black p-6 rounded-3xl shadow-lg"
              >

                {/* Image */}

                {item.imageUrl && (

                  <img
                    src={item.imageUrl}
                    alt="news"
                    className="w-full h-72 object-cover rounded-2xl mb-5"
                  />

                )}

                <h2 className="text-2xl font-black">
                  {item.title}
                </h2>

                <p className="mt-3 text-lg whitespace-pre-wrap">
                  {item.detail}
                </p>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => deleteNews(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition"
                  >
                    ลบข่าว
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}