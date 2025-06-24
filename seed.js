import "dotenv/config";
import { sequelize, models } from "./db/index.js";

const authorsData = [
  { name: "Alice Walker", biography: "American novelist, short story writer, poet, and social activist.", born_date: "1944-02-09" },
  { name: "Gabriel García Márquez", biography: "Colombian novelist, short-story writer, screenwriter and journalist.", born_date: "1927-03-06" },
  { name: "Haruki Murakami", biography: "Japanese writer known for his surrealistic fiction.", born_date: "1949-01-12" },
  { name: "Chimamanda Ngozi Adichie", biography: "Nigerian writer and author of novels, short stories, and nonfiction.", born_date: "1977-09-15" },
  { name: "George Orwell", biography: "English novelist, essayist, journalist and critic.", born_date: "1903-06-25" },
  { name: "Margaret Atwood", biography: "Canadian poet, novelist, literary critic, and essayist.", born_date: "1939-11-18" },
  { name: "J.K. Rowling", biography: "British author, best known for the Harry Potter series.", born_date: "1965-07-31" },
  { name: "Toni Morrison", biography: "American novelist, essayist, editor, and professor.", born_date: "1931-02-18" },
  { name: "Kazuo Ishiguro", biography: "British novelist, screenwriter, and short-story writer.", born_date: "1954-11-08" },
  { name: "Isabel Allende", biography: "Chilean writer, known for novels such as 'The House of the Spirits'.", born_date: "1942-08-02" },
];

const booksData = [
  { title: "The Color Purple", description: "A story of African-American women in the early 20th century.", published_date: "1982-01-01" },
  { title: "One Hundred Years of Solitude", description: "A multi-generational story of the Buendía family.", published_date: "1967-05-30" },
  { title: "Kafka on the Shore", description: "A surreal coming-of-age novel.", published_date: "2002-09-12" },
  { title: "Half of a Yellow Sun", description: "A novel set during the Nigerian Civil War.", published_date: "2006-09-12" },
  { title: "1984", description: "A dystopian social science fiction novel.", published_date: "1949-06-08" },
  { title: "The Handmaid's Tale", description: "A dystopian novel set in a totalitarian society.", published_date: "1985-08-17" },
  { title: "Harry Potter and the Sorcerer's Stone", description: "The first book in the Harry Potter series.", published_date: "1997-06-26" },
  { title: "Beloved", description: "A novel about the legacy of slavery.", published_date: "1987-09-16" },
  { title: "Never Let Me Go", description: "A dystopian science fiction novel.", published_date: "2005-03-03" },
  { title: "The House of the Spirits", description: "A family saga in post-colonial Chile.", published_date: "1982-01-01" },
  { title: "Possessing the Secret of Joy", description: "A novel about female genital mutilation.", published_date: "1992-01-01" },
  { title: "Love in the Time of Cholera", description: "A love story spanning decades.", published_date: "1985-01-01" },
  { title: "Norwegian Wood", description: "A nostalgic story of loss and sexuality.", published_date: "1987-09-04" },
  { title: "Americanah", description: "A story of love and race centered on Nigeria and America.", published_date: "2013-05-14" },
  { title: "Animal Farm", description: "A satirical allegorical novella.", published_date: "1945-08-17" },
  { title: "Oryx and Crake", description: "A speculative fiction novel.", published_date: "2003-05-06" },
  { title: "Harry Potter and the Chamber of Secrets", description: "The second book in the Harry Potter series.", published_date: "1998-07-02" },
  { title: "Song of Solomon", description: "A novel about African-American culture and identity.", published_date: "1977-09-16" },
  { title: "The Remains of the Day", description: "A story of an English butler's reflections.", published_date: "1989-05-17" },
  { title: "Of Love and Shadows", description: "A novel set during the military dictatorship in Chile.", published_date: "1984-01-01" },
];

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced.");

    // Create authors
    const createdAuthors = await Promise.all(
      authorsData.map((author) => models.Author.create(author))
    );

    // Assign books to authors (2 books per author)
    let authorIndex = 0;
    for (let i = 0; i < booksData.length; i++) {
      const author = createdAuthors[authorIndex];
      await models.Book.create({
        ...booksData[i],
        authorId: author.id,
      });
      if ((i + 1) % 2 === 0) authorIndex++;
    }

    console.log("Seed data inserted successfully.");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seed();
