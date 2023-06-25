"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const bookRoutes_1 = __importDefault(require("../routes/bookRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/books', bookRoutes_1.default);
describe('integration tests for the book library', () => {
    it('GET /books/getbooks - success - get all the books', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app).get('/books/getbooks').set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`);
        expect(body).toEqual(expect.arrayContaining([
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
        ]));
        expect(statusCode).toBe(200);
    }));
    it('PUT /books/update - success - update a book', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { body, statusCode } = yield (0, supertest_1.default)(app).put('/books/update')
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`)
            .send(bookToUpdate);
        expect(body).toEqual({
            "message": "Book successfully updated",
            "updatedBook": {
                "title": expect.any(String),
                "author": expect.any(String),
                "datePublished": expect.any(String),
                "description": expect.any(String),
                "pageCount": expect.any(Number),
                "Genre": "rom-com",
                "publisher": expect.any(String),
                "bookId": expect.any(String),
                "createdAt": expect.any(String),
                "updatedAt": expect.any(String)
            },
        });
        expect(statusCode).toBe(200);
    }));
    it('DELETE /books/delete:id - success - delete a book', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        const { body, statusCode } = yield (0, supertest_1.default)(app).delete('/books/delete')
            .send({ title: "King" })
            .set(`Authorization`, `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiMjViNzJmLTkwMmYtNGRiNi05MzNiLWY4MjgyYjk3ZWFmYSIsImVtYWlsIjoid2lsc29uQW5kMjMxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDEuSkd6cDBTeUJvRENSTFMudUNIWnV3RXBha0VQeVdySDBRREcweG5pYnEuUG1zczNPODhxIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yM1QxNzoxMDoxNC4zOTBaIiwidXNlck5hbWUiOiJXaWxzb24iLCJpYXQiOjE2ODc1NDAyMjJ9.tcGRH3aq19waEI-JYRN-lSqhvdnjZXQvShf2HoZBfMQ`);
        console.log(body);
        if (body.message === 'Book successfully deleted') {
            expect(statusCode).toBe(200);
        }
        else {
            expect(statusCode).toBe(404);
        }
    }));
});
