"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersControllers_1 = require("../Controllers/usersControllers");
const router = express_1.default.Router();
router.post('/signup', usersControllers_1.createUser);
router.post('/login', usersControllers_1.loginUser);
router.delete('/delete', usersControllers_1.deleteUser);
exports.default = router;
