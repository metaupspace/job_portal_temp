import * as readline from 'readline';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const BCRYPT_ROUNDS = 12;

const AdminSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contact: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    position: { type: String },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    managerId: { type: String },
    departmentId: { type: [String], required: true },
    teamIds: { type: [String], default: [] },
    managedEmployeeIds: { type: [String], default: [] },
    passwordHash: { type: String, required: true },
    baseSalary: { type: String },
    hra: { type: String },
    conveyance: { type: String },
    OtherAllowances: { type: String },
    providentFund: { type: String },
    ESIC: { type: String },
    ProfessionalTax: { type: String },
    encryptedDataKey: { type: String },
    active: { type: Boolean, default: true },
    shiftStartTime: { type: String },
    DateOfJoining: { type: Date },
    profilePic: { type: String },
    location: { type: String },
  },
  { timestamps: true, collection: 'employees' },
);

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

function getArg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  const emailArg = getArg('email');
  const passArg = getArg('password');
  const employeeIdArg = getArg('employeeId');
  const nameArg = getArg('name');
  const contactArg = getArg('contact');
  const addressArg = getArg('address');
  const dobArg = getArg('dob');
  const departmentArg = getArg('department');
  const rolesArg = getArg('roles');

  const email = emailArg ?? (await prompt('Admin email: '));
  if (!email) { console.error('Email is required'); process.exit(1); }

  const generatedPassword = !passArg;
  const password = passArg ?? crypto.randomBytes(16).toString('hex');

  const employeeId = (employeeIdArg ?? (await prompt('Employee ID [ADMIN-001]: '))) || 'ADMIN-001';
  const name = (nameArg ?? (await prompt('Name [Admin]: '))) || 'Admin';
  const contact = (contactArg ?? (await prompt('Contact [0000000000]: '))) || '0000000000';
  const address = (addressArg ?? (await prompt('Address [N/A]: '))) || 'N/A';
  const dobStr = (dobArg ?? (await prompt('Date of birth (YYYY-MM-DD) [1990-01-01]: '))) || '1990-01-01';
  const department = (departmentArg ?? (await prompt('Department [ADMIN]: '))) || 'ADMIN';
  const roles = (rolesArg ?? 'HR').split(',').map((r) => r.trim()).filter(Boolean);

  const dateOfBirth = new Date(dobStr);
  if (Number.isNaN(dateOfBirth.getTime())) {
    console.error(`Invalid date of birth: ${dobStr}`);
    process.exit(1);
  }

  console.log('\nHashing password...');
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await mongoose.connect(uri);
  const AdminModel = mongoose.model('Admin', AdminSchema);

  await AdminModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      employeeId,
      name,
      email: email.toLowerCase(),
      contact,
      roles,
      address,
      dateOfBirth,
      departmentId: [department],
      passwordHash,
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await mongoose.disconnect();

  console.log('✓ Admin upserted in database');
  console.log(`  Email:      ${email}`);
  console.log(`  EmployeeID: ${employeeId}`);
  console.log(`  Name:       ${name}`);
  console.log(`  Roles:      ${roles.join(', ')}`);
  if (generatedPassword) {
    console.log(`  Password:   ${password}`);
    console.log('  ^ Save this — it will not be shown again.\n');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
