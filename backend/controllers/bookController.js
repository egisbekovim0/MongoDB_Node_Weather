import BookData from "../models/Book.js"
import ApiHistory from '../models/ApiHistory.js'
import axios from 'axios'

export const getBookInfo = async (req, res) => {
    const one_user = req.session.user 
    const userId = one_user._id
    const BookName = req.query.bookName;
    
    const APIUrl = `https://openlibrary.org/search.json?q=${BookName}&fields=key,title,author_name,editions,editions.key,editions.title,editions.ebook_access,editions.language.json`;
    let book, error = null;
    
    try {
        if (BookName){

        const response = await axios.get(APIUrl);
        book = response.data;
        

        const newBook = new BookData({
            numFound: book.numFound,
            docs: book.docs.map(doc => ({
                author_name: doc.author_name,
                key: doc.key,
                title: doc.title,
                edition: {
                    key: doc.editions.docs[0].key,
                    title: doc.editions.docs[0].title,
                    ebook_access: doc.editions.docs[0].ebook_access
                }
            }))
        })
        await newBook.save()

        const apiHistory = new ApiHistory({
            endpoint: '/book',
            query: { BookName },
            response: { bookData: newBook },
            user: userId
        });
        await apiHistory.save();

        const latestBookData = await BookData.findOne().sort({ createdAt: -1 })

        res.render("bookI", { latestBookData, error });
        } else {
            res.render("bookI", { latestBookData: null, error: "Please enter a book name." });
        }

    }catch(err){
        console.log(err)
        res.render("bookI", { latestBookData: null, error });
    }
}
