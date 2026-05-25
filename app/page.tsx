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
  deleteObject,
} from "firebase/storage";

import { db, storage } from "../lib/firebase";

export default function Home() {

  const [title, setTitle] = useState("");

  const [detail, setDetail] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [newsList, setNewsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // Upload News
  // =========================

  const handleSubmit = async () => {

    if (!title || !detail) {
      alert("กรุณากรอกข้อมูล");
      return;
    }

    try {

      setLoading(true);

      let imageUrl = "";

      // Upload Image

      if (image) {

        const imageRef = ref(
          storage,
          `news/${Date.now()}-${image.name}`
        );

        await uploadBytes(imageRef, image);

        imageUrl = await getDownloadURL(imageRef);
      }

      // Save Firestore

      await addDoc(collection(db, "news"), {

        title,

        detail,

        imageUrl,

        createdAt: new Date(),

      });

      setTitle("");

      setDetail("");

      setImage(null);

      setPreview("");

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
  // Fetch News
  // =========================

  const fetchNews = async () => {

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
  };

  // =========================
  // Delete News
  // =========================

  const deleteNews = async (
    id: string,
    imageUrl?: string
  ) => {

    const confirmDelete = confirm("ลบข่าวนี้ใช่ไหม");

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "news", id));

      // Delete image

      if (imageUrl) {

        const imageRef = ref(storage, imageUrl);

        await deleteObject(imageRef).catch(() => {});
      }

      fetchNews();

    } catch (error) {

      console.error(error);

    }
  };

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

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">

          <input
            type="text"
            placeholder="หัวข้อข่าว"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-2xl text-black bg-white"
          />

          <textarea
            placeholder="รายละเอียดข่าว"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full h-40 p-4 rounded-2xl text-black bg-white"
          />

          {/* Upload */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file = e.target.files?.[0];

              if (file) {

                setImage(file);

                setPreview(URL.createObjectURL(file));
              }
            }}
            className="w-full"
          />

          {/* Preview */}

          {preview && (

            <img
              src={preview}
              alt="preview"
              className="w-full h-72 object-cover rounded-2xl"
            />

          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold text-lg transition"
          >
            {loading ? "กำลังบันทึก..." : "Generate ข่าวอัตโนมัติ"}
          </button>

        </div>

        {/* NEWS */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            ข่าวทั้งหมด
          </h2>

          <div className="grid gap-8">

            {newsList.map((item) => (

              <div
                key={item.id}
                className="bg-white text-black rounded-3xl overflow-hidden shadow-lg"
              >

                {/* Image */}

                {item.imageUrl && (

                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-80 object-cover"
                  />

                )}

                <div className="p-6">

                  <h2 className="text-3xl font-black">
                    {item.title}
                  </h2>

                  <p className="mt-4 text-lg whitespace-pre-wrap">
                    {item.detail}
                  </p>

                  <button
                    onClick={() =>
                      deleteNews(item.id, item.imageUrl)
                    }
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition"
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