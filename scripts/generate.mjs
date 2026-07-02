import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.join(__dirname, "..");
const dailyDirectory = path.join(rootDirectory, "contents", "daily");

const command = process.argv[2];
const commandArgument = process.argv[3];
const dateArgument = command === "days" ? process.argv[4] : commandArgument;

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

const parseDate = (value) => {
  if (!isValidDate(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const getDate = () => {
  const date = dateArgument ?? formatTaipeiDate(new Date());
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    console.error("Date must use YYYY-MM-DD format.");
    process.exit(1);
  }

  return parsedDate;
};

const createDailyNote = (date, { skipExisting = false } = {}) => {
  fs.mkdirSync(dailyDirectory, { recursive: true });

  const formattedDate = formatTaipeiDate(date);
  const filePath = path.join(dailyDirectory, `${formattedDate}.md`);

  if (fs.existsSync(filePath)) {
    const message = `Daily note already exists: ${path.relative(rootDirectory, filePath)}`;

    if (skipExisting) {
      console.log(`Skipped ${path.relative(rootDirectory, filePath)}`);
      return false;
    }

    console.error(message);
    process.exit(1);
  }

  const content = `# ${formattedDate}
[ ] Leetcode daily / Rating 1700以下的題目練習
[ ] Send resume
[ ] Do one System Design question
[ ] Learning English / write English dairy
`;

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Created ${path.relative(rootDirectory, filePath)}`);
  return true;
};

const createNextDaysNotes = () => {
  const numberOfDays = Number(commandArgument);

  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    console.error("Number of days must be a positive integer.");
    process.exit(1);
  }

  const referenceDate = getDate();
  let createdCount = 0;

  for (let day = 1; day <= numberOfDays; day += 1) {
    if (createDailyNote(addDays(referenceDate, day), { skipExisting: true })) {
      createdCount += 1;
    }
  }

  console.log(
    `Done. Created ${createdCount}, skipped ${numberOfDays - createdCount}.`,
  );
};

switch (command) {
  case "daily":
    createDailyNote(getDate());
    break;
  case "days":
    createNextDaysNotes();
    break;
  default:
    console.error(
      "Usage:\n  pnpm gen daily [YYYY-MM-DD]\n  pnpm gen days <number> [YYYY-MM-DD]",
    );
    process.exit(1);
}
