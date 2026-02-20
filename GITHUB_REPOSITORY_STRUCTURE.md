# F-KOD GitHub Repository Structure & Organization Guide

## Repository Overview

**Repository Name:** fkod  
**Owner:** lekesiz  
**URL:** https://github.com/lekesiz/fkod  
**Visibility:** Public  
**License:** MIT  
**Total Commits:** 25+ major commits  
**Total Files:** 45+ documentation + code files  
**Total Size:** ~5MB  

---

## Directory Structure

```
fkod/
├── README.md                                    # Main project README
├── LICENSE                                      # MIT License
├── CHANGELOG.md                                 # Version history
├── CONTRIBUTING.md                              # Contribution guidelines
├── .gitignore                                   # Git ignore rules
│
├── docs/                                        # Documentation folder
│   ├── MVP_ETAP_1_TEST_SORULARI.md             # MVP Phase 1 test questions
│   ├── MVP_ETAP_2_TASARIM.md                   # MVP Phase 2 design
│   ├── MVP_ETAP_3_PROMPTS.md                   # MVP Phase 3 ChatGPT prompts
│   ├── MVP_ETAP_4_MAKE_AUTOMATION.md           # MVP Phase 4 Make.com automation
│   ├── MVP_ETAP_5_TESTING_DEPLOYMENT.md        # MVP Phase 5 testing & deployment
│   │
│   ├── ASAMA_2_TEKNIK_MIMARI.md                # Phase 2 technical architecture
│   ├── ASAMA_2_PROJE_PLANI.md                  # Phase 2 project plan
│   ├── ASAMA_2_PRODUCTION_DEPLOYMENT_PLAN.md   # Phase 2 deployment plan
│   ├── ASAMA_2_DATABASE_MIGRATION.md           # Phase 2 database migration
│   ├── ASAMA_2_BACKEND_DEPLOYMENT.md           # Phase 2 backend deployment
│   ├── ASAMA_2_FRONTEND_DEPLOYMENT.md          # Phase 2 frontend deployment
│   ├── ASAMA_2_SECURITY_SSL.md                 # Phase 2 security & SSL
│   ├── ASAMA_2_MONITORING_PERFORMANCE.md       # Phase 2 monitoring & optimization
│   ├── ASAMA_2_BACKUP_DISASTER_RECOVERY.md     # Phase 2 backup & recovery
│   │
│   ├── ASAMA_3_MOBILE_APP_ARCHITECTURE.md      # Phase 3 mobile app architecture
│   ├── ASAMA_3_HAFTA_1_2_IMPLEMENTATION.md     # Phase 3 weeks 1-2 implementation
│   ├── ASAMA_3_HAFTA_3_8_IMPLEMENTATION.md     # Phase 3 weeks 3-8 implementation
│   │
│   ├── ASAMA_4_ADVANCED_FEATURES_ARCHITECTURE.md      # Phase 4 advanced features
│   ├── ASAMA_4_ADVANCED_FEATURES_IMPLEMENTATION.md    # Phase 4 implementation
│   │
│   ├── ASAMA_5_INTERNATIONAL_EXPANSION.md             # Phase 5 international expansion
│   ├── ASAMA_5_INTERNATIONAL_EXPANSION_IMPLEMENTATION.md # Phase 5 implementation
│   │
│   ├── F_KOD_DEPLOYMENT_LAUNCH_STRATEGY.md    # Deployment & launch strategy
│   ├── F_KOD_MARKETING_GROWTH_STRATEGY.md     # Marketing & growth strategy
│   └── MVP_SOFT_LAUNCH_*.md                   # MVP soft launch documentation (5 files)
│
├── backend/                                     # Backend code
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── mentorController.js
│   │   │   ├── messageController.js
│   │   │   ├── courseController.js
│   │   │   ├── courseModuleController.js
│   │   │   ├── certificateController.js
│   │   │   ├── communityController.js
│   │   │   └── eventController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Mentor.js
│   │   │   ├── Message.js
│   │   │   ├── Course.js
│   │   │   ├── CourseModule.js
│   │   │   ├── UserProgress.js
│   │   │   ├── Certificate.js
│   │   │   ├── CommunityPost.js
│   │   │   ├── CommunityComment.js
│   │   │   └── Event.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── mentorRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── certificateRoutes.js
│   │   │   ├── communityRoutes.js
│   │   │   └── eventRoutes.js
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
│
├── frontend/                                    # Frontend code
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── cn.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── content/                                     # Content files
│   ├── test-sorulari/
│   │   └── sorular.json
│   ├── arketipler/
│   │   └── arketipler.json
│   └── prompts/
│       ├── master_prompt.md
│       ├── archetype_prompts.json
│       └── report_template.md
│
├── todo-lists/                                  # Role-based todo lists
│   ├── 1_proje_yoneticisi.md
│   ├── 2_ux_ui_tasarimci.md
│   ├── 3_frontend_gelistirici.md
│   ├── 4_backend_gelistirici.md
│   ├── 5_prompt_muhendisi.md
│   ├── 6_qa_uzmanı.md
│   └── 7_devops_sistem_yoneticisi.md
│
├── F_KOD_EXECUTIVE_SUMMARY.md                  # Executive summary for investors
├── F_KOD_COMPREHENSIVE_PROJECT_REPORT.md       # Comprehensive project report
├── F_KOD_FINAL_PROJECT_REPORT.md               # Final project report
├── MVP_OZET_RAPORU.md                          # MVP summary report
└── ASAMA_2_FINAL_RAPORU.md                     # Phase 2 final report
```

