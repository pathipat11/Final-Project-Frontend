/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";

// Interface for an income/expense entry
interface PriceEntry {
  [x: string]: any;
  id: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  note?: string;
  userId: string; // Assuming you handle user login and have userId available
}

export default function HomePage() {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [note, setNote] = useState<string>("");
  const [priceList, setPriceList] = useState<PriceEntry[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const userId = "exampleUserId"; // Replace with real userId
      const res = await fetch("/api/v1/price/list", { headers: { userId } });
      const data = await res.json();
      setPriceList(data);

      const totalRes = await fetch("/api/v1/price/total", { headers: { userId } });
      const totalData = await totalRes.json();
      setTotalIncome(totalData.incomeTotal);
      setTotalExpense(totalData.expenseTotal);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: PriceEntry = {
      id: "", // Placeholder, will be set by MongoDB
      amount,
      date,
      type,
      note,
      userId: "exampleUserId", // Replace with real userId
    };

    const res = await fetch("/api/v1/price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });

    if (res.ok) {
      const savedEntry = await res.json();
      setPriceList((prev) => [...prev, savedEntry]); // Update the list
      resetForm();
    }
  };

  const resetForm = () => {
    setAmount(0);
    setDate("");
    setType("income");
    setNote("");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/v1/price/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPriceList((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const handleUpdate = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/v1/price/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (res.ok) {
      const updatedEntry = await res.json();
      setPriceList((prev) =>
        prev.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
    }
  };

  return (
    <div>
      <h1>Income & Expense Tracker</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for amount, date, type, and note */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />
        <button type="submit">Add Entry</button>
      </form>

      <h2>Total Income: {totalIncome}</h2>
      <h2>Total Expense: {totalExpense}</h2>

      <ul>
        {priceList.map((entry) => (
          <li key={entry.id}>
            <span style={{ textDecoration: entry.completed ? "line-through" : "none" }}>
              {entry.type} - {entry.amount} on {entry.date} - {entry.note}
            </span>
            <button onClick={() => handleUpdate(entry.id, !entry.completed)}>
              {entry.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
