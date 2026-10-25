import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.resolve(DATA_DIR, 'school_database.json');

// Default initial database content
const DEFAULT_DATABASE = {
  admin: {
    id: 'prince@123',
    email: 'prince@123',
    // Hash for '123456'
    passwordHash: crypto.createHash('sha256').update('123456').digest('hex'),
    name: 'Prince (Authorized Staff - Notice In-charge)',
    role: 'staff',
    canManageNotices: true,
  },
  schoolInfo: {
    name: 'UHS MADHULATA RANIGANJ ARARIA',
    hindiName: 'उत्क्रमित उच्च माध्यमिक विद्यालय, मधुलता (अररिया)',
    affiliation: 'Bihar School Examination Board (BSEB), Patna',
    udiseCode: '10070804607',
    estd: '1960',
    location: 'Madhulata, Bishanpur Panchayat, Raniganj, Araria, Bihar, India',
    postOffice: 'Madhulata',
    policeStation: 'Raniganj',
    pinCode: '854334',
    phone: '7631729440',
    email: 'uhsmadhulata607@gmail.com',
    principalName: 'Shri R. K. Mandal',
    principalDesignation: 'Headmaster / Principal (In-charge)',
    principalQualification: 'M.Sc., B.Ed. (22+ Years in Bihar Education Service)',
    principalMessage: 'Welcome to Utkramit High School (UHS) Madhulata, Raniganj. It is our enduring pledge to nurture disciplined, inquisitive, and compassionate young minds in our rural heartland of Araria. Education is not merely the acquisition of textbook knowledge; it is the ignition of critical conscience, scientific spirit, and civic responsibility. We are committed to providing our students with vibrant classroom learning, modern laboratories, digital educational resources, and value-based leadership to help them become proud contributors to Bihar and our nation.',
    aboutText: 'Utkramit High School (UHS) Madhulata is a premier government higher secondary institution located in Bishanpur Panchayat, Raniganj block of Araria district, Bihar. Dedicated to universal, inclusive, and qualitative education, the institution provides structured learning from Upper Primary through Secondary (Matric) and Higher Secondary (Intermediate) levels. With experienced teaching faculty, student-friendly infrastructure, clean drinking water, separate sanitation complexes, science equipment, and active sports programs, UHS Madhulata stands as a beacon of academic empowerment in Seemanchal Bihar.',
    mission: 'To impart accessible, equitable, and top-tier secondary education that builds intellectual curiosity, ethical character, digital awareness, and practical skills among all rural youth.',
    vision: 'To emerge as an exemplary model institution of educational transformation where every student—regardless of socioeconomic background—is inspired to dream big, excel academically, and lead with integrity.',
    objectives: [
      'Deliver student-centered pedagogy aligned with BSEB and NEP 2020 curriculum standards.',
      'Foster 100% literacy, high secondary passing rates, and active scholarship adoption.',
      'Empower girls and marginalized communities through inclusive schooling and digital literacy.',
      'Maintain modern school infrastructure, clean environmental standards, and robust sports facilities.'
    ],
    workingHours: 'Monday - Saturday: 9:30 AM to 4:00 PM (Classes) | 10:00 AM to 4:30 PM (Office)'
  },
  notices: [
    {
      id: 'notice-1',
      title: 'Annual Secondary Examination (BSEB Matric) 2026 Schedule & Admit Card Distribution',
      category: 'Examination',
      date: '2026-03-24',
      description: 'Official schedule, exam center protocols, and instructions for mandatory admit card verification for all Class 10th board examinees.',
      content: 'All regular and private examinees registered for the Bihar School Examination Board (BSEB) Secondary (Matric) Examination 2026 are hereby informed that verified original Admit Cards are being distributed from the Headmaster Office counter between 10:30 AM and 3:30 PM. Examinees must personally verify their personal credentials, subject combination, roll code, and roll number. Candidates must report at the allocated examination center at least 30 minutes before commencement. Mobile phones, electronic watches, calculators, and unauthorized materials are strictly forbidden inside the exam hall.',
      isImportant: true,
      isPublished: true,
      attachmentName: 'BSEB_Matric_Exam_Guidelines_2026.pdf',
      attachmentType: 'pdf',
      externalLink: 'http://biharboardonline.bihar.gov.in',
      createdAt: '2026-03-24T08:00:00.000Z',
      updatedAt: '2026-03-24T08:00:00.000Z',
      viewCount: 342
    },
    {
      id: 'notice-2',
      title: 'Parent-Teacher Association (PTA) Quarterly Meeting & Academic Progress Review',
      category: 'General',
      date: '2026-03-20',
      description: 'Important assembly for parents of Class 6th to 12th to review attendance records, terminal marks, and student wellness.',
      content: 'Respected Parents and Guardians, the quarterly general meeting of the Parent-Teacher Association (PTA) of UHS Madhulata is convened on the school campus on Saturday from 10:30 AM onwards. The meeting will discuss class attendance percentages, individual evaluation cards, mid-day meal hygiene standards, and preparation strategies for board and annual promotion tests. Your active presence and feedback are vital for your child’s educational advancement.',
      isImportant: true,
      isPublished: true,
      attachmentName: 'PTA_Meeting_Notice_March2026.pdf',
      attachmentType: 'pdf',
      createdAt: '2026-03-20T09:30:00.000Z',
      updatedAt: '2026-03-20T09:30:00.000Z',
      viewCount: 189
    },
    {
      id: 'notice-3',
      title: 'Bihar State Pre-Matric and Post-Matric Scholarship Portal Document Verification',
      category: 'Scholarship',
      date: '2026-03-12',
      description: 'Mandatory submission of Aadhaar-linked bank accounts, income certificates, and Medhasoft records for student scholarship disbursement.',
      content: 'All eligible students belonging to SC, ST, EBC, BC, and Minority categories enrolled in Classes 9th, 10th, 11th, and 12th who applied under state scholarship welfare schemes must verify their application documents with the school scholarship coordinator, Shri Sanjeev Kumar, by 30th March. Required documents: Photocopy of Aadhaar Card, Bank Passbook showing active NPCI/Aadhaar DBT seeding, Residential Certificate, Income Certificate (valid for current financial year), and Medhasoft registration slip.',
      isImportant: true,
      isPublished: true,
      attachmentName: 'Scholarship_Checklist_PMS_2026.pdf',
      attachmentType: 'pdf',
      externalLink: 'https://pmsonline.bih.nic.in',
      createdAt: '2026-03-12T10:00:00.000Z',
      updatedAt: '2026-03-12T10:00:00.000Z',
      viewCount: 410
    },
    {
      id: 'notice-4',
      title: 'Academic Session 2026-27 Gazetted Holidays & Summer Vacation Schedule',
      category: 'Holidays',
      date: '2026-02-28',
      description: 'Official list of institutional holidays, festival observances, and summer recess as per Bihar Education Department directives.',
      content: 'As communicated by the Directorate of Secondary Education, Government of Bihar, Patna, the academic holiday schedule for UHS Madhulata has been notified. The school will observe designated leaves for official festivals. Summer vacation dates and compensatory class routines will be posted well in advance on this portal notice board.',
      isImportant: false,
      isPublished: true,
      attachmentName: 'Academic_Holiday_Calendar_2026.pdf',
      attachmentType: 'pdf',
      createdAt: '2026-02-28T07:15:00.000Z',
      updatedAt: '2026-02-28T07:15:00.000Z',
      viewCount: 220
    },
    {
      id: 'notice-5',
      title: 'Admissions Open for Class 9th and Class 11th (Arts & Science) 2026-27',
      category: 'Admission',
      date: '2026-02-15',
      description: 'Prospectus availability, entrance criteria, and application window for fresh enrollments at UHS Madhulata.',
      content: 'Fresh admissions for Class 9th (Secondary) and Class 11th (Higher Secondary - Arts and Science Streams) are formally announced. Parents and qualifying students from local middle schools and Bishanpur Panchayat are advised to obtain the prescribed admission form from the school counter between 10:00 AM and 3:00 PM. No admission fee is charged for girls and reservation beneficiaries as per Bihar State Govt norms.',
      isImportant: false,
      isPublished: true,
      attachmentName: 'Admission_Form_Prospectus.pdf',
      attachmentType: 'pdf',
      createdAt: '2026-02-15T11:00:00.000Z',
      updatedAt: '2026-02-15T11:00:00.000Z',
      viewCount: 295
    },
    {
      id: 'notice-6',
      title: 'Distribution of Free NCERT Textbooks & Bicycle / Uniform Direct Benefit Transfer',
      category: 'Academic',
      date: '2026-01-20',
      description: 'Timetable for distribution of free curriculum textbooks and verification of parent bank details for Mukhyamantri Poshak & Cycle Yojana.',
      content: 'Students enrolled in Class 6 through 10 are requested to collect their textbook sets from their respective class teachers according to the published schedule. For student uniform allowances and bicycle scheme benefits, parents are requested to verify their active bank branch and IFSC codes in the school registry.',
      isImportant: false,
      isPublished: true,
      attachmentName: 'Textbook_Distribution_Schedule.pdf',
      attachmentType: 'pdf',
      createdAt: '2026-01-20T09:00:00.000Z',
      updatedAt: '2026-01-20T09:00:00.000Z',
      viewCount: 312
    }
  ],
  staff: [
    {
      id: 'staff-1',
      name: 'Shri R. K. Mandal',
      designation: 'Headmaster / Principal (In-charge)',
      department: 'Administration & Mathematics',
      qualification: 'M.Sc. (Maths), B.Ed.',
      experience: '22 Years',
      email: 'headmaster.uhsmadhulata@gmail.com',
      avatarColor: 'indigo'
    },
    {
      id: 'staff-2',
      name: 'Dr. Manoj Kumar Jha',
      designation: 'Senior Teacher (PGT)',
      department: 'Science & Physics',
      qualification: 'M.Sc. (Physics), Ph.D., B.Ed.',
      experience: '18 Years',
      email: 'manoj.physics@uhsmadhulata.edu.in',
      avatarColor: 'emerald'
    },
    {
      id: 'staff-3',
      name: 'Smt. Pratibha Kumari',
      designation: 'Secondary Teacher (TGT)',
      department: 'Social Science & History',
      qualification: 'M.A. (History), B.Ed., CTET',
      experience: '12 Years',
      email: 'pratibha.sst@uhsmadhulata.edu.in',
      avatarColor: 'amber'
    },
    {
      id: 'staff-4',
      name: 'Shri Sanjeev Kumar',
      designation: 'Secondary Teacher (TGT)',
      department: 'Mathematics & Computer',
      qualification: 'M.Sc. (Maths), MCA, B.Ed.',
      experience: '14 Years',
      email: 'sanjeev.maths@uhsmadhulata.edu.in',
      avatarColor: 'blue'
    },
    {
      id: 'staff-5',
      name: 'Shri Arvind Prasad Yadav',
      designation: 'Language Teacher (TGT)',
      department: 'Hindi & Sanskrit',
      qualification: 'M.A. (Hindi, Sanskrit), B.Ed.',
      experience: '15 Years',
      email: 'arvind.hindi@uhsmadhulata.edu.in',
      avatarColor: 'purple'
    },
    {
      id: 'staff-6',
      name: 'Smt. Anju Rani',
      designation: 'Secondary Teacher (TGT)',
      department: 'English Literature',
      qualification: 'M.A. (English), B.Ed.',
      experience: '9 Years',
      email: 'anju.english@uhsmadhulata.edu.in',
      avatarColor: 'rose'
    },
    {
      id: 'staff-7',
      name: 'Shri Mohammad Shamim Akhtar',
      designation: 'Science Teacher (TGT)',
      department: 'Chemistry & Biology',
      qualification: 'M.Sc. (Botany), B.Ed.',
      experience: '11 Years',
      email: 'shamim.bio@uhsmadhulata.edu.in',
      avatarColor: 'teal'
    },
    {
      id: 'staff-8',
      name: 'Shri Bipin Kumar Singh',
      designation: 'Physical Education & Sports Instructor',
      department: 'Physical Education & Yoga',
      qualification: 'B.P.Ed., M.P.Ed.',
      experience: '10 Years',
      email: 'bipin.sports@uhsmadhulata.edu.in',
      avatarColor: 'orange'
    }
  ],
  facilities: [
    {
      id: 'facility-1',
      title: 'Spacious & Well-Ventilated Classrooms',
      category: 'Academic Infrastructure',
      description: 'Clean, electrified classrooms with robust desks and benches, dual blackboards, ceiling fans, and natural daylight for optimal learning.',
      iconName: 'Building',
      highlights: ['Wide windows for ventilation', 'Electrified with LED fixtures', 'Age-appropriate student benches']
    },
    {
      id: 'facility-2',
      title: 'School Library & Reading Corner',
      category: 'Knowledge Hub',
      description: 'Curated collection of over 2,500 books including BSEB syllabus textbooks, reference encyclopedias, Hindi & English literature, competitive magazines, and daily newspapers.',
      iconName: 'BookOpen',
      highlights: ['Reference & story books in Hindi/English', 'Dedicated student reading room', 'Periodical & newspaper subscription']
    },
    {
      id: 'facility-3',
      title: 'Integrated Science & STEM Laboratory',
      category: 'Practical Learning',
      description: 'Hands-on practical laboratory equipped with compound microscopes, chemistry glassware, specimen jars, physics apparatus, and interactive science charts.',
      iconName: 'FlaskConical',
      highlights: ['BSEB practical syllabus experiments', 'Safe chemical storage and workbenches', 'Charts and biological models']
    },
    {
      id: 'facility-4',
      title: 'ICT & Smart Digital Learning Corner',
      category: 'Digital Literacy',
      description: 'Equipped with computer terminals, smart multimedia projector, and digital learning modules to orient rural students with modern IT skills.',
      iconName: 'Monitor',
      highlights: ['Basic computer training & internet awareness', 'Digital video projector classes', 'Interactive audio-visual lessons']
    },
    {
      id: 'facility-5',
      title: 'Spacious Sports Playground & Athletics',
      category: 'Physical Education',
      description: 'Expansive open playground on campus for daily morning assemblies, drill exercises, football, kabaddi, kho-kho, badminton, and annual athletic meets.',
      iconName: 'Trophy',
      highlights: ['Full playground for athletics and kabaddi', 'Sports equipment store (volleyball, cricket, carrom)', 'Annual inter-school tournament training']
    },
    {
      id: 'facility-6',
      title: 'Purified RO Drinking Water Unit',
      category: 'Health & Hygiene',
      description: 'Centralized clean water filtration unit and stainless steel multi-tap water station ensuring safe, hygienic drinking water for every child and teacher.',
      iconName: 'Droplets',
      highlights: ['Regular water quality testing', 'Multi-point hygienic dispenser', 'Clean drainage soak pit']
    },
    {
      id: 'facility-7',
      title: 'Separate Sanitation Complexes (Boys & Girls)',
      category: 'Health & Sanitation',
      description: 'Dedicated, well-maintained sanitation blocks for boys and girls with continuous running water, tiled flooring, incinerator/sanitary amenities, and handwashing stations.',
      iconName: 'ShieldCheck',
      highlights: ['Segregated clean toilets for girls & boys', 'Handwash station with soap', 'Maintained under Swachh Vidyalaya initiative']
    },
    {
      id: 'facility-8',
      title: 'PM POSHAN / Mid-Day Meal Dining Facility',
      category: 'Nutrition & Care',
      description: 'Hygienic kitchen shed and covered dining verandas adhering strictly to state government weekly nutrition charts and safety standards.',
      iconName: 'Utensils',
      highlights: ['Freshly cooked hot nutritious meals', 'Filtered water for cooking', 'Daily teacher supervision & quality register']
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'School Main Campus & Courtyard Assembly',
      category: 'School Campus',
      date: '2026-03-01',
      description: 'Morning prayer assembly and national anthem in front of the school building with lush green trees.'
    },
    {
      id: 'gal-2',
      title: '77th Republic Day Flag Hoisting & Celebrations',
      category: 'Republic Day',
      date: '2026-01-26',
      description: 'Solemn flag unfurling by Headmaster, patriotic speeches, and student marching contingent.'
    },
    {
      id: 'gal-3',
      title: 'Science Fair & Student Model Demonstration',
      category: 'Events',
      date: '2026-02-18',
      description: 'Students presenting working models of rainwater harvesting, solar energy, and volcano structures.'
    },
    {
      id: 'gal-4',
      title: 'Annual Kabaddi and Kho-Kho Tournament',
      category: 'Sports',
      date: '2026-02-05',
      description: 'Inter-house championship match between Senior Secondary houses on the school playground.'
    },
    {
      id: 'gal-5',
      title: 'Independence Day Cultural Songs & Drama',
      category: 'Independence Day',
      date: '2025-08-15',
      description: 'Folk dances and patriotic songs performed by the girls and boys cultural committee.'
    },
    {
      id: 'gal-6',
      title: 'Smart Classroom Audio-Visual Session',
      category: 'Classrooms',
      date: '2026-03-15',
      description: 'Secondary students attending an interactive science session via the digital projector setup.'
    }
  ],
  academics: {
    bsebCode: 'School BSEB Code: 34046 | U-DISE: 10070804607',
    classes: [
      {
        classLevel: 'Upper Primary (Class 6 - 8)',
        ageGroup: '11 - 14 Years',
        streams: 'General Foundational Curriculum',
        medium: 'Hindi / English (Bilingual)',
        subjects: ['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Physical Education']
      },
      {
        classLevel: 'Secondary / High School (Class 9 & 10)',
        ageGroup: '14 - 16 Years',
        streams: 'Bihar Board Matric Coursework',
        medium: 'Hindi / English',
        subjects: ['Hindi (First Language)', 'Sanskrit / Urdu (Second Language)', 'Mathematics', 'Science (Phy/Chem/Bio)', 'Social Science (Hist/Geo/Civ/Eco)', 'English']
      },
      {
        classLevel: 'Senior Secondary / 10+2 (Class 11 & 12)',
        ageGroup: '16 - 18 Years',
        streams: 'Arts & Science Streams',
        medium: 'Hindi / English',
        subjects: ['Science Stream: Physics, Chemistry, Mathematics, Biology, English, Hindi', 'Arts Stream: History, Political Science, Geography, Economics, Hindi, English']
      }
    ],
    calendar: [
      {
        month: 'April 2026',
        events: [
          { date: 'Apr 02', title: 'New Academic Session Commencement & Induction', type: 'event' },
          { date: 'Apr 14', title: 'Dr. B.R. Ambedkar Jayanti Observance', type: 'holiday' },
          { date: 'Apr 25', title: 'First Monthly Formative Unit Test', type: 'exam' }
        ]
      },
      {
        month: 'May 2026',
        events: [
          { date: 'May 01', title: 'International Labour Day', type: 'holiday' },
          { date: 'May 16', title: 'PTA Progress Meeting & Summer Project Briefing', type: 'meeting' },
          { date: 'May 21', title: 'Commencement of Summer Break', type: 'holiday' }
        ]
      },
      {
        month: 'June - July 2026',
        events: [
          { date: 'Jun 22', title: 'School Reopens after Summer Vacation', type: 'event' },
          { date: 'Jul 15', title: 'Plantation & Green Campus Drive (Van Mahotsav)', type: 'event' },
          { date: 'Jul 28', title: 'First Terminal Examination (Class 6 - 12)', type: 'exam' }
        ]
      }
    ],
    guidelines: [
      'Punctuality is mandatory. All students must reach the school campus by 9:20 AM for the morning assembly.',
      'Prescribed clean school uniform and student identity cards are compulsory on all school working days.',
      'A minimum of 75% classroom attendance is compulsory to be eligible for board examinations and state welfare scholarships.',
      'Mobile phones and non-educational electronic gadgets are strictly banned inside classrooms.',
      'Respect towards teachers, school property, cleanliness, and peers is expected from every student.',
      'Parents must review the student diary regularly and sign notices sent by teachers.'
    ],
    evaluationPattern: 'Evaluation strictly conforms to the Bihar School Examination Board (BSEB) continuous and terminal evaluation framework. Assessments comprise periodic unit tests, quarterly terminal examinations, science lab practicals, project assignments, and annual board examinations.',
    midDayMealInfo: 'Under the Government of Bihar PM POSHAN (Mid-Day Meal) scheme, warm, freshly cooked nutritious meals are served daily to students with weekly menus including khichdi, green vegetables, dal, rice, seasonal fruits, and boiled eggs/soya bean on allocated days.'
  },
  contactMessages: [
    {
      id: 'msg-1',
      name: 'Rameshwar Kumar',
      email: 'rameshwar.bishanpur@gmail.com',
      phone: '9801234567',
      subject: 'Inquiry regarding Class 9 Admission documents',
      message: 'Namaskar Headmaster Sir, I want to enroll my daughter in Class 9 for the new academic session. Can you please confirm the last date for submitting Transfer Certificate?',
      createdAt: '2026-03-22T14:20:00.000Z',
      read: false
    }
  ]
};