---

## File Organization by Category

### 1. Main Documentation (Root Level)

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Project overview and quick start | Everyone |
| LICENSE | MIT License | Legal/Compliance |
| CHANGELOG.md | Version history and updates | Developers |
| CONTRIBUTING.md | Contribution guidelines | Contributors |
| F_KOD_EXECUTIVE_SUMMARY.md | 1-page investor summary | Investors |
| F_KOD_COMPREHENSIVE_PROJECT_REPORT.md | 50+ page project report | Stakeholders |

### 2. Documentation Folder (docs/)

**MVP Phase Documentation:**
- MVP_ETAP_1_TEST_SORULARI.md - Test questions and archetype definitions
- MVP_ETAP_2_TASARIM.md - Landing page design
- MVP_ETAP_3_PROMPTS.md - ChatGPT prompts and report templates
- MVP_ETAP_4_MAKE_AUTOMATION.md - Make.com automation workflow
- MVP_ETAP_5_TESTING_DEPLOYMENT.md - Testing and deployment plan

**Phase 2 Documentation (Production Deployment):**
- ASAMA_2_TEKNIK_MIMARI.md - Technical architecture (76+ endpoints, 13 tables)
- ASAMA_2_PROJE_PLANI.md - Project plan and timeline
- ASAMA_2_PRODUCTION_DEPLOYMENT_PLAN.md - Deployment strategy
- ASAMA_2_DATABASE_MIGRATION.md - Database setup and migration
- ASAMA_2_BACKEND_DEPLOYMENT.md - Heroku backend deployment
- ASAMA_2_FRONTEND_DEPLOYMENT.md - Vercel frontend deployment
- ASAMA_2_SECURITY_SSL.md - Security hardening and SSL/HTTPS
- ASAMA_2_MONITORING_PERFORMANCE.md - Monitoring and optimization
- ASAMA_2_BACKUP_DISASTER_RECOVERY.md - Backup and disaster recovery

**Phase 3 Documentation (Mobile App):**
- ASAMA_3_MOBILE_APP_ARCHITECTURE.md - Mobile app architecture
- ASAMA_3_HAFTA_1_2_IMPLEMENTATION.md - Setup and core components
- ASAMA_3_HAFTA_3_8_IMPLEMENTATION.md - Feature implementation (auth, notifications, offline, native)

**Phase 4 Documentation (Advanced Features):**
- ASAMA_4_ADVANCED_FEATURES_ARCHITECTURE.md - AI recommendations, video streaming, live sessions
- ASAMA_4_ADVANCED_FEATURES_IMPLEMENTATION.md - Implementation details

**Phase 5 Documentation (International Expansion):**
- ASAMA_5_INTERNATIONAL_EXPANSION.md - International expansion strategy
- ASAMA_5_INTERNATIONAL_EXPANSION_IMPLEMENTATION.md - Implementation details

**Strategic Documentation:**
- F_KOD_DEPLOYMENT_LAUNCH_STRATEGY.md - Go-live strategy
- F_KOD_MARKETING_GROWTH_STRATEGY.md - Marketing and growth plan

### 3. Backend Code (backend/)

**Configuration:**
- src/config/database.js - PostgreSQL connection
- src/config/schema.sql - Database schema (13 tables)

**Controllers (9 files):**
- authController.js - Authentication logic
- userController.js - User management
- mentorController.js - Mentor operations
- messageController.js - Messaging system
- courseController.js - Course management
- courseModuleController.js - Course modules
- certificateController.js - Certificate issuance
- communityController.js - Community posts and comments
- eventController.js - Event management

**Models (10 files):**
- User.js, Mentor.js, Message.js, Course.js, CourseModule.js
- UserProgress.js, Certificate.js, CommunityPost.js, CommunityComment.js, Event.js

**Routes (8 files):**
- authRoutes.js, userRoutes.js, mentorRoutes.js, messageRoutes.js
- courseRoutes.js, certificateRoutes.js, communityRoutes.js, eventRoutes.js

**Middleware:**
- auth.js - JWT authentication middleware

**Main Entry:**
- index.js - Express app initialization (76+ endpoints)

### 4. Frontend Code (frontend/)

**Components:**
- Button.jsx - Reusable button component (4 variants)
- Navigation.jsx - Top navigation bar

**Pages:**
- Dashboard.jsx - Main user dashboard
- Login.jsx - Login page
- Register.jsx - Registration page

**State Management:**
- store/authStore.js - Zustand auth store

**Utilities:**
- utils/api.js - Axios API client
- utils/cn.js - Tailwind className utility

**Styling:**
- styles/globals.css - Global styles and Tailwind configuration

