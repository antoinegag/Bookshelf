import { load } from "cheerio";
import { fetchText, makeAbsoluteUrl } from "./Web";

export function makeAbsoluteGoodReadsUrl(relativeUrl: string) {
  return makeAbsoluteUrl("https://www.goodreads.com", relativeUrl);
}

export async function loadUserPage(userId: string) {
  const userUrl = makeAbsoluteGoodReadsUrl(`user/show/${userId}`);
  const userPageHtml = await fetchText(userUrl);

  if (userPageHtml) {
    return load(userPageHtml);
  }
}

export interface Shelves {
  [name: string]: string;
}

export interface GoodReadsUserData {
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  bookshelves: Shelves;
}

export interface BookEntry {
  book: {
    coverUrl: string;
    title: string;
    url: string;
  };
  author: {
    name: string;
    url: string;
  };
}

export async function getBookshelfBooks(
  bookshelfUrl: string
): Promise<BookEntry[]> {
  const pageText = await fetchText(bookshelfUrl);
  if (pageText) {
    const pageData = load(pageText)("#booksBody > tr");
    const books = pageData.toArray().map((book) => {
      const bookData = load(book);
      const coverUrl = bookData(".field.cover img").attr("src");

      const title = bookData(".field.title a");
      const titleText = title.text().trim();
      // TODO: Validate entries first to make sure everything is not null and remove the !
      const bookUrl = makeAbsoluteGoodReadsUrl(title.attr("href")!);

      const author = bookData(".field.author a");
      const authorText = author.text().trim();
      const authorUrl = makeAbsoluteGoodReadsUrl(author.attr("href")!);

      if (coverUrl && titleText && authorText && authorUrl) {
        return {
          book: {
            coverUrl,
            title: titleText,
            url: bookUrl,
          },
          author: {
            name: authorText,
            url: authorUrl,
          },
        };
      }
    });

    return books;
  }

  return [];
}

export async function getUserData(userId: string) {
  const data = await loadUserPage("131654245-antoine");
  if (data) {
    const name = data("#profileNameTopHeading").text().trim();
    const imageUrl = data("div.leftAlignedProfilePicture > a > img").attr(
      "src"
    );

    const shelves = data("#shelves a.actionLinkLite.userShowPageShelfListItem")
      .toArray()
      .reduce<Shelves>((shelves, shelf) => {
        const shelfData = load(shelf)("a");
        const url = shelfData.attr("href");
        const name = shelfData
          .text()
          .replace(/\s\(\d*\)/, "")
          .trim();

        if (name && url) {
          shelves[name] = makeAbsoluteGoodReadsUrl(url);
        }

        return shelves;
      }, {});

    return {
      user: {
        id: userId,
        name: name,
        imageUrl: imageUrl,
      },
      bookshelves: shelves,
    };
  }
}
