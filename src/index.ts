import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server start on PORT ${PORT}`);
});
