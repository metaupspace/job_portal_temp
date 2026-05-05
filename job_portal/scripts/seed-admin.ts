import * as readline from 'readline';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const BCRYPT_ROUNDS = 12;

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

function prompt(question: string): Promise<string> {
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
  if (!email) { console.error('Email is required'); process.exit(1); }

  const generatedPassword = !passArg;
  const password = passArg ?? crypto.randomBytes(16).toString('hex');

  console.log('\nHashing password...');
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await mongoose.connect(uri);
  const AdminModel = mongoose.model('Admin', AdminSchema);

  await AdminModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash },
    { upsert: true, new: true },
  );

  await mongoose.disconnect();

  console.log('✓ Admin upserted in database');
  console.log(`  Email:    ${email}`);
  if (generatedPassword) {
    console.log(`  Password: ${password}`);
    console.log('  ^ Save this — it will not be shown again.\n');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
