"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(process.cwd(), '.env') });
const BCRYPT_ROUNDS = 12;
const AdminSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}
async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not set in .env');
        process.exit(1);
    }
    const emailArg = process.argv.find((a) => a.startsWith('--email='))?.split('=').slice(1).join('=');
    const passArg = process.argv.find((a) => a.startsWith('--password='))?.split('=').slice(1).join('=');
    const email = emailArg ?? (await prompt('Admin email: '));
    if (!email) {
        console.error('Email is required');
        process.exit(1);
    }
    const generatedPassword = !passArg;
    const password = passArg ?? crypto.randomBytes(16).toString('hex');
    console.log('\nHashing password...');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await mongoose_1.default.connect(uri);
    const AdminModel = mongoose_1.default.model('Admin', AdminSchema);
    await AdminModel.findOneAndUpdate({ email: email.toLowerCase() }, { email: email.toLowerCase(), passwordHash }, { upsert: true, new: true });
    await mongoose_1.default.disconnect();
    console.log('✓ Admin upserted in database');
    console.log(`  Email:    ${email}`);
    if (generatedPassword) {
        console.log(`  Password: ${password}`);
        console.log('  ^ Save this — it will not be shown again.\n');
    }
}
main().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed-admin.js.map