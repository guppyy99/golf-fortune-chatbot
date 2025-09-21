"use client";
import { useState } from "react";

export default function FortunePage() {
  const [form, setForm] = useState({
    name: "김도윤",
    birth: "1999-10-24",
    birthTime: "13:00",
    gender: "남성",
    handicap: 28 as number | string,
    extra: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult("");
    setLoading(true);

    const res = await fetch("/api/fortune", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        birth: form.birth,
        birthTime: (form.birthTime || "").toString(),
        gender: form.gender,
        handicap: Number(form.handicap),
        extra: form.extra,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.body) {
      setResult("스트리밍 실패");
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      setResult((prev) => prev + decoder.decode(value, { stream: true }));
    }

    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">오늘의 골프 운세 (골신)</h1>
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="생년월일(YYYY-MM-DD)"
          value={form.birth}
          onChange={(e) => setForm({ ...form, birth: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="출생시간(HH:MM, 선택)"
          value={form.birthTime}
          onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="성별(남성/여성)"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="핸디(숫자)"
          value={form.handicap}
          onChange={(e) =>
            setForm({ ...form, handicap: (e.target.value as unknown) as number | string })
          }
        />
        <textarea
          className="border p-2 w-full"
          placeholder="추가 정보(선택)"
          value={form.extra}
          onChange={(e) => setForm({ ...form, extra: e.target.value })}
        />
        <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "점지 중..." : "운세 보기"}
        </button>
      </form>

      <pre className="whitespace-pre-wrap border p-3 rounded min-h-[200px]">
        {result || "여기에 결과가 표시됩니다..."}
      </pre>
    </main>
  );
}


