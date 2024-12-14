import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";
import path from "node:path";
const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // throw new Error('Loading meals failed')
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM Meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const publicFolderPath = path.resolve("public/images");
  const filePath = path.join(publicFolderPath, fileName);
  // Ensure the directory exists
  if (!fs.existsSync(publicFolderPath)) {
    fs.mkdirSync(publicFolderPath, { recursive: true });
  }

  // Write the image to the public/images folder
  const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
  fs.writeFileSync(filePath, bufferedImage);

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
     INSERT INTO meals
     (title, summary, instructions, creator, creator_email, image, slug)
     VALUES (@title, @summary, @instructions, @creator,  @creator_email, @image, @slug)
  `
  ).run(meal);
}
