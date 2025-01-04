"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const prismaClient_1 = __importDefault(require("./prismaClient"));
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
prismaClient_1.default.$connect()
    .then(() => {
    app_1.default.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});
process.on('SIGINT', async () => {
    await prismaClient_1.default.$disconnect();
    process.exit(0);
});
