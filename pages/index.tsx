import { GetStaticProps } from "next";
import {
  BookEntry,
  getCachedBookshelf,
  getCachedUserData,
  GoodReadsUserData,
} from "../lib/scrapper/GoodReads";

interface Props {
  user: GoodReadsUserData;
  currentlyReading: BookEntry[];
}

export default function Home({ user, currentlyReading }: Props) {
  const {
    user: { id, name, imageUrl },
  } = user;
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl">{name}'s</h1>
        <div>bookshelf</div>
      </div>
      <div>
        <img src={imageUrl} />
      </div>
      <div>
        <h2>Currently reading</h2>
        {currentlyReading.map(({ author, book }) => (
          <div>
            <h3 style={{ marginBottom: "0" }}>
              <a href={book.url}>{book.title}</a>
            </h3>
            <div>
              <a href={author.url}>{author.name}</a>
            </div>
            <img src={book.coverUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userId = "131654245-antoine";
  const userData = await getCachedUserData(userId);
  const readingBookshelfUrl = userData?.bookshelves["currently-reading‎"];
  let currentlyReadingBooks: BookEntry[] = [];
  if (readingBookshelfUrl) {
    currentlyReadingBooks = await getCachedBookshelf(readingBookshelfUrl);
  }

  return {
    props: {
      user: userData,
      currentlyReading: currentlyReadingBooks,
    },
  };
};
