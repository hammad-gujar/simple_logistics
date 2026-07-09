-- ============================================================================
-- Simple Logistics Limited — seed content
-- Run after 0001_init.sql:  supabase db push && psql < supabase/seed.sql
-- (or paste into the Supabase SQL editor)
-- ============================================================================

-- ----------------------------------------------------------- site settings
insert into public.site_settings
  (id, site_name, tagline, meta_title, meta_description, phone, email,
   address_line1, address_line2, city, postcode, country, opening_hours,
   contact_email, workforce_email, applications_email)
values
  (1,
   'Simple Logistics Limited',
   'Workforce solutions for UK logistics and healthcare',
   'Simple Logistics Limited — Logistics Workforce & Healthcare Staffing, UK',
   'Simple Logistics Limited supplies vetted drivers, warehouse operatives and healthcare professionals to organisations across the United Kingdom.',
   '+44 (0)121 000 0000',
   'info@simplelogistics.co.uk',
   'Century House', '12 Trafford Way', 'Birmingham', 'B1 1AA', 'United Kingdom',
   '[{"days":"Monday – Friday","hours":"07:00 – 19:00"},
     {"days":"Saturday","hours":"08:00 – 14:00"},
     {"days":"Sunday & Bank Holidays","hours":"On-call service"}]'::jsonb,
   'info@simplelogistics.co.uk',
   'workforce@simplelogistics.co.uk',
   'careers@simplelogistics.co.uk')
on conflict (id) do nothing;

-- -------------------------------------------------------------- services --
insert into public.services
  (division, slug, title, excerpt, body_html, benefits, faqs, icon, is_published, sort_order)
values
-- Logistics
('logistics', 'hgv-driver-supply',
 'HGV & LGV Driver Supply',
 'Fully licensed Class 1 and Class 2 drivers, compliance-checked and ready for same-week deployment across the UK.',
 '<h2>Keep every route covered</h2><p>Driver shortages should never stop your fleet. We maintain an active bench of CPC-qualified Class 1 (C+E) and Class 2 (C) drivers across the Midlands, North West and South East, each one licence-verified, DVLA-checked and inducted to your site standards before their first shift.</p><h2>Compliance built in</h2><p>Every placement includes digital tachograph verification, right-to-work checks and ongoing licence monitoring, so your transport office stays audit-ready without extra admin.</p>',
 '[{"title":"Same-week deployment","description":"Pre-vetted driver pool means cover in days, not weeks — including weekend and night trunking."},
   {"title":"Zero-compliance-gap guarantee","description":"DVLA, CPC, tacho and right-to-work checks completed and documented before any driver reaches your yard."},
   {"title":"Retention-first model","description":"Drivers are paid fairly and offered consistent work, so the face you induct is the face that stays on the contract."}]'::jsonb,
 '[{"question":"How quickly can you supply a driver?","answer":"For standard requests we deploy within 3–5 working days. Priority cover is often possible within 24 hours, subject to location and licence class."},
   {"question":"Do you handle agency driver compliance?","answer":"Yes. We complete licence verification, CPC and tachograph checks, right-to-work documentation and site induction records for every driver we place."},
   {"question":"Can drivers transfer to our payroll?","answer":"Yes — our temp-to-perm route lets you take any driver onto your own books after a qualifying period, with transparent transfer terms agreed up front."}]'::jsonb,
 'truck', true, 1),

