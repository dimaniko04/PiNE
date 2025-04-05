import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 5000;

type GetLongestWordRequest = Request<{}, {}, { text: string }>;

app.use(cors());
app.use(express.json());

app.post("/get-longest-word", (req: GetLongestWordRequest, res: Response) => {
  if (!req.body.text) {
    res.status(400).send("Text string is required!");
    return;
  }
  if (req.body.text.length > 5000) {
    res.status(400).send("Text string can't be longer that 5000 characters!");
    return;
  }

  let longestWord = "";
  let longestLength = 0;
  const words = req.body.text.split(" ");

  for (let word of words) {
    if (word.length > longestLength) {
      longestWord = word;
      longestLength = word.length;
    }
  }

  res.status(200).send(longestWord);
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
