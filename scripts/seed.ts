import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex !== -1) {
        const key = trimmed.substring(0, equalsIndex).trim();
        let value = trimmed.substring(equalsIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

import User from '../src/models/User';
import Fest from '../src/models/Fest';
import Category from '../src/models/Category';
import Team from '../src/models/Team';
import Item from '../src/models/Item';
import Participant from '../src/models/Participant';
import GroupEntry from '../src/models/GroupEntry';
import Result from '../src/models/Result';
import Program from '../src/models/Program';
import Update from '../src/models/Update';
import Faq from '../src/models/Faq';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI as string);
  console.log('✅ Connected to Database.');

  // 1. Admin User
  const adminEmail = 'adnanmuhammedk2@gmail.com';
  let user = await User.findOne({ email: adminEmail });

  if (!user) {
    console.log('👤 Creating Admin User...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('D&tv#7t@p08ek5fF!0S3', salt);
    user = await User.create({
      email: adminEmail,
      passwordHash,
      name: 'Adnan Muhammed',
    });
    console.log(`✅ Admin user created with ID: ${user._id}`);
  } else {
    console.log(`ℹ️ Admin user already exists with ID: ${user._id}`);
  }

  // 2. Fest
  const festSlug = 'meelad-fest-2026';
  let fest = await Fest.findOne({ slug: festSlug });

  if (fest) {
    console.log(`🧹 Cleaning existing test data for fest "${fest.festName}"...`);
    await Category.deleteMany({ festId: fest._id });
    await Team.deleteMany({ festId: fest._id });
    await Item.deleteMany({ festId: fest._id });
    await Participant.deleteMany({ festId: fest._id });
    await GroupEntry.deleteMany({ festId: fest._id });
    await Result.deleteMany({ festId: fest._id });
    await Program.deleteMany({ festId: fest._id });
    await Update.deleteMany({ festId: fest._id });
    await Faq.deleteMany({ festId: fest._id });
  } else {
    console.log('🎪 Creating new Fest...');
    fest = await Fest.create({
      ownerId: user._id,
      slug: festSlug,
      festName: 'Meelad Fest 2026',
      madrasaName: 'Al-Madrasathul Islamiyya, Calicut',
      area: 'Kozhikode City',
      district: 'Kozhikode',
      date: '2026-09-15',
      venue: 'Grand Stage & Campus Auditorium',
      description: 'Annual State-Level Meelad Fest Cultural & Literary Competitions',
      pointsConfig: {
        first: 5,
        second: 3,
        third: 1,
        groupMultiplier: 1.5,
      },
      isActive: true,
      isDeleted: false,
    });
    console.log(`✅ Fest created: ${fest.festName} (${fest.slug})`);
  }

  // 3. Categories
  console.log('🏷️ Creating Categories...');
  const categoriesData = [
    { name: 'Sub-Junior', ageRange: '6 - 9 Years' },
    { name: 'Junior', ageRange: '10 - 13 Years' },
    { name: 'Senior', ageRange: '14 - 17 Years' },
    { name: 'Super Senior', ageRange: '18+ Years' },
  ];

  const categories = await Category.insertMany(
    categoriesData.map((cat) => ({ festId: fest!._id, ...cat }))
  );
  console.log(`✅ ${categories.length} Categories created.`);

  const catMap = new Map(categories.map((c) => [c.name, c._id]));

  // 4. Teams
  console.log('🛡️ Creating Teams...');
  const teamsData = [
    { name: 'Team Badar', color: '#10B981' }, // Emerald
    { name: 'Team Uhud', color: '#3B82F6' }, // Royal Blue
    { name: 'Team Arafat', color: '#EF4444' }, // Red
    { name: 'Team Mina', color: '#F59E0B' }, // Amber
  ];

  const teams = await Team.insertMany(
    teamsData.map((t) => ({ festId: fest!._id, ...t }))
  );
  console.log(`✅ ${teams.length} Teams created.`);

  const teamMap = new Map(teams.map((t) => [t.name, t._id]));

  // 5. Items
  console.log('📜 Creating Items...');
  const itemsData = [
    {
      name: 'Quran Tilawat',
      categoryId: catMap.get('Sub-Junior'),
      type: 'single' as const,
      description: 'Holy Quran Recitation with Tajweed',
    },
    {
      name: 'Madh Song',
      categoryId: catMap.get('Sub-Junior'),
      type: 'single' as const,
      description: 'Prophetic Praise Song in Malayalam/Arabic',
    },
    {
      name: 'Arabic Speech',
      categoryId: catMap.get('Junior'),
      type: 'single' as const,
      description: '3-Minute Elocution on Seerah',
    },
    {
      name: 'Calligraphy Art',
      categoryId: catMap.get('Junior'),
      type: 'single' as const,
      description: 'Arabic Calligraphy Competition',
    },
    {
      name: 'Islamic History Quiz',
      categoryId: catMap.get('Senior'),
      type: 'single' as const,
      description: 'Comprehensive Quiz on Seerah & Islamic History',
    },
    {
      name: 'Essay Writing',
      categoryId: catMap.get('Senior'),
      type: 'single' as const,
      description: 'Malayalam Essay on Moral Values',
    },
    {
      name: 'Group Songs (Madh Choir)',
      categoryId: catMap.get('Senior'),
      type: 'group' as const,
      description: 'Group Song Competition (Max 6 Members)',
      maxParticipantsPerTeam: 6,
    },
    {
      name: 'Duffmattu Performance',
      categoryId: catMap.get('Super Senior'),
      type: 'group' as const,
      description: 'Traditional Duff Performance (Max 5 Members)',
      maxParticipantsPerTeam: 5,
    },
  ];

  const items = await Item.insertMany(
    itemsData.map((item) => ({ festId: fest!._id, ...item }))
  );
  console.log(`✅ ${items.length} Items created.`);

  const itemMap = new Map(items.map((i) => [i.name, i]));

  // 6. Participants
  console.log('👨‍🎓 Registering Participants...');
  const participantsData = [
    // Sub-Junior
    { chestNo: 'B101', name: 'Muhammed Raihan', teamName: 'Team Badar', catName: 'Sub-Junior', itemName: 'Quran Tilawat' },
    { chestNo: 'U102', name: 'Bilal Haneef', teamName: 'Team Uhud', catName: 'Sub-Junior', itemName: 'Quran Tilawat' },
    { chestNo: 'A103', name: 'Yusuf Sha', teamName: 'Team Arafat', catName: 'Sub-Junior', itemName: 'Madh Song' },
    { chestNo: 'M104', name: 'Ihsan Muhammed', teamName: 'Team Mina', catName: 'Sub-Junior', itemName: 'Madh Song' },
    
    // Junior
    { chestNo: 'B201', name: 'Ahammed Kabeer', teamName: 'Team Badar', catName: 'Junior', itemName: 'Arabic Speech' },
    { chestNo: 'U202', name: 'Umar Mukhtar', teamName: 'Team Uhud', catName: 'Junior', itemName: 'Arabic Speech' },
    { chestNo: 'A203', name: 'Rayan Farooq', teamName: 'Team Arafat', catName: 'Junior', itemName: 'Calligraphy Art' },
    { chestNo: 'M204', name: 'Danish Nazeer', teamName: 'Team Mina', catName: 'Junior', itemName: 'Calligraphy Art' },

    // Senior
    { chestNo: 'B301', name: 'Salman Faris', teamName: 'Team Badar', catName: 'Senior', itemName: 'Islamic History Quiz' },
    { chestNo: 'U302', name: 'Khalid Bin Waleed', teamName: 'Team Uhud', catName: 'Senior', itemName: 'Islamic History Quiz' },
    { chestNo: 'A303', name: 'Tariq Ziyad', teamName: 'Team Arafat', catName: 'Senior', itemName: 'Essay Writing' },
    { chestNo: 'M304', name: 'Firoz Khan', teamName: 'Team Mina', catName: 'Senior', itemName: 'Essay Writing' },

    // Super Senior
    { chestNo: 'B401', name: 'Zayd Abdul Rahman', teamName: 'Team Badar', catName: 'Super Senior', itemName: 'Duffmattu Performance' },
    { chestNo: 'U402', name: 'Hamza Ibn Ali', teamName: 'Team Uhud', catName: 'Super Senior', itemName: 'Duffmattu Performance' },
    { chestNo: 'A403', name: 'Ameen Ahsan', teamName: 'Team Arafat', catName: 'Super Senior', itemName: 'Duffmattu Performance' },
    { chestNo: 'M404', name: 'Rashid Ahammed', teamName: 'Team Mina', catName: 'Super Senior', itemName: 'Duffmattu Performance' },
  ];

  const participantDocs = [];
  for (const p of participantsData) {
    const teamId = teamMap.get(p.teamName)!;
    const categoryId = catMap.get(p.catName)!;
    const item = itemMap.get(p.itemName);
    const itemIds = item ? [item._id] : [];

    const doc = await Participant.create({
      festId: fest._id,
      chestNo: p.chestNo,
      name: p.name,
      teamId,
      categoryId,
      itemIds,
      addedBy: user._id,
      addedAt: new Date(),
    });
    participantDocs.push(doc);
  }
  console.log(`✅ ${participantDocs.length} Participants registered.`);

  // 7. Group Entries
  console.log('👥 Creating Group Entries...');
  const groupSongItem = itemMap.get('Group Songs (Madh Choir)')!;
  const groupEntries = [];

  for (const team of teams) {
    const entry = await GroupEntry.create({
      festId: fest._id,
      itemId: groupSongItem._id,
      teamId: team._id,
      participants: [
        { name: `${team.name} Singer 1`, chestNo: `${team.name.charAt(5)}G1` },
        { name: `${team.name} Singer 2`, chestNo: `${team.name.charAt(5)}G2` },
        { name: `${team.name} Singer 3`, chestNo: `${team.name.charAt(5)}G3` },
      ],
      addedBy: user._id,
    });
    groupEntries.push(entry);
  }
  console.log(`✅ ${groupEntries.length} Group Entries created.`);

  // 8. Results
  console.log('🏆 Entering Test Results...');
  const quranItem = itemMap.get('Quran Tilawat')!;
  const quranParticipants = participantDocs.filter((p) => p.itemIds.includes(quranItem._id as any));

  if (quranParticipants.length >= 2) {
    // 1st Place: Muhammed Raihan (Team Badar)
    await Result.create({
      festId: fest._id,
      itemId: quranItem._id,
      categoryId: quranItem.categoryId,
      teamId: quranParticipants[0].teamId,
      itemType: 'single',
      participantId: quranParticipants[0]._id,
      position: 1,
      points: 5,
    });
    // 2nd Place: Bilal Haneef (Team Uhud)
    await Result.create({
      festId: fest._id,
      itemId: quranItem._id,
      categoryId: quranItem.categoryId,
      teamId: quranParticipants[1].teamId,
      itemType: 'single',
      participantId: quranParticipants[1]._id,
      position: 2,
      points: 3,
    });
  }

  const speechItem = itemMap.get('Arabic Speech')!;
  const speechParticipants = participantDocs.filter((p) => p.itemIds.includes(speechItem._id as any));

  if (speechParticipants.length >= 2) {
    // 1st Place: Umar Mukhtar (Team Uhud)
    await Result.create({
      festId: fest._id,
      itemId: speechItem._id,
      categoryId: speechItem.categoryId,
      teamId: speechParticipants[1].teamId,
      itemType: 'single',
      participantId: speechParticipants[1]._id,
      position: 1,
      points: 5,
    });
    // 2nd Place: Ahammed Kabeer (Team Badar)
    await Result.create({
      festId: fest._id,
      itemId: speechItem._id,
      categoryId: speechItem.categoryId,
      teamId: speechParticipants[0].teamId,
      itemType: 'single',
      participantId: speechParticipants[0]._id,
      position: 2,
      points: 3,
    });
  }

  // Group Song Result
  await Result.create({
    festId: fest._id,
    itemId: groupSongItem._id,
    categoryId: groupSongItem.categoryId,
    teamId: teams[0]._id, // Team Badar
    itemType: 'group',
    groupEntryId: groupEntries[0]._id,
    position: 1,
    points: 7.5, // 5 * 1.5 multiplier
  });

  await Result.create({
    festId: fest._id,
    itemId: groupSongItem._id,
    categoryId: groupSongItem.categoryId,
    teamId: teams[1]._id, // Team Uhud
    itemType: 'group',
    groupEntryId: groupEntries[1]._id,
    position: 2,
    points: 4.5, // 3 * 1.5 multiplier
  });
  console.log('✅ Test Results entered and scored.');

  // 9. Schedule / Programs
  console.log('📅 Adding Schedule Programs...');
  const programsData = [
    { time: '08:00 AM', title: 'Inauguration Ceremony & Flag Hoisting', description: 'Grand Opening by Chief Guest & Madrasa Management', order: 1 },
    { time: '09:00 AM', title: 'Sub-Junior Quran Tilawat & Madh Songs', description: 'Stage 1 (Auditorium)', order: 2 },
    { time: '11:00 AM', title: 'Junior Arabic Elocution & Calligraphy', description: 'Stage 2 (Hall B)', order: 3 },
    { time: '02:00 PM', title: 'Group Duffmattu & Choir Competitions', description: 'Main Open Stage', order: 4 },
    { time: '05:30 PM', title: 'Grand Valedictory & Prize Distribution', description: 'Closing Remarks and Champion Trophy Awarding', order: 5 },
  ];

  await Program.insertMany(
    programsData.map((p) => ({ festId: fest!._id, ...p }))
  );
  console.log('✅ Schedule programs added.');

  // 10. Updates
  console.log('📢 Posting Announcements...');
  const updatesData = [
    { text: '🎉 Registration is officially open for Meelad Fest 2026! Welcome all participating madrasa teams.' },
    { text: '📢 Stage 1 & Stage 2 venue assignments have been finalized. Check the Schedule tab for full details.' },
    { text: '🏆 Overall Championship Trophy unveiled! Best of luck to Team Badar, Team Uhud, Team Arafat, and Team Mina.' },
  ];

  await Update.insertMany(
    updatesData.map((u) => ({ festId: fest!._id, ...u }))
  );
  console.log('✅ Announcements posted.');

  // 11. FAQs
  console.log('❓ Adding FAQs...');
  const faqsData = [
    { question: 'Who is eligible to participate in Meelad Fest?', answer: 'Registered students of Al-Madrasathul Islamiyya enrolled for the current academic year.', order: 1 },
    { question: 'How are team points calculated for group events?', answer: 'Group items receive a 1.5x multiplier on first (7.5 pts), second (4.5 pts), and third (1.5 pts) place scores.', order: 2 },
    { question: 'Where can I download my participation or merit certificate?', answer: 'Certificates can be looked up and downloaded directly using your Chest Number on the public portal.', order: 3 },
  ];

  await Faq.insertMany(
    faqsData.map((f) => ({ festId: fest!._id, ...f }))
  );
  console.log('✅ FAQs added.');

  console.log('\n🎉 Seed process completed successfully!');
  console.log(`Fest Slug: ${fest.slug}`);
  console.log(`Fest URL: https://meelad-fest-kerala.vercel.app/fests/${fest.slug}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