('logistics', 'warehouse-staffing',
 'Warehouse & Distribution Staffing',
 'Pickers, packers, forklift operators and shift supervisors — scaled to your volumes, from a single shift to a full peak season.',
 '<h2>Flex your workforce with your volumes</h2><p>From steady-state fulfilment to Black Friday peaks, we build warehouse teams that flex with demand. Our operatives arrive site-inducted, PPE-equipped and briefed on your KPIs — pick rates, accuracy and safety standards are agreed before day one.</p><h2>Supervision included</h2><p>For teams of ten or more we embed a working team leader at no extra margin, giving you a single accountable point of contact on every shift.</p>',
 '[{"title":"Volume-based scaling","description":"Ramp from 5 to 500 operatives for peak trading, with agreed notice periods and guaranteed fulfilment rates."},
   {"title":"Accredited MHE operators","description":"Counterbalance, reach and PPT licences verified through RTITB/ITSSAR before deployment."},
   {"title":"Embedded team leadership","description":"Working supervisors on larger deployments keep quality, attendance and reporting on one accountable desk."}]'::jsonb,
 '[{"question":"What roles do you cover?","answer":"Pickers, packers, loaders, stock controllers, forklift operators (counterbalance, reach, PPT), goods-in teams and shift supervisors."},
   {"question":"How do you manage attendance?","answer":"Daily attendance is confirmed before 06:00 with a named replacement dispatched for any no-show — our fill rate across 2025 was 98.4%."}]'::jsonb,
 'warehouse', true, 2),

('logistics', 'last-mile-couriers',
 'Last-Mile & Courier Crews',
 'Multi-drop van drivers and courier teams for parcel networks, retailers and same-day operations.',
 '<h2>The final mile, handled</h2><p>We supply experienced multi-drop drivers who know that the last mile is where your brand is judged. Route-density experience, customer-facing standards and delivery-app fluency come as standard.</p><h2>Own-fleet or driver-only</h2><p>Deploy our drivers into your vans, or ask about crewed 3.5t solutions for overflow and seasonal surges.</p>',
 '[{"title":"Multi-drop specialists","description":"Drivers averaging 80–120 drops per day with hand-held scanner and PDA experience across major networks."},
   {"title":"7-day coverage","description":"Weekend and evening crews for retail peaks, with rotas managed by our on-call desk."},
   {"title":"Brand-safe standards","description":"Uniform, conduct and doorstep-service standards agreed and audited through spot checks."}]'::jsonb,
 '[{"question":"Do drivers use their own vehicles?","answer":"Placements are into your fleet by default. Crewed vehicle solutions are available for overflow work — ask our team for coverage in your area."}]'::jsonb,
 'route', true, 3),

('logistics', 'managed-workforce',
 'Managed Workforce Programmes',
 'A fully outsourced onsite team — recruitment, rostering, compliance and performance management under one SLA.',
 '<h2>Your labour line, our accountability</h2><p>For high-volume sites, ad-hoc agency supply eventually hits a ceiling. Our managed programmes put a dedicated account team onsite to own recruitment, induction, rostering, attendance and performance against a single service-level agreement.</p><h2>Data you can run a site on</h2><p>Weekly MI covers fulfilment, attrition, agency-to-perm conversion and cost-per-unit labour metrics, reviewed with your operations leadership every month.</p>',
 '[{"title":"Single SLA accountability","description":"One contract covering fulfilment rates, quality thresholds and cost controls — no multi-agency finger-pointing."},
   {"title":"Onsite account management","description":"A dedicated coordinator embedded at your site managing rosters, inductions and daily attendance."},
   {"title":"Workforce analytics","description":"Weekly MI on fill rate, attrition and productivity, benchmarked across comparable UK sites."}]'::jsonb,
 '[{"question":"What size of site suits a managed programme?","answer":"Typically sites using 40+ flexible workers per week — below that, our standard supply model is usually more cost-effective."}]'::jsonb,
 'briefcase', true, 4),

