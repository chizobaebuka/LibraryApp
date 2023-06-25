import express, {Request, Response, NextFunction} from 'express';
import request from 'supertest';
import bookRoute from '../routes/bookRoutes';

const app = express();

app.use(express.json());
app.use('/books', bookRoute);

// Tests for the Books
describe('integration tests for the book library', () => {
    it('GET /books/getbooks - success - get all the books', async () => {
        const { body, statusCode } = await request(app).get('/books/getbooks').set(
            "Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`
        )

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    datePublished: expect.any(String),
                    description: expect.any(String),
                    pageCount: expect.any(Number),
                    Genre: expect.any(String),
                    bookId: expect.any(String),
                    publisher: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }),
            ])
        );

        expect(statusCode).toBe(200);
    });

    it('PUT /books/update - success - update a book', async ()=>{

        const bookToUpdate = {
            "title": "The HomeComing Queen",
            "author": "Zona Wilkins",
            "datePublished": "2012",
            "description": "xxx",
            "pageCount": 200,
            "Genre": "rom-com",
            "bookId": "1ca7fa0b-d9fe-403e-b9b7-309e3ae6f945",
            "publisher": "The XXX Group",
            "createdAt": "2023-06-19T16:30:16.096Z",
            "updatedAt": "2023-06-19T16:30:16.096Z"
        };

        const { body, statusCode } = await request(app).put('/books/update')
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`)
        .send(bookToUpdate)

        expect(body).toEqual({
            "message": "Book successfully updated",
            "updatedBook": {
                "title": expect.any(String),
                "author": expect.any(String),
                "datePublished": expect.any(String),
                "description": expect.any(String),
                "pageCount": expect.any(Number),
                "Genre": "rom-com", // Update the expected genre value here
                "publisher": expect.any(String),
                "bookId": expect.any(String),
                "createdAt": expect.any(String),
                "updatedAt": expect.any(String)
            },
        });
        

        expect(statusCode).toBe(200)
    })

    it('DELETE /books/delete:id - success - delete a book', async () => {
        jest.setTimeout(10000);
        const { body, statusCode } = await request(app).delete('/books/delete')
        .send({ title: "King"})
        .set(`Authorization`, `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`)

        if(body.message === 'Book successfully deleted'){
            expect(statusCode).toBe(200)
        }else{
            expect(statusCode).toBe(404)
        }
    })

    it('POST /books/create success - create a book', async()=> {
        const createdBook = {
            "title": "The HomeComing Queen",
            "author": "Zona Wilkins",
            "datePublished": "2012",
            "description": "xxx",
            "pageCount": 200,
            "Genre": "rom-com",
            "bookId": "1ca7fa0b-d9fe-403e-b9b7-309e3ae6f945",
            "publisher": "The XXX Group",
            "createdAt": "2023-06-19T16:30:16.096Z",
            "updatedAt": "2023-06-19T16:30:16.096Z"
        };

        const { body, statusCode } = await request(app)
        .post('/books/create')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ')
        .send(createdBook)

        expect(body).toEqual({
            "message": "Book already exists"
        });

        expect(statusCode).toBe(200)
    })
});

// Tests for the Users
describe('integration test for the users', () => {
    it('GET ')
})