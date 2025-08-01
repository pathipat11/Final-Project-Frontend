import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // To track which user added the entry
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: { type: String, default: "" },
});

// Connect to the "price" collection
const Price = mongoose.models.Price || mongoose.model("Price", PriceSchema);
export default Price;