-- Healthcare
('healthcare', 'care-assistants',
 'Care Assistants & Support Workers',
 'Compassionate, DBS-checked care assistants for residential homes, supported living and domiciliary settings.',
 '<h2>Care you can put your name to</h2><p>Every care assistant we place is enhanced-DBS checked, reference-verified across a full employment history, and trained to the Care Certificate standard as a minimum. We match by setting — residential, dementia, supported living or domiciliary — not just by availability.</p><h2>Continuity matters</h2><p>We prioritise block bookings and repeat placements so residents see familiar faces, and your team spends less time inducting strangers.</p>',
 '[{"title":"Enhanced DBS & full referencing","description":"Every carer arrives with an enhanced DBS on the update service and references covering their complete care history."},
   {"title":"Care Certificate minimum","description":"Moving & handling, safeguarding, medication awareness and infection control are all current and evidenced."},
   {"title":"Continuity-first rostering","description":"Block bookings and named-carer arrangements keep familiar faces in front of residents."}]'::jsonb,
 '[{"question":"Can you cover short-notice shifts?","answer":"Yes — our on-call desk runs until 22:00 and from 06:00, and most same-day requests are filled within two hours."},
   {"question":"Are your carers trained for dementia settings?","answer":"A dedicated cohort of our carers holds enhanced dementia-care training. Tell us your setting and we will match accordingly."}]'::jsonb,
 'heart-handshake', true, 1),

('healthcare', 'nursing-staff',
 'Registered Nurses (RGN / RMN)',
 'NMC-registered general and mental health nurses for care homes, clinics and complex-care packages.',
 '<h2>Registered, revalidated, ready</h2><p>Our nursing register covers RGNs and RMNs with current NMC registration, in-date revalidation and specialisms spanning elderly care, dementia, palliative support and complex care packages. Clinical references are verified by a nurse-led compliance team, not a checkbox process.</p><h2>Safe staffing, evidenced</h2><p>We provide full compliance packs to CQC standard for every placement, so your evidence trail is inspection-ready from shift one.</p>',
 '[{"title":"NMC-verified registration","description":"PIN checks on every placement plus ongoing monitoring for restrictions and lapses."},
   {"title":"Nurse-led vetting","description":"Clinical interviews and competency reviews carried out by registered nurses on our own team."},
   {"title":"CQC-ready compliance packs","description":"Training matrices, DBS, immunisations and references packaged for your inspection file."}]'::jsonb,
 '[{"question":"Do you supply nurses for complex care packages?","answer":"Yes — including tracheostomy, PEG and ventilator-experienced nurses for community and residential packages."}]'::jsonb,
 'stethoscope', true, 2),

('healthcare', 'temporary-cover',
 'Emergency & Temporary Cover',
 'Same-day and short-notice staffing for sickness, vacancies and inspections — 7 days a week.',
 '<h2>When the rota breaks at 6am</h2><p>Sickness, no-shows and sudden vacancies do not respect office hours. Our healthcare on-call desk operates seven days a week, with an active pool of carers and nurses who have opted into short-notice work and live within travelling distance of your service.</p><h2>No panic premium</h2><p>Emergency cover is charged at the same transparent rates as planned bookings — we do not monetise your bad mornings.</p>',
 '[{"title":"Same-day response","description":"Most urgent requests filled within two hours during on-call desk hours."},
   {"title":"Local, travel-ready pool","description":"Staff matched by postcode radius so short-notice does not mean late arrival."},
   {"title":"Flat, transparent rates","description":"Emergency bookings cost the same as planned ones. Always."}]'::jsonb,
 '[{"question":"What are your on-call desk hours?","answer":"06:00–22:00, seven days a week, including bank holidays. Out-of-hours voicemail is triaged from 05:30."}]'::jsonb,
 'clock', true, 3),

