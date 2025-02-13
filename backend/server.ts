import express, { Application, Request, Response } from "express";
import path from "path";
import Routes from "./routes/index.route";
import cors from "cors";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://q5j6kqu5mowlpzrn.public.blob.vercel-storage.com",
];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

const port: Number = Number(process.env.PORT) || 3000;

app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api", Routes);

app.use("/hello", (req, res) => {
  res.send("get mogged");
});

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