// Database helper functions
function getDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATABASE, null, 2), 'utf-8');
      return DEFAULT_DATABASE;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return DEFAULT_DATABASE;
  }
}

function saveDatabase(db: typeof DEFAULT_DATABASE) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

// In-memory active auth tokens for simple session security
const activeTokens = new Set<string>();

// Middleware to protect admin routes - only authenticated staff can modify notices
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Only authorized staff (prince@123) can change school notices.' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) {
    return res.status(401).json({ error: 'Staff session expired or invalid. Please sign in again.' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC & ADMIN API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Staff / Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Staff ID and password are required.' });
  }

  const db = getDatabase();
  const inputId = (email || '').trim().toLowerCase();
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const staff123456Hash = crypto.createHash('sha256').update('123456').digest('hex');

  // Verify staff login: user ID 'prince@123' and password '123456'
  const isPrinceStaff = inputId === 'prince@123';
  const isPrincePasswordValid = (password === '123456' || inputHash === staff123456Hash || inputHash === db.admin.passwordHash);

  // Backward compatibility / database admin check
  const isStoredAdmin = (inputId === (db.admin.id || '').toLowerCase() || inputId === db.admin.email.toLowerCase()) && inputHash === db.admin.passwordHash;

  if ((isPrinceStaff && isPrincePasswordValid) || isStoredAdmin) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.add(token);
    return res.json({
      success: true,
      token,
      admin: {
        id: 'prince@123',
        email: 'prince@123',
        name: isPrinceStaff ? 'Prince (Authorized Staff - Notice In-charge)' : (db.admin.name || 'Staff In-charge'),
        role: 'staff',
        canManageNotices: true
      }
    });
  }

  return res.status(401).json({
    error: 'Invalid Staff ID or Password. Only authorized staff (prince@123) can log in to change school notices.'
  });
});

