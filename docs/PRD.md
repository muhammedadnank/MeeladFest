# PRD — MeeladFest (Multi-Tenant Madrasa Fest Platform)

## 1.1 പ്രശ്നം
കേരളത്തിലെ നൂറുകണക്കിന് മദ്രസകൾ എല്ലാ വർഷവും Meelad Fest നടത്തുന്നു — kalolsavam pole thanne oro madrasa-yum students-e teams (houses) ആയി divide ചെയ്ത്, categories (Sub Junior/Junior/Senior/Super Senior) അനുസരിച്ച് items/competitions നടത്തി points/leaderboard track ചെയ്യുന്നു. Ippol ithokke WhatsApp groups ഉം paper forms ഉം manual ആയാണ് കൈകാര്യം ചെയ്യുന്നത്.

## 1.2 ലക്ഷ്യം
Oru single Next.js web app, അതിൽ **ഏത് madrasa-ക്കും ustad/admin signup ചെയ്ത് സ്വന്തം Meelad Fest page ഉണ്ടാക്കാം** (unique URL slug), teams/categories/items/participants/results ellam admin-ഉം sub-admins-ഉം ചേർന്ന് manage ചെയ്യാം, public-ന് live leaderboard + individual championship + certificates + updates + gallery + FAQ + feedback okke കാണാം — ഒരു shared free-tier deployment-ൽ.

## 1.3 Users
- **Super Admin (Fest Owner)** — fest create ചെയ്യും, teams/categories/items setup ചെയ്യും, participants/results data entry ചെയ്യും, sub-admins invite ചെയ്യും (permissions സെറ്റ് ചെയ്ത്), fest settings/delete control ചെയ്യും, sub-admins-ന്റെ activity log (ആരെന്ത് add/edit ചെയ്തു) കാണും.
- **Sub-Admin (ഉസ്താദുമാർ)** — Super Admin invite ചെയ്യുന്ന, limited/configurable permissions ഉള്ള അഡ്മിൻ (ഉദാ: participants add ചെയ്യാം, results enter ചെയ്യാം — പക്ഷേ fest settings/delete/other-admins manage ചെയ്യാൻ പറ്റില്ല).
- **Public Visitor** — fest page കാണും: program, gallery, updates, team leaderboard, individual championship, FAQ. Feedback സമർപ്പിക്കും. സ്വന്തം Chest No / Fest ID നൽകി certificate download ചെയ്യും.

## 1.4 Core Features (v1)

### Auth
Email + password (NextAuth Credentials) — Super Admin & Sub-Admins രണ്ടിനും. Public visitors/participants-ന് login വേണ്ട.

### Fest Setup (Super Admin only)
- Fest basic info: name, madrasa, date, venue, description, banner.
- **Teams**: custom teams (ഉദാ: Team Fatah, Team Badr).
- **Categories**: custom categories (ഉദാ: Sub Junior, Junior, Senior, Super Senior) — age range koode.
- **Items**: ഓരോ category-ക്കും items, Single/Group type, points config.
- **Sub-Admins**: email വഴി invite ചെയ്യും, ഓരോ sub-admin-നും individual ആയി permissions toggle ചെയ്യും (Participants manage, Results manage, Updates manage, Gallery manage — ഓരോന്നും on/off ചെയ്യാം). Access revoke ചെയ്താൽ (soft) — ആ sub-admin-ന് access പോകും, പക്ഷേ ആരൊക്കെ എപ്പോൾ access ഉണ്ടായിരുന്നു എന്ന history നിലനിൽക്കും.
- **Fest Delete**: Owner fest "delete" ചെയ്താൽ അത് public-ൽ നിന്നും dashboard listing-ൽ നിന്നും hide ആകും മാത്രം — teams/participants/results/gallery തുടങ്ങിയ ഒരു data-യും permanently നഷ്ടപ്പെടില്ല, owner-ന് പിന്നീട് restore ചെയ്യാം.

### Participant & Results Data Entry (Super Admin + permitted Sub-Admins)
- **No public registration form** — admin/sub-admin dashboard-ൽ നിന്ന് നേരിട്ട് participant add ചെയ്യും: chestNo (Chest No / Fest ID), name, phone (optional), team, category, single items (multi-select) — ഒറ്റ ഫോമിൽ. Team assignment admin manual ആയി ചെയ്യും.
- Group items-ന് group-entry ഉണ്ടാക്കും: team + item + participants list (name + chestNo).
- Results: single item-ന് 1st/2nd/3rd participant, group item-ന് 1st/2nd/3rd team — enter ചെയ്യും.

### Public Fest Page
- Hero + countdown + venue/date.
- Program schedule.
- Gallery grid.
- Live updates feed (polling).
- **Team Leaderboard**: category-wise + overall.
- **Individual Championship**: single items-ന്റെ points അടിസ്ഥാനത്തിൽ, category-wise + overall.
- **FAQ section**: accordion ആയി.
- **Feedback form**: rating + comment.
- **Certificate download**: Chest No / Fest ID നൽകി lookup ചെയ്യും (login വേണ്ട).

### Certificates (PDF)
- **Participation certificate**: register ചെയ്ത ഏതൊരാൾക്കും ലഭ്യം. Group item-ൽ മാത്രം പങ്കെടുത്തവർക്ക് ഇത് download ചെയ്യണമെങ്കിൽ group entry-യിൽ അവരുടെ Chest No കൊടുത്തിരിക്കണം.
- **Winner certificate**: 1st/2nd/3rd നേടിയവർക്ക് പ്രത്യേക design (position, item name സഹിതം).
- Public certificate page-ൽ Chest No / Fest ID match ചെയ്താൽ download ചെയ്യാം.
- Admin dashboard-ൽ നിന്ന് bulk generate/download ചെയ്യാനും പറ്റും.

### Discovery
Homepage-ൽ എല്ലാ active fests-ഉം list.

## 1.5 Out of Scope (v1)
Payments, SMS/WhatsApp notifications, multi-language UI toggle, judges panel, item clash detection, QR check-in, grade system (A/B/C), fest-creation approval workflow.

## 1.6 Success Criteria
- Super Admin-ന് fest + teams + categories + items setup ചെയ്യാൻ 20 minute-നുള്ളിൽ പറ്റണം.
- Sub-admin invite ചെയ്ത് permissions സെറ്റ് ചെയ്യാൻ 1 minute മതി.
- Result enter ചെയ്താൽ ഉടനെ team leaderboard-ഉം individual championship-ഉം update ആകണം (30s polling-നുള്ളിൽ).
- Participant-ന് സ്വന്തം certificate 1 minute-നുള്ളിൽ download ചെയ്യാൻ പറ്റണം.
- Free tiers-ൽ full ആയി work ചെയ്യണം: Vercel, MongoDB Atlas, Cloudinary.
