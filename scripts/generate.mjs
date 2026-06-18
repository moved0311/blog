import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.join(__dirname, "..");
const dailyDirectory = path.join(rootDirectory, "contents", "daily");

const command = process.argv[2];
const dateArgument = process.argv[3];

const formatTaipeiDate = (date) => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const createDailyNote = () => {
  const date = dateArgument ?? formatTaipeiDate(new Date());

  if (!isValidDate(date)) {
    console.error("Date must use YYYY-MM-DD format.");
    process.exit(1);
  }

  fs.mkdirSync(dailyDirectory, { recursive: true });

  const filePath = path.join(dailyDirectory, `${date}.md`);

  if (fs.existsSync(filePath)) {
    console.error(`Daily note already exists: ${path.relative(rootDirectory, filePath)}`);
    process.exit(1);
  }

  const content = `# ${date}
[ ] Leetcode daily / Rating 1700以下的題目練習
[ ] Send resume
[ ] Do one system design question
[ ] Do DB questions or Learn a DB topic
[ ] Learning English
`;

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Created ${path.relative(rootDirectory, filePath)}`);
};

switch (command) {
  case "daily":
    createDailyNote();
    break;
  default:
    console.error("Usage: pnpm g daily [YYYY-MM-DD]");
    process.exit(1);
}