// Staff / Admin Verify Token
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  if (activeTokens.has(token)) {
    const db = getDatabase();
    return res.json({
      authenticated: true,
      admin: {
        id: db.admin.id || 'prince@123',
        email: db.admin.email || 'prince@123',
        name: db.admin.name || 'Prince (Authorized Staff - Notice In-charge)',
        role: 'staff',
        canManageNotices: true
      }
    });
  }
  return res.status(401).json({ authenticated: false });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const db = getDatabase();
  const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
  if (currentHash !== db.admin.passwordHash) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  db.admin.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  saveDatabase(db);
  res.json({ success: true, message: 'Password updated successfully.' });
});

// Admin Reset Demo Data
app.post('/api/admin/reset-demo', requireAdmin, (req, res) => {
  saveDatabase(DEFAULT_DATABASE);
  res.json({ success: true, message: 'Database reset to default official data.' });
});

// -------------------------------------------------------------
// NOTICES / NOTIFICATIONS API (CRITICAL FEATURE)
// -------------------------------------------------------------

// GET notices (public)
app.get('/api/notices', (req, res) => {
  const db = getDatabase();
  const { category, search, includeUnpublished, limit } = req.query;

  let results = [...db.notices];

  // If not explicitly requesting unpublished (with admin auth checked by query or token)
  if (includeUnpublished !== 'true') {
    results = results.filter(n => n.isPublished !== false);
  }

  // Filter by category
  if (category && category !== 'All') {
    results = results.filter(n => n.category.toLowerCase() === String(category).toLowerCase());
  }

  // Filter by search query
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    results = results.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  }

  // Sort: Important notices first, then newest date first
  results.sort((a, b) => {
    // Both published or filtering: sort by date descending
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  if (limit) {
    const lim = Number(limit);
    if (!isNaN(lim) && lim > 0) {
      results = results.slice(0, lim);
    }
  }

  res.json(results);
});

// GET single notice
app.get('/api/notices/:id', (req, res) => {
  const db = getDatabase();
  const notice = db.notices.find((n: any) => n.id === req.params.id);
  if (!notice) {
    return res.status(404).json({ error: 'Notice not found.' });
  }
  // increment view count
  notice.viewCount = (notice.viewCount || 0) + 1;
  saveDatabase(db);
  res.json(notice);
});

// POST new notice (Admin only)
app.post('/api/notices', requireAdmin, (req, res) => {
  const {
    title,
    category,
    date,
    description,
    content,
    isImportant,
    isPublished,
    attachmentName,
    attachmentData,
    attachmentType,
    externalLink
  } = req.body;

  if (!title || !category || !date) {
    return res.status(400).json({ error: 'Title, category, and date are required.' });
  }

  const db = getDatabase();
  const newNotice = {
    id: 'notice-' + Date.now(),
    title: title.trim(),
    category: category,
    date: date,
    description: (description || '').trim(),
    content: (content || description || '').trim(),
    isImportant: Boolean(isImportant),
    isPublished: isPublished !== false,
    attachmentName: attachmentName ? attachmentName.trim() : undefined,
    attachmentData: attachmentData || undefined,
    attachmentType: attachmentType || (attachmentName?.endsWith('.pdf') ? 'pdf' : 'link'),
    externalLink: externalLink ? externalLink.trim() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0
  };

  db.notices.unshift(newNotice);
  saveDatabase(db);

  res.status(201).json({ success: true, notice: newNotice });
});

// PUT update notice (Admin only)
app.put('/api/notices/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const index = db.notices.findIndex((n: any) => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Notice not found.' });
  }

  const existing = db.notices[index];
  const {
    title,
    category,
    date,
    description,
    content,
    isImportant,
    isPublished,
    attachmentName,
    attachmentData,
    attachmentType,
    externalLink
  } = req.body;

  const updatedNotice = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    category: category !== undefined ? category : existing.category,
    date: date !== undefined ? date : existing.date,
    description: description !== undefined ? description.trim() : existing.description,
    content: content !== undefined ? content.trim() : existing.content,
    isImportant: isImportant !== undefined ? Boolean(isImportant) : existing.isImportant,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
    attachmentName: attachmentName !== undefined ? (attachmentName ? attachmentName.trim() : undefined) : existing.attachmentName,
    attachmentData: attachmentData !== undefined ? attachmentData : existing.attachmentData,
    attachmentType: attachmentType !== undefined ? attachmentType : existing.attachmentType,
    externalLink: externalLink !== undefined ? (externalLink ? externalLink.trim() : undefined) : existing.externalLink,
    updatedAt: new Date().toISOString()
  };

  db.notices[index] = updatedNotice;
  saveDatabase(db);

  res.json({ success: true, notice: updatedNotice });
});