**Configuration:**
- tailwind.config.js - Tailwind CSS configuration
- postcss.config.js - PostCSS configuration
- vite.config.js - Vite build configuration

### 5. Content Files (content/)

**Test Questions:**
- content/test-sorulari/sorular.json - 10 scenario-based questions

**Archetypes:**
- content/arketipler/arketipler.json - 12 archetype definitions

**Prompts:**
- content/prompts/master_prompt.md - Master ChatGPT prompt
- content/prompts/archetype_prompts.json - 12 archetype-specific prompts
- content/prompts/report_template.md - PDF report template

### 6. Role-Based Todo Lists (todo-lists/)

- 1_proje_yoneticisi.md - Project Manager tasks
- 2_ux_ui_tasarimci.md - UX/UI Designer tasks
- 3_frontend_gelistirici.md - Frontend Developer tasks
- 4_backend_gelistirici.md - Backend Developer tasks
- 5_prompt_muhendisi.md - Prompt Engineer tasks
- 6_qa_uzmanı.md - QA Expert tasks
- 7_devops_sistem_yoneticisi.md - DevOps/System Admin tasks

---

## File Naming Conventions

### Documentation Files
- **Format:** `ASAMA_X_DESCRIPTION.md` or `MVP_ETAP_X_DESCRIPTION.md`
- **Example:** `ASAMA_2_PRODUCTION_DEPLOYMENT_PLAN.md`
- **Convention:** UPPERCASE with underscores, descriptive names

### Code Files
- **Format:** `camelCase.js` or `PascalCase.jsx`
- **Example:** `authController.js`, `Dashboard.jsx`
- **Convention:** camelCase for utilities, PascalCase for components

### Configuration Files
- **Format:** `filename.config.js` or `.filename`
- **Example:** `tailwind.config.js`, `.env`, `.gitignore`
- **Convention:** Lowercase with dots

---

## Git Workflow

### Commit Message Format

```
type: description

OPTIONAL BODY

OPTIONAL FOOTER
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build, dependencies, etc.

**Examples:**
```
feat: Add AI recommendation engine

docs: Update deployment documentation

refactor: Rename F-KÖD to F-KOD throughout project
```

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Development branch

**Feature Branches:**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates

---

## Documentation Standards

### README Files

Each major folder should have a README.md:

**Backend README:**
- Project overview
- Installation instructions
- API endpoints list
- Environment variables
- Running the server

**Frontend README:**
- Project overview
- Installation instructions
- Running the dev server
- Build process
- Deployment

### Documentation Files

Each documentation file should include:
- Title and overview
- Table of contents (for long files)
- Detailed sections with examples
- Conclusion
- References (if applicable)

---

## Version Control Best Practices

### Do's
- ✅ Commit frequently with meaningful messages
- ✅ Use branches for features and fixes
- ✅ Keep commits focused and atomic
- ✅ Write clear commit messages
- ✅ Document major changes in CHANGELOG.md

### Don'ts
- ❌ Don't commit sensitive data (.env files with real values)
- ❌ Don't commit node_modules or build artifacts
- ❌ Don't force push to main branch
- ❌ Don't mix multiple features in one commit
- ❌ Don't write vague commit messages

---

## Repository Maintenance

### Regular Tasks

**Weekly:**
- Review and merge pull requests
- Update documentation if needed
- Check for security vulnerabilities

**Monthly:**
- Update CHANGELOG.md
- Review and clean up old branches
- Archive completed issues

**Quarterly:**
- Major documentation review
- Architecture review
- Dependency updates

### Cleanup Checklist

- [ ] Remove old/unused branches
- [ ] Archive completed issues
- [ ] Update documentation
- [ ] Review and update dependencies
- [ ] Check for security vulnerabilities
- [ ] Update CHANGELOG.md
- [ ] Review and update README files

---

## Access & Permissions

### Repository Collaborators

| Role | Permissions | Responsibility |
|------|-------------|-----------------|
| Owner | Full access | Overall management |
| Maintainer | Write access | Code review, merging |
| Developer | Write access | Feature development |
| Contributor | Pull request | Bug fixes, improvements |
| Viewer | Read access | Documentation review |

---

## Deployment & Release

### Release Process

1. **Prepare Release:**
   - Update version in package.json
   - Update CHANGELOG.md
   - Create release branch

2. **Testing:**
   - Run all tests
   - Manual testing
   - Staging deployment

3. **Release:**
   - Merge to main
   - Create GitHub release
   - Deploy to production

4. **Post-Release:**
   - Monitor for issues
   - Update documentation
   - Communicate with team

---

## Conclusion

This repository structure provides a clear, organized, and scalable foundation for the F-KOD project. All files are organized by category, following consistent naming conventions, and documented with clear purposes. The structure supports easy navigation, collaboration, and maintenance.

**Key Principles:**
- **Organization:** Files are grouped logically by category
- **Clarity:** Naming conventions are consistent and descriptive
- **Documentation:** All major components are documented
- **Scalability:** Structure supports growth and expansion
- **Collaboration:** Clear guidelines for team members

---

**Repository:** https://github.com/lekesiz/fkod  
**Last Updated:** 5 June 2026  
**Maintained by:** Manus AI
