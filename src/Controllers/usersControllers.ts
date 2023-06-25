import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import jwt from 'jsonwebtoken'

let dbFolder = path.join(__dirname, '../../src/userDataBase');
let dbFile = path.join(dbFolder, 'userDataBase.json');

export const createUser = async( req: Request, res: Response, next: NextFunction ) => {
    try {
        // Creating database dynamically 
        if(!fs.existsSync(dbFolder)){
            fs.mkdirSync(dbFolder);
        }
        if(!fs.existsSync(dbFile)){
            fs.writeFileSync(dbFile, " ");
        }
        
        // Reading from database
        let readDB: any[] = [];
        try {
            let infos = fs.readFileSync(dbFile, 'utf8')

            if(!infos){
                return res.status(404).json({
                    message: 'Error reading from database'
                })
            }else{
                readDB = JSON.parse(infos)
            }
        } catch (parseError) {
            readDB = [];
        }
            // Reading from frontend
            const { userName, email, password } = req.body;

            const userEmailExists = readDB.find((user: any) => user.email === email);
            const userNameExists = readDB.find((user: any) => user.userName === userName);

            if(userEmailExists){
                res.send({ message: `${email} is already in use`})
            }
            if(userNameExists){
                res.send({ message: `${userName} is already taken, try another`})
            }

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(password, salt)

            // create the user
            const newUser = {
                "id": v4(),
                "email": email,
                "password": hash,
                "createdAt": new Date(), 
                "updatedAt": new Date(),
                "userName": userName
            }

            readDB.push(newUser)

            fs.writeFileSync(dbFile, JSON.stringify(readDB, null, 2), 'utf8')
            //sending back to the frontend
            res.status(200).json({ message: `user created successfully`, newUser})
    } catch (error) {
        console.log(error)
    }
}

export const loginUser = async( req: Request, res: Response, next: NextFunction ) => {
    try {
        // read from database
        let readDB: any[] = [];
        const infos = fs.readFileSync(dbFile, 'utf8')
        if(!infos){
            return res.status(404).json({ message: 'Error reading from database' });
        }else{
            readDB = JSON.parse(infos);
        }

        // from the frontend expecting email and password
        const { email, password } = req.body;
        const thisUser = readDB.find((user: any) => user.email === email)

        if(!thisUser){
            return res.send({ message: `this User does not exist`})
        }
        if(thisUser){
            const validate = await bcrypt.compare(password, thisUser.password)
            if(validate){
                const token = jwt.sign(thisUser, 'mySecret')
                return res.status(200).json({ 
                    message: `Logged in Successfully `,
                    email: thisUser.email,
                    token
                })
            }else{
                res.send({ message: `Your not permitted to access this!!!` })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let databaseRead: any[] = [];
        const infos = fs.readFileSync(dbFile, 'utf8');
        if(!infos){ 
            return res.status(404).json({ message: `Error reading from database` })
        }else{
            databaseRead = JSON.parse(infos)
        }

        // Getting the user ID from the request parameters (req.params.id)
        const userID = req.params.id;
        // finding the user with the matching id 
        const theUser = databaseRead.find((user) => user.id === userID)
        if(!theUser){
            return res.status(400).json({ message: `User not found` })
        }
        // to remove the user from the database
        const removedUser = databaseRead.splice(theUser, 1)[0];
        // writing the updated database back to the file 
        fs.writeFileSync(dbFile, JSON.stringify(databaseRead, null, 2), 'utf8')

        res.status(200).json({ message: `User has been deleted successfully`, removedUser})
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error'})
    }
}