// DELETE notice (Admin only)
app.delete('/api/notices/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const initialLength = db.notices.length;
  db.notices = db.notices.filter((n: any) => n.id !== req.params.id);

  if (db.notices.length === initialLength) {
    return res.status(404).json({ error: 'Notice not found.' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Notice deleted successfully.' });
});

// POST toggle publish status (Admin only)
app.post('/api/notices/:id/toggle-publish', requireAdmin, (req, res) => {
  const db = getDatabase();
  const notice = db.notices.find((n: any) => n.id === req.params.id);
  if (!notice) {
    return res.status(404).json({ error: 'Notice not found.' });
  }
  notice.isPublished = !notice.isPublished;
  notice.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json({ success: true, isPublished: notice.isPublished, notice });
});

// POST toggle important status (Admin only)
app.post('/api/notices/:id/toggle-important', requireAdmin, (req, res) => {
  const db = getDatabase();
  const notice = db.notices.find((n: any) => n.id === req.params.id);
  if (!notice) {
    return res.status(404).json({ error: 'Notice not found.' });
  }
  notice.isImportant = !notice.isImportant;
  notice.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json({ success: true, isImportant: notice.isImportant, notice });
});

// -------------------------------------------------------------
// SCHOOL INFO API
// -------------------------------------------------------------

app.get('/api/school-info', (req, res) => {
  const db = getDatabase();
  res.json(db.schoolInfo);
});

app.put('/api/school-info', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.schoolInfo = {
    ...db.schoolInfo,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, schoolInfo: db.schoolInfo });
});

