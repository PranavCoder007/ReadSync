const puppeteer = require("puppeteer");
const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const domain = "https://www.amazon.in/s?k=books";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function getISBN(bookTitle,currentAuthor=null,retryCount = 5) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt = `Generate the ISBN (if non-existent, create a random one), genre (select only from Psychology, Motivational, Fitness, SelfHelp, Comedy, Fantasy, Financial, Science), number of pages, and a description for the book titled "${bookTitle}". Ensure the genre strictly matches one of the provided options. Provide the response as follows: ISBN| genre| number of pages| description. Avoid any special characters or additional symbols in the output.`;
        if (!currentAuthor) {
            prompt = `Generate the author, ISBN (if non-existent, create a random one), genre (select only from Psychology, Motivational, Fitness, SelfHelp, Comedy, Fantasy, Financial, Science), number of pages, and a description for the book titled "${bookTitle}". Ensure the genre strictly matches one of the provided options. Provide the response as follows: author| ISBN| genre| number of pages| description. Avoid any special characters or additional symbols in the output.`;
        }
        const result = await model.generateContent(prompt);
        const response = await result.response.text(); 
        let author, ISBN, genre, numberOfPages, description;
        console.log("\n"+response);
        if (!currentAuthor) {
            [author, ISBN, genre, numberOfPages, description] = response.split("|").map(item => item.trim());
        } else {
            [ISBN, genre, numberOfPages, description] = response.split("|").map(item => item.trim());
            author = currentAuthor;  // Use the provided author if available
        }

        await delay(1000);  
        
        return { author,ISBN, genre, numberOfPages, description };
    } catch (error) {
        if (error.status === 429 && retryCount > 0) {
            console.warn(`Quota exceeded. Retrying in 5 seconds... (${retryCount} retries left)`);
            await delay(5000);  
            return getISBN(bookTitle,currentAuthor, retryCount - 1);  
        } else {
            console.error("Error generating ISBN:", error);
            return null;
        }
    }
}

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
        );

        console.log("Navigating to Amazon...");
        await page.goto(domain, { timeout: 120000 });
        await delay(3000);

        let allBooks = [];
        let pageCount = 0;

        while (true) {
            pageCount++;
            console.log(`Scraping page ${pageCount}...`);

            console.log("Scrolling to load more results...");
            await autoScroll(page);

            const books = await page.evaluate(() => {
                function cleanTitle(bookTitle) {
                    return bookTitle
                        .replace(/\(.*?\)/g, '')
                        .replace(/\[.*?\]/g, '')
                        .replace(/Original Edition|Premium Paperback|Hardcover|Paperback|Edition|Complete/gi, '')
                        .trim();
                }
                function isUnwantedAuthor(text) {
                    const unwantedWords = ["buy", "offer", "discount", "number", "pages"];
                    const hasDigits = /\d/.test(text);  // Regular expression to check for any digit
                    return unwantedWords.some(word => text.toLowerCase().includes(word.toLowerCase())) || hasDigits;
                }
                const results = [];
                const items = Array.from(document.querySelectorAll(".s-result-item"));

                for (let item of items) {
                    const titleElem = item.querySelector(".a-size-medium.a-color-base.a-text-normal");
                    const authorElem = item.querySelector(".a-size-base+ .a-size-base");
                    const ratingElem = item.querySelector(".a-icon-alt");
                    const urlElem = item.querySelector(".a-link-normal");
                    const imageElem = item.querySelector(".s-image");
                    let author = authorElem ? authorElem.textContent.trim() : "Unknown";
                    if (isUnwantedAuthor(author)) {
                        author = null; 
                    }
                    if (titleElem && authorElem && ratingElem && urlElem && imageElem) {
                        results.push({
                            title: cleanTitle(titleElem.textContent.trim()),
                            author,
                            rating: ratingElem ? parseFloat(ratingElem.textContent.split(" ")[0]) : 0,
                            buylink: urlElem.href,
                            imageSrc: imageElem.src,
                        });
                    }
                }
                return results;
            });

            allBooks = allBooks.concat(books);

            console.log(`Books scraped from page ${pageCount}:`, books.length);
            if (allBooks.length >= 50) {
                allBooks = allBooks.slice(0, 100);  // Ensure exactly 100 books
                break;
            }
            // Check if there's a "Next" button
            const nextButton = await page.$('a.s-pagination-next');
            if (nextButton) {
                console.log("Navigating to next page...");
                await nextButton.click();
                await page.waitForNavigation({ waitUntil: "networkidle2" });
                await delay(3000);
            } else {
                console.log("No more pages. Scraping complete.");
                break;
            }
        }

        console.log("Fetching ISBNs using Google Generative AI...");
        for (let i = 0; i < allBooks.length; i++) {
            const book = allBooks[i];
            try {
                const { author, ISBN, genre, numberOfPages, description } = await getISBN(book.title,book.author);
                book.author = author ? author : "Unknown";
                book.ISBN = ISBN ? ISBN : null;
                book.genre = genre ? genre : null;
                book.numberOfPages = numberOfPages ? numberOfPages : null;
                book.description = description ? description : null;
                if(i<16){
                    book.type=true;
                }
            } catch (error) {
                console.error(`Error generating ISBN for "${book.title}":`, error.message);
                allBooks.splice(i, 1);
                i--; 
                continue; 
            }
        }

        console.log("Processing and saving book data...");
        fs.writeFileSync("books.json", JSON.stringify(allBooks, null, 2));
        console.log("Scraping complete and data saved to books.json");

        await browser.close();
    } catch (error) {
        console.error("Error during scraping:", error.message);
    }
})();