('healthcare', 'permanent-recruitment',
 'Permanent Healthcare Recruitment',
 'Retained and contingent search for care managers, deputies, nurses and senior care staff.',
 '<h2>Hires that stay</h2><p>Permanent recruitment in care is a trust exercise. We combine a national candidate network with structured, values-based interviewing to shortlist people who fit your culture — not just your job description. Every shortlist includes verified qualifications, safeguarding history and referee conversations conducted by phone.</p><h2>Backed by a rebate you will not need</h2><p>Our 12-week sliding rebate applies to every permanent placement, but with a 94% twelve-month retention rate, it rarely gets used.</p>',
 '[{"title":"Values-based shortlisting","description":"Structured interviews scored against the values framework your service actually runs on."},
   {"title":"Verified before you meet them","description":"Qualifications, registration and safeguarding history checked before the shortlist reaches you."},
   {"title":"12-week sliding rebate","description":"Straightforward protection on every permanent placement, with no small print."}]'::jsonb,
 '[{"question":"Do you recruit registered managers?","answer":"Yes — registered managers, deputies, clinical leads and nurse-qualified unit managers are a core specialism, on either a retained or contingent basis."}]'::jsonb,
 'user-check', true, 4);

-- ------------------------------------------------------------------ jobs --
insert into public.jobs
  (slug, reference, title, division, location, job_type, industry, salary_text,
   summary, body_html, is_published, closes_at)
values
('class-1-driver-birmingham', 'SLL-1041',
 'Class 1 HGV Driver (C+E)', 'logistics', 'Birmingham', 'Full-time', 'Transport & Distribution',
 '£38,000 – £44,000 per annum',
 'Trunking and store-delivery work from a modern Birmingham depot, with guaranteed 45-hour weeks and no weekend requirement.',
 '<h2>The role</h2><p>Day and afternoon trunking runs from a single Birmingham hub to regional distribution centres. Modern fleet on 3-year replacement cycles, full workshop backup, and planned routes that respect your driving hours.</p><h2>What you''ll need</h2><ul><li>Valid C+E licence with no more than 6 points</li><li>Current CPC and digital tachograph card</li><li>12 months Class 1 experience preferred</li></ul><h2>What you''ll get</h2><ul><li>Guaranteed 45-hour week, overtime after that at 1.5x</li><li>28 days holiday including bank holidays</li><li>Weekly pay, pension, and uniform provided</li></ul>',
 true, '2026-09-30'),

('warehouse-operative-coventry', 'SLL-1042',
 'Warehouse Operative (Nights)', 'logistics', 'Coventry', 'Temporary', 'Warehousing',
 '£13.20 per hour + night premium',
 'Night-shift picking and packing in a fast-moving retail fulfilment centre. Temp-to-perm after 12 weeks for reliable performers.',
 '<h2>The role</h2><p>Scanner-based picking, packing and palletising on a 22:00–06:00 shift, Sunday to Thursday. Full training given on your first night — no experience needed, just reliability.</p><h2>What you''ll get</h2><ul><li>£13.20/hr base plus night premium</li><li>Weekly pay every Friday</li><li>Temp-to-perm route after 12 weeks</li><li>Subsidised canteen and free parking</li></ul>',
 true, null),

('forklift-driver-leicester', 'SLL-1043',
 'Reach Truck Driver', 'logistics', 'Leicester', 'Contract', 'Warehousing',
 '£14.50 per hour',
 'Experienced reach truck driver for a 6-month contract in a bulk-storage distribution centre, with strong likelihood of extension.',
 '<h2>The role</h2><p>Putaway and replenishment in a high-bay bulk storage facility. Rotating earlies and lates (06:00–14:00 / 14:00–22:00), Monday to Friday.</p><h2>What you''ll need</h2><ul><li>In-date RTITB or ITSSAR reach truck licence</li><li>6+ months recent reach experience</li><li>Comfortable working at height picking up to 12 metres</li></ul>',
 true, '2026-08-31'),