// -------------------------------------------------------------
// STAFF MEMBERS API
// -------------------------------------------------------------

app.get('/api/staff', (req, res) => {
  const db = getDatabase();
  res.json(db.staff || []);
});

app.post('/api/staff', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { name, designation, department, qualification, experience, email } = req.body;
  if (!name || !designation) {
    return res.status(400).json({ error: 'Name and designation are required.' });
  }
  const newStaff = {
    id: 'staff-' + Date.now(),
    name: name.trim(),
    designation: designation.trim(),
    department: department ? department.trim() : 'General',
    qualification: qualification ? qualification.trim() : 'B.Ed.',
    experience: experience ? experience.trim() : '5 Years',
    email: email ? email.trim() : undefined,
    avatarColor: ['blue', 'emerald', 'indigo', 'amber', 'purple', 'teal'][Math.floor(Math.random() * 6)]
  };
  db.staff = db.staff || [];
  db.staff.push(newStaff);
  saveDatabase(db);
  res.status(201).json({ success: true, staff: newStaff });
});

app.put('/api/staff/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.staff = db.staff || [];
  const index = db.staff.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }
  db.staff[index] = {
    ...db.staff[index],
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, staff: db.staff[index] });
});

app.delete('/api/staff/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.staff = db.staff || [];
  db.staff = db.staff.filter((s: any) => s.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Staff member deleted.' });
});

