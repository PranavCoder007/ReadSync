const puppeteer = require('puppeteer');
const fs = require('fs');

// Amazon domain
const domain = "https://www.amazon.in/s?k=bestselling+books&crid=3CDS6UGDM5L04&sprefix=bestselling+book%2Caps%2C201&ref=nb_sb_noss_1";

// Custom delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to auto-scroll the page to trigger lazy loading
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

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
        
        console.log('Navigating to Amazon...');
        await page.goto(domain, { timeout: 120000 }); // 2-minute timeout
        await delay(3000); // Wait 3 seconds for the page to load

        // Search for books
        console.log('Searching for books...');
        await page.type('#twotabsearchtextbox', 'books', { delay: 100 });
        await delay(2000); // Wait 2 seconds before clicking
        await page.click('input[type="submit"][value="Go"]');

        // Wait for results to appear, with a timeout
        console.log('Waiting for search results...');
        await page.waitForSelector('.s-image', { timeout: 60000 }); // 1-minute timeout

        // Scroll to load more results
        console.log('Scrolling to load more results...');
        await autoScroll(page);

        // Scrape all available books
        console.log('Scraping book data...');
        const books = await page.evaluate(() => {
            const results = [];
            const items = Array.from(document.querySelectorAll('.s-result-item'));

            for (let item of items) {
                const titleElem = item.querySelector(".a-size-medium.a-color-base.a-text-normal");
                const authorElem = item.querySelector(".a-size-base+ .a-size-base"); 
                const ratingElem = item.querySelector('.a-icon-alt');
                const isbnElem = item.querySelector('.a-color-secondary.a-text-normal');
                const urlElem = item.querySelector(".a-link-normal");
                const imageElem = item.querySelector('.s-image'); // Added to capture image element

                if (titleElem && authorElem && ratingElem && urlElem && imageElem) {
                    results.push({
                        title: titleElem.textContent.trim(),
                        author: authorElem ? authorElem.textContent.trim() : 'Unknown',
                        rating: ratingElem ? parseFloat(ratingElem.textContent.split(" ")[0]) : 0,
                        buylink: urlElem.href,
                        ISBN: isbnElem ? isbnElem.textContent.trim().match(/\d{10}|\d{13}/) : null,
                        imageSrc: imageElem.src // Added to capture the image src attribute
                    });
                }
            }
            return results;
        });

        console.log('Books scraped:', books.length); // Log number of books scraped
        if (books.length === 0) {
            console.log('No books found, check Amazon or selectors.');
            await browser.close();
            return;
        }

        // Process book data
        console.log('Processing book data...');
        let bookData = [];
        for (let book of books) {
            bookData.push({
                title: book.title,
                author: book.author,
                genre: "Unknown",
                rating: book.rating,
                ISBN: book.ISBN ? book.ISBN[0] : null,
                buylink: book.buylink,
                imageSrc: book.imageSrc // Added to store the image src in the final data
            });
        }
        
        bookData.pop();

        // Save data to JSON file
        console.log('Saving data to books.json...');
        fs.writeFileSync('books.json', JSON.stringify(bookData, null, 2));
        console.log('Scraping complete and data saved to books.json');
        
        await browser.close();
    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
})();