('care-assistant-solihull', 'SLL-2018',
 'Care Assistant — Residential (Days)', 'healthcare', 'Solihull', 'Full-time', 'Health & Social Care',
 '£12.60 per hour + paid breaks',
 'Day shifts in a highly rated 42-bed residential home, supporting residents with personal care, meals and meaningful daily activity.',
 '<h2>The role</h2><p>Join a settled day team in a residential home rated Good in all five CQC domains. Shifts are 08:00–20:00 on a 3-on/3-off rota, with paid breaks and a genuine focus on resident wellbeing over task lists.</p><h2>What you''ll need</h2><ul><li>6 months UK care experience preferred (Care Certificate ideal)</li><li>Enhanced DBS on the update service, or willingness to apply</li><li>Warmth, patience and reliability</li></ul>',
 true, null),

('rgn-nights-warwick', 'SLL-2019',
 'Registered Nurse (RGN) — Nights', 'healthcare', 'Warwick', 'Part-time', 'Health & Social Care',
 '£24.50 per hour',
 'Two to three night shifts per week in a nurse-led dementia unit, leading a team of four care staff.',
 '<h2>The role</h2><p>Clinical lead on nights for a 28-bed dementia nursing unit: medication rounds, care-plan reviews and support for a team of four experienced care assistants. Choose 2 or 3 fixed nights per week.</p><h2>What you''ll need</h2><ul><li>Active NMC registration (RGN)</li><li>Confidence leading a small night team</li><li>Dementia experience desirable, not essential</li></ul>',
 true, '2026-08-15'),

('support-worker-outreach-birmingham', 'SLL-2020',
 'Community Support Worker', 'healthcare', 'Birmingham', 'Part-time', 'Supported Living',
 '£12.90 per hour + mileage',
 'Flexible outreach visits supporting adults with learning disabilities to live independently across south Birmingham.',
 '<h2>The role</h2><p>Community outreach supporting adults with learning disabilities: daily living skills, appointments, social activities and confidence-building. Choose blocks between 07:00 and 21:00 to fit your week — minimum 16 hours.</p><h2>What you''ll need</h2><ul><li>Full UK driving licence and access to a car (45p/mile paid)</li><li>Experience in supported living or a genuine commitment to learn</li><li>Enhanced DBS or willingness to apply</li></ul>',
 true, null);

-- ----------------------------------------------------------------- posts --
insert into public.posts
  (slug, title, excerpt, body_html, category, tags, is_published, published_at)
values
('driver-shortage-2026-planning',
 'Planning around the 2026 driver shortage: a transport manager''s checklist',
 'The HGV driver gap has narrowed since 2021 — but seasonal peaks still break rosters. Here''s a practical planning framework for the year ahead.',
 '<p>The headline driver shortage may have eased, but ask any transport manager about October to December and you''ll hear the same story: the market still tightens brutally at peak. The difference between a covered rota and a crisis is planning that starts in summer.</p><h2>1. Audit your real coverage, not your headcount</h2><p>Count licences and availability, not names on a list. A bench of twenty drivers with six on restricted hours is a bench of fourteen.</p><h2>2. Lock peak commitments early</h2><p>Agency partners allocate their best drivers to clients who commit first. A September volume forecast — even a rough one — moves you to the front of the queue.</p><h2>3. Treat agency drivers as your own</h2><p>Sites that induct properly, brief clearly and pay fairly see the same agency faces return week after week. Familiarity is a productivity metric.</p><h2>4. Build a temp-to-perm pipeline</h2><p>Your next permanent hire is probably already driving for you. Agree transfer terms up front so converting is a decision, not a negotiation.</p>',
 'Logistics', '{"drivers","workforce planning","peak season"}', true, '2026-06-12T09:00:00Z'),