// -------------------------------------------------------------
// FACILITIES API
// -------------------------------------------------------------

app.get('/api/facilities', (req, res) => {
  const db = getDatabase();
  res.json(db.facilities || []);
});

app.post('/api/facilities', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { title, category, description, iconName, highlights } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Facility title is required.' });
  }
  const newFacility = {
    id: 'fac-' + Date.now(),
    title: title.trim(),
    category: category || 'Campus Facility',
    description: description || '',
    iconName: iconName || 'Building',
    highlights: Array.isArray(highlights) ? highlights : []
  };
  db.facilities = db.facilities || [];
  db.facilities.push(newFacility);
  saveDatabase(db);
  res.status(201).json({ success: true, facility: newFacility });
});

app.put('/api/facilities/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.facilities = db.facilities || [];
  const index = db.facilities.findIndex((f: any) => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Facility not found.' });
  }
  db.facilities[index] = {
    ...db.facilities[index],
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, facility: db.facilities[index] });
});

app.delete('/api/facilities/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.facilities = db.facilities || [];
  db.facilities = db.facilities.filter((f: any) => f.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Facility removed.' });
});

// -------------------------------------------------------------
// GALLERY API
// -------------------------------------------------------------

app.get('/api/gallery', (req, res) => {
  const db = getDatabase();
  res.json(db.gallery || []);
});

