"use client";

import { useState, useEffect, useRef } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { db, storage } from "./lib/firebase";

export default function Home() {

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [newsList, setNewsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState("red");

  const templateRef = useRef<HTMLDivElement>(null);

  // =========================
  // โหลดข่าว
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

  useEffect(() => {
    fetchNews();
  }, []);

  // =========================
  // เพิ่มข่าว
  // =========================

  const handleSubmit = async () => {

    if (!title || !detail || !image) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {

      setLoading(true);

      // upload image

      const imageRef = ref(
        storage,
        `news/${Date.now()}-${image.name}`
      );

      await uploadBytes(imageRef, image);

      const imageUrl = await getDownloadURL(imageRef);

      // save firestore

      await addDoc(collection(db, "news"), {
        title,
        detail,
        imageUrl,
        theme,
        createdAt: new Date(),
      });

      alert("บันทึกข่าวสำเร็จ");

      setTitle("");
      setDetail("");
      setImage(null);

      fetchNews();

    } catch (error) {

      console.error(error);

      alert("เกิดข้อผิดพลาด");

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // ลบข่าว
  // =========================

  const deleteNews = async (id: string) => {

    const confirmDelete = confirm(
      "ต้องการลบข่าวนี้ใช่ไหม"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "news", id));

      fetchNews();

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // แก้ไขข่าว
  // =========================

  const editNews = async (
    id: string,
    oldTitle: string,
    oldDetail: string
  ) => {

    const newTitle = prompt(
      "แก้ไขหัวข้อข่าว",
      oldTitle
    );

    const newDetail = prompt(
      "แก้ไขรายละเอียดข่าว",
      oldDetail
    );

    if (!newTitle || !newDetail) return;

    try {

      await updateDoc(doc(db, "news", id), {
        title: newTitle,
        detail: newDetail,
      });

      fetchNews();

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // EXPORT JPG
  // =========================

  const downloadJPG = async () => {

    if (!templateRef.current) return;

    const canvas = await html2canvas(
      templateRef.current,
      {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      }
    );

    const link = document.createElement("a");

    link.download = "newsletter.jpg";

    link.href = canvas.toDataURL(
      "image/jpeg",
      1.0
    );

    link.click();
  };

  // =========================
  // EXPORT PNG
  // =========================

  const downloadPNG = async () => {

    if (!templateRef.current) return;

    const canvas = await html2canvas(
      templateRef.current,
      {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      }
    );

    const link = document.createElement("a");

    link.download = "newsletter.png";

    link.href = canvas.toDataURL(
      "image/png"
    );

    link.click();
  };

  // =========================
  // EXPORT PDF
  // =========================

  const downloadPDF = async () => {

    if (!templateRef.current) return;

    const canvas = await html2canvas(
      templateRef.current,
      {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      }
    );

    const imgData = canvas.toDataURL(
      "image/png"
    );

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth = 210;

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save("newsletter.pdf");
  };

  // =========================
  // THEME COLOR
  // =========================

  const themeColor =
    theme === "red"
      ? "bg-red-700"
      : theme === "blue"
      ? "bg-blue-700"
      : "bg-yellow-600";

  return (

    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-5 mb-10">

          <img
            src="/logo.png"
            alt="logo"
            className="w-28 h-28 object-contain"
          />

          <div>

            <h1 className="text-6xl font-black">
              Smart PR UDICC
            </h1>

            <p className="text-zinc-400 mt-2 text-lg">
              ระบบจัดการข่าวประชาสัมพันธ์อัตโนมัติ
            </p>

          </div>

        </div>

        {/* FORM */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-[30px] p-8">

          <div className="grid gap-5">

            <input
              type="text"
              placeholder="หัวข้อข่าว"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full p-5 rounded-2xl text-black text-lg outline-none"
            />

            <textarea
              placeholder="รายละเอียดข่าว"
              value={detail}
              onChange={(e) =>
                setDetail(e.target.value)
              }
              className="w-full h-44 p-5 rounded-2xl text-black text-lg outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {

                if (e.target.files?.[0]) {
                  setImage(
                    e.target.files[0]
                  );
                }

              }}
              className="bg-white text-black rounded-2xl p-4"
            />

            {/* THEME */}

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setTheme("red")
                }
                className="bg-red-600 px-4 py-2 rounded-xl font-bold"
              >
                แดงขาว
              </button>

              <button
                onClick={() =>
                  setTheme("blue")
                }
                className="bg-blue-600 px-4 py-2 rounded-xl font-bold"
              >
                น้ำเงินขาว
              </button>

              <button
                onClick={() =>
                  setTheme("gold")
                }
                className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
              >
                ดำทอง
              </button>

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-5 text-xl font-bold flex items-center justify-center gap-3"
            >

              {loading && (

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              )}

              {loading
                ? "กำลังบันทึก..."
                : "Generate ข่าวอัตโนมัติ"}

            </button>

          </div>

        </div>

        {/* TEMPLATE */}

        <div
          ref={templateRef}
          className="mt-14 bg-white text-black rounded-[30px] overflow-hidden shadow-2xl"
        >

          {/* TOP */}

          <div
            className={`${themeColor} text-white p-10 flex items-center gap-5`}
          >

            <img
              src="/logo.png"
              alt="logo"
              className="w-24 h-24"
            />

            <div>

              <h2 className="text-5xl font-black">
                วิทยาลัยการอาชีพอุดรธานี
              </h2>

              <p className="text-xl mt-2">
                งานประชาสัมพันธ์
              </p>

            </div>

          </div>

          {/* CONTENT */}

          <div className="p-10">

            {image && (

              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-[500px] object-cover rounded-3xl"
              />

            )}

            <h1 className="text-5xl font-black mt-8 leading-tight">
              {title || "หัวข้อข่าว"}
            </h1>

            <p className="text-2xl leading-relaxed mt-6 whitespace-pre-wrap">
              {detail || "รายละเอียดข่าว"}
            </p>

          </div>

        </div>

        {/* EXPORT */}

        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={downloadJPG}
            className="bg-red-600 px-6 py-4 rounded-2xl font-bold"
          >
            ดาวน์โหลด JPG
          </button>

          <button
            onClick={downloadPNG}
            className="bg-blue-600 px-6 py-4 rounded-2xl font-bold"
          >
            ดาวน์โหลด PNG
          </button>

          <button
            onClick={downloadPDF}
            className="bg-green-600 px-6 py-4 rounded-2xl font-bold"
          >
            ดาวน์โหลด PDF
          </button>

        </div>

        {/* NEWS */}

        <div className="mt-20">

          <h2 className="text-4xl font-black mb-8">
            ข่าวทั้งหมด
          </h2>

          <div className="grid gap-8">

            {newsList.length === 0 && (

              <div className="bg-zinc-900 p-16 rounded-3xl text-center text-zinc-400 text-xl">
                ยังไม่มีข่าว
              </div>

            )}

            {newsList.map((item) => (

              <div
                key={item.id}
                className="bg-white text-black rounded-3xl overflow-hidden"
              >

                {item.imageUrl && (

                  <img
                    src={item.imageUrl}
                    alt="news"
                    className="w-full h-[350px] object-cover"
                  />

                )}

                <div className="p-8">

                  <h3 className="text-4xl font-black">
                    {item.title}
                  </h3>

                  <p className="text-xl mt-4 whitespace-pre-wrap">
                    {item.detail}
                  </p>

                  <div className="mt-6 flex gap-3 flex-wrap">

                    <button
                      onClick={() =>
                        editNews(
                          item.id,
                          item.title,
                          item.detail
                        )
                      }
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() =>
                        deleteNews(item.id)
                      }
                      className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
                    >
                      ลบข่าว
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}