('cqc-inspection-agency-staff',
 'CQC inspections and agency staff: getting your evidence trail right',
 'Agency staff are part of your safe-staffing story. Here''s what inspectors actually look for — and the paperwork that satisfies them.',
 '<p>There''s a persistent myth that heavy agency use automatically harms a CQC rating. In reality, inspectors are pragmatic: what they scrutinise is whether agency staff are deployed <em>safely</em> — inducted, competent and covered by the same governance as your own team.</p><h2>The four questions inspectors ask</h2><ul><li>Can you evidence pre-placement checks (DBS, training, registration) for every agency worker?</li><li>Are agency staff inducted to this specific service, and is that recorded?</li><li>Do they receive handover and have access to care plans?</li><li>Is continuity managed — do you see the same faces, or a revolving door?</li></ul><h2>What good looks like</h2><p>A single agency-staff file per provider, refreshed quarterly, containing compliance certificates, induction records and a continuity log. Ask your agency for a CQC-ready pack — if they can''t produce one within a day, that tells you something.</p>',
 'Healthcare', '{"cqc","compliance","care homes"}', true, '2026-05-28T09:00:00Z'),

('warehouse-peak-2026',
 'Peak 2026: why the best warehouses are booking labour in July',
 'Golden Quarter labour is won months before it''s needed. The operators who book early get the pick of the pool — literally.',
 '<p>Every year the pattern repeats: the first enquiries for November warehouse labour arrive in June and July from the most sophisticated operators, and in late September from everyone else. By then, the experienced pickers, MHE licence-holders and working supervisors are committed.</p><h2>The early-booking advantage is compounding</h2><p>Early commitments don''t just secure heads — they secure <em>returning</em> heads. Workers who had a good peak with you last year will pencil you in again, but only if the offer lands before they''ve accepted elsewhere.</p><h2>What to fix before volume hits</h2><ul><li>Induction: compress it to half a day without cutting safety content</li><li>Rate cards: agree overtime and premium triggers now, not mid-peak</li><li>Supervision: one working team leader per 10–12 temps is the ratio that protects pick accuracy</li></ul>',
 'Logistics', '{"warehousing","peak season","workforce planning"}', true, '2026-07-01T09:00:00Z'),

('values-based-recruitment-care',
 'Values-based recruitment in care: hiring for the 3am shift',
 'Skills can be trained. The instinct to sit with a distressed resident at 3am cannot. How values-based interviewing changes retention.',
 '<p>Turnover in adult social care remains stubbornly high — but not evenly. Services that recruit against explicit values consistently retain staff at nearly double the sector average. The difference isn''t luck; it''s method.</p><h2>What values-based interviewing actually means</h2><p>Instead of "tell me about your experience", candidates respond to situational prompts scored against defined behaviours: dignity, patience, initiative, honesty under pressure. The scoring rubric matters more than the questions.</p><h2>Three prompts that reveal more than a CV</h2><ul><li>"A resident refuses personal care for the third day. Walk me through your next hour."</li><li>"You notice a colleague speaking sharply to a resident. What do you do that shift — and the next day?"</li><li>"Tell me about a time you got something wrong at work. Who did you tell?"</li></ul><p>The answers separate people who see care as a shift from people who see it as a responsibility. Hire the second group.</p>',
 'Healthcare', '{"recruitment","care homes","retention"}', true, '2026-04-15T09:00:00Z');

-- ---------------------------------------------------------- testimonials --
insert into public.testimonials (quote, author_name, author_role, division, sort_order) values
('Simple Logistics filled a 40-picker night shift with five days'' notice going into Black Friday — and the same faces came back every night through January. Our fill rate never dropped below 97%.',
 'David Okafor', 'Site Operations Manager, National 3PL', 'logistics', 1),
('Their compliance packs are the best I''ve seen from any agency. When CQC inspected in March, every agency file was complete — the inspector commented on it.',
 'Sarah Whitfield', 'Registered Manager, 48-bed Nursing Home', 'healthcare', 2),
('We''ve taken eleven of their drivers onto our own books in two years. That tells you everything about the calibre of people they send.',
 'James McAllister', 'Transport Manager, Regional Haulier', 'logistics', 3),
('The on-call desk answers at 6am with a plan, not an apology. In this sector, that''s worth its weight in gold.',
 'Priya Sharma', 'Deputy Manager, Supported Living Provider', 'healthcare', 4);