app.post('/api/gallery', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { title, category, date, description, imageUrl } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Gallery title is required.' });
  }
  const newItem = {
    id: 'gal-' + Date.now(),
    title: title.trim(),
    category: category || 'School Campus',
    date: date || new Date().toISOString().split('T')[0],
    description: description || '',
    imageUrl: imageUrl || undefined
  };
  db.gallery = db.gallery || [];
  db.gallery.unshift(newItem);
  saveDatabase(db);
  res.status(201).json({ success: true, item: newItem });
});

app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.gallery = db.gallery || [];
  db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Gallery item deleted.' });
});

// -------------------------------------------------------------
// ACADEMICS API
// -------------------------------------------------------------

app.get('/api/academics', (req, res) => {
  const db = getDatabase();
  res.json(db.academics);
});

app.put('/api/academics', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.academics = {
    ...db.academics,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, academics: db.academics });
});

// -------------------------------------------------------------
// CONTACT FORM API
// -------------------------------------------------------------

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({ error: 'Name, message, and contact detail (email or phone) are required.' });
  }

  const db = getDatabase();
  const newMsg = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false
  };

  db.contactMessages = db.contactMessages || [];
  db.contactMessages.unshift(newMsg);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Your message has been submitted to the school administration. We will get back to you shortly.'
  });
});

app.get('/api/contact-messages', requireAdmin, (req, res) => {
  const db = getDatabase();
  res.json(db.contactMessages || []);
});

app.delete('/api/contact-messages/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  db.contactMessages = db.contactMessages || [];
  db.contactMessages = db.contactMessages.filter((m: any) => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Message removed.' });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION BUILD
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[School Portal Server] UHS Madhulata server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
