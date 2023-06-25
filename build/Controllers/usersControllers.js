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
exports.deleteUser = exports.loginUser = exports.createUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let dbFolder = path_1.default.join(__dirname, '../../src/userDataBase');
let dbFile = path_1.default.join(dbFolder, 'userDataBase.json');
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Creating database dynamically 
        if (!fs_1.default.existsSync(dbFolder)) {
            fs_1.default.mkdirSync(dbFolder);
        }
        if (!fs_1.default.existsSync(dbFile)) {
            fs_1.default.writeFileSync(dbFile, " ");
        }
        // Reading from database
        let readDB = [];
        try {
            let infos = fs_1.default.readFileSync(dbFile, 'utf8');
            if (!infos) {
                return res.status(404).json({
                    message: 'Error reading from database'
                });
            }
            else {
                readDB = JSON.parse(infos);
            }
        }
        catch (parseError) {
            readDB = [];
        }
        // Reading from frontend
        const { userName, email, password } = req.body;
        const userEmailExists = readDB.find((user) => user.email === email);
        const userNameExists = readDB.find((user) => user.userName === userName);
        if (userEmailExists) {
            res.send({ message: `${email} is already in use` });
        }
        if (userNameExists) {
            res.send({ message: `${userName} is already taken, try another` });
        }
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hash = yield bcrypt_1.default.hash(password, salt);
        // create the user
        const newUser = {
            "id": (0, uuid_1.v4)(),
            "email": email,
            "password": hash,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "userName": userName
        };
        readDB.push(newUser);
        fs_1.default.writeFileSync(dbFile, JSON.stringify(readDB, null, 2), 'utf8');
        //sending back to the frontend
        res.status(200).json({ message: `user created successfully`, newUser });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read from database
        let readDB = [];
        const infos = fs_1.default.readFileSync(dbFile, 'utf8');
        if (!infos) {
            return res.status(404).json({ message: 'Error reading from database' });
        }
        else {
            readDB = JSON.parse(infos);
        }
        // from the frontend expecting email and password
        const { email, password } = req.body;
        const thisUser = readDB.find((user) => user.email === email);
        if (!thisUser) {
            return res.send({ message: `this User does not exist` });
        }
        if (thisUser) {
            const validate = yield bcrypt_1.default.compare(password, thisUser.password);
            if (validate) {
                const token = jsonwebtoken_1.default.sign(thisUser, 'mySecret');
                return res.status(200).json({
                    message: `Logged in Successfully `,
                    email: thisUser.email,
                    token
                });
            }
            else {
                res.send({ message: `Your not permitted to access this!!!` });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let databaseRead = [];
        const infos = fs_1.default.readFileSync(dbFile, 'utf8');
        if (!infos) {
            return res.status(404).json({ message: `Error reading from database` });
        }
        else {
            databaseRead = JSON.parse(infos);
        }
        // Getting the user ID from the request parameters (req.params.id)
        const userID = req.params.id;
        // finding the user with the matching id 
        const theUser = databaseRead.find((user) => user.id === userID);
        if (!theUser) {
            return res.status(400).json({ message: `User not found` });
        }
        // to remove the user from the database
        const removedUser = databaseRead.splice(theUser, 1)[0];
        // writing the updated database back to the file 
        fs_1.default.writeFileSync(dbFile, JSON.stringify(databaseRead, null, 2), 'utf8');
        res.status(200).json({ message: `User has been deleted successfully`, removedUser });
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
exports.deleteUser = deleteUser;
