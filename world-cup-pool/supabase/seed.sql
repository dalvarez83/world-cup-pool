-- WC 2026 Seed Data — all 104 matches
-- NOTE: Team assignments and dates are estimates from the Dec 2024 FIFA draw.
--       Verify against the official FIFA schedule before the tournament opens.
--
-- Groups: A-L, 4 teams each, 6 matches per group (72 total group stage)
-- Knockout: R32 (73-88), R16 (89-96), QF (97-100), SF (101-102), 3rd (103), Final (104)

-- ═══════════════════════════════════════════════════════════════
-- GROUP STAGE (matches 1-72)
-- Pattern per group [T1, T2, T3, T4]:
--   MD1: T1 vs T2, T3 vs T4
--   MD2: T1 vs T3, T2 vs T4
--   MD3: T1 vs T4, T2 vs T3  (simultaneous within group)
-- ═══════════════════════════════════════════════════════════════

-- ── Group A: USA, Uruguay, Germany, Morocco ──────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(1,'group','A',1,'USA','Uruguay','2026-06-11 18:00:00+00'),
(2,'group','A',2,'Germany','Morocco','2026-06-11 21:00:00+00'),
(3,'group','A',3,'USA','Germany','2026-06-19 21:00:00+00'),
(4,'group','A',4,'Uruguay','Morocco','2026-06-19 18:00:00+00'),
(5,'group','A',5,'USA','Morocco','2026-06-26 18:00:00+00'),
(6,'group','A',6,'Uruguay','Germany','2026-06-26 18:00:00+00');

-- ── Group B: Mexico, Ecuador, Croatia, Algeria ───────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(7,'group','B',1,'Mexico','Ecuador','2026-06-11 21:00:00+00'),
(8,'group','B',2,'Croatia','Algeria','2026-06-12 00:00:00+00'),
(9,'group','B',3,'Mexico','Croatia','2026-06-19 18:00:00+00'),
(10,'group','B',4,'Ecuador','Algeria','2026-06-19 21:00:00+00'),
(11,'group','B',5,'Mexico','Algeria','2026-06-26 21:00:00+00'),
(12,'group','B',6,'Ecuador','Croatia','2026-06-26 21:00:00+00');

-- ── Group C: Canada, Argentina, Belgium, Japan ───────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(13,'group','C',1,'Canada','Argentina','2026-06-12 18:00:00+00'),
(14,'group','C',2,'Belgium','Japan','2026-06-12 21:00:00+00'),
(15,'group','C',3,'Canada','Belgium','2026-06-20 21:00:00+00'),
(16,'group','C',4,'Argentina','Japan','2026-06-20 18:00:00+00'),
(17,'group','C',5,'Canada','Japan','2026-06-27 18:00:00+00'),
(18,'group','C',6,'Argentina','Belgium','2026-06-27 18:00:00+00');

-- ── Group D: Brazil, Serbia, South Korea, Egypt ──────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(19,'group','D',1,'Brazil','Serbia','2026-06-13 18:00:00+00'),
(20,'group','D',2,'South Korea','Egypt','2026-06-13 21:00:00+00'),
(21,'group','D',3,'Brazil','South Korea','2026-06-20 21:00:00+00'),
(22,'group','D',4,'Serbia','Egypt','2026-06-20 18:00:00+00'),
(23,'group','D',5,'Brazil','Egypt','2026-06-27 21:00:00+00'),
(24,'group','D',6,'Serbia','South Korea','2026-06-27 21:00:00+00');

-- ── Group E: Colombia, Spain, Senegal, Venezuela ─────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(25,'group','E',1,'Colombia','Spain','2026-06-13 21:00:00+00'),
(26,'group','E',2,'Senegal','Venezuela','2026-06-14 00:00:00+00'),
(27,'group','E',3,'Colombia','Senegal','2026-06-21 21:00:00+00'),
(28,'group','E',4,'Spain','Venezuela','2026-06-21 18:00:00+00'),
(29,'group','E',5,'Colombia','Venezuela','2026-06-26 21:00:00+00'),
(30,'group','E',6,'Spain','Senegal','2026-06-26 21:00:00+00');

-- ── Group F: Chile, France, Iran, Ivory Coast ────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(31,'group','F',1,'Chile','France','2026-06-14 18:00:00+00'),
(32,'group','F',2,'Iran','Ivory Coast','2026-06-14 21:00:00+00'),
(33,'group','F',3,'Chile','Iran','2026-06-21 18:00:00+00'),
(34,'group','F',4,'France','Ivory Coast','2026-06-21 21:00:00+00'),
(35,'group','F',5,'Chile','Ivory Coast','2026-06-26 18:00:00+00'),
(36,'group','F',6,'France','Iran','2026-06-26 18:00:00+00');

-- ── Group G: Netherlands, England, South Africa, Australia ───

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(37,'group','G',1,'Netherlands','England','2026-06-15 18:00:00+00'),
(38,'group','G',2,'South Africa','Australia','2026-06-15 21:00:00+00'),
(39,'group','G',3,'Netherlands','South Africa','2026-06-22 21:00:00+00'),
(40,'group','G',4,'England','Australia','2026-06-22 18:00:00+00'),
(41,'group','G',5,'Netherlands','Australia','2026-06-27 21:00:00+00'),
(42,'group','G',6,'England','South Africa','2026-06-27 21:00:00+00');

-- ── Group H: Portugal, Austria, Honduras, Tunisia ────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(43,'group','H',1,'Portugal','Austria','2026-06-15 21:00:00+00'),
(44,'group','H',2,'Honduras','Tunisia','2026-06-16 00:00:00+00'),
(45,'group','H',3,'Portugal','Honduras','2026-06-22 18:00:00+00'),
(46,'group','H',4,'Austria','Tunisia','2026-06-22 21:00:00+00'),
(47,'group','H',5,'Portugal','Tunisia','2026-06-27 18:00:00+00'),
(48,'group','H',6,'Austria','Honduras','2026-06-27 18:00:00+00');

-- ── Group I: Italy, Denmark, Panama, Nigeria ─────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(49,'group','I',1,'Italy','Denmark','2026-06-16 18:00:00+00'),
(50,'group','I',2,'Panama','Nigeria','2026-06-16 21:00:00+00'),
(51,'group','I',3,'Italy','Panama','2026-06-23 21:00:00+00'),
(52,'group','I',4,'Denmark','Nigeria','2026-06-23 18:00:00+00'),
(53,'group','I',5,'Italy','Nigeria','2026-06-28 18:00:00+00'),
(54,'group','I',6,'Denmark','Panama','2026-06-28 18:00:00+00');

-- ── Group J: Scotland, Romania, Jamaica, Jordan ──────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(55,'group','J',1,'Scotland','Romania','2026-06-16 21:00:00+00'),
(56,'group','J',2,'Jamaica','Jordan','2026-06-17 00:00:00+00'),
(57,'group','J',3,'Scotland','Jamaica','2026-06-23 18:00:00+00'),
(58,'group','J',4,'Romania','Jordan','2026-06-23 21:00:00+00'),
(59,'group','J',5,'Scotland','Jordan','2026-06-28 21:00:00+00'),
(60,'group','J',6,'Romania','Jamaica','2026-06-28 21:00:00+00');

-- ── Group K: Turkey, Poland, Saudi Arabia, DR Congo ──────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(61,'group','K',1,'Turkey','Poland','2026-06-17 18:00:00+00'),
(62,'group','K',2,'Saudi Arabia','DR Congo','2026-06-17 21:00:00+00'),
(63,'group','K',3,'Turkey','Saudi Arabia','2026-06-24 18:00:00+00'),
(64,'group','K',4,'Poland','DR Congo','2026-06-24 21:00:00+00'),
(65,'group','K',5,'Turkey','DR Congo','2026-06-28 18:00:00+00'),
(66,'group','K',6,'Poland','Saudi Arabia','2026-06-28 18:00:00+00');

-- ── Group L: Iraq, Indonesia, New Zealand, Slovenia ──────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(67,'group','L',1,'Iraq','Indonesia','2026-06-17 21:00:00+00'),
(68,'group','L',2,'New Zealand','Slovenia','2026-06-18 00:00:00+00'),
(69,'group','L',3,'Iraq','New Zealand','2026-06-24 21:00:00+00'),
(70,'group','L',4,'Indonesia','Slovenia','2026-06-24 18:00:00+00'),
(71,'group','L',5,'Iraq','Slovenia','2026-06-28 21:00:00+00'),
(72,'group','L',6,'Indonesia','New Zealand','2026-06-28 21:00:00+00');

-- ═══════════════════════════════════════════════════════════════
-- ROUND OF 32 (matches 73-88)
-- Placeholders resolved automatically when groups complete.
-- Bracket: W-X = Winner Group X, R-X = Runner-up Group X
--          T3-1..T3-8 = 8 best 3rd-place teams (ranked by pts/GD/GF)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date) values
(73,'r32',1,'Winner Group A','Runner-up Group B','W-A','R-B','2026-06-30 18:00:00+00'),
(74,'r32',2,'Runner-up Group A','Winner Group B','R-A','W-B','2026-06-30 21:00:00+00'),
(75,'r32',3,'Winner Group C','Runner-up Group D','W-C','R-D','2026-07-01 18:00:00+00'),
(76,'r32',4,'Runner-up Group C','Winner Group D','R-C','W-D','2026-07-01 21:00:00+00'),
(77,'r32',5,'Winner Group E','Runner-up Group F','W-E','R-F','2026-07-02 18:00:00+00'),
(78,'r32',6,'Runner-up Group E','Winner Group F','R-E','W-F','2026-07-02 21:00:00+00'),
(79,'r32',7,'Winner Group G','Runner-up Group H','W-G','R-H','2026-07-03 18:00:00+00'),
(80,'r32',8,'Runner-up Group G','Winner Group H','R-G','W-H','2026-07-03 21:00:00+00'),
(81,'r32',9,'Winner Group I','Runner-up Group J','W-I','R-J','2026-07-04 18:00:00+00'),
(82,'r32',10,'Runner-up Group I','Winner Group J','R-I','W-J','2026-07-04 21:00:00+00'),
(83,'r32',11,'Winner Group K','Runner-up Group L','W-K','R-L','2026-07-05 18:00:00+00'),
(84,'r32',12,'Runner-up Group K','Winner Group L','R-K','W-L','2026-07-05 21:00:00+00'),
(85,'r32',13,'Best 3rd #1','Best 3rd #2','T3-1','T3-2','2026-07-05 18:00:00+00'),
(86,'r32',14,'Best 3rd #3','Best 3rd #4','T3-3','T3-4','2026-07-05 21:00:00+00'),
(87,'r32',15,'Best 3rd #5','Best 3rd #6','T3-5','T3-6','2026-07-06 18:00:00+00'),
(88,'r32',16,'Best 3rd #7','Best 3rd #8','T3-7','T3-8','2026-07-06 21:00:00+00');

-- ═══════════════════════════════════════════════════════════════
-- ROUND OF 16 (matches 89-96)
-- Each match's source points to the two R32 matches whose winners advance.
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(89,'r16',1,'Winner R32-M1','Winner R32-M2','W-73','W-74','2026-07-08 18:00:00+00',73,74),
(90,'r16',2,'Winner R32-M3','Winner R32-M4','W-75','W-76','2026-07-08 21:00:00+00',75,76),
(91,'r16',3,'Winner R32-M5','Winner R32-M6','W-77','W-78','2026-07-09 18:00:00+00',77,78),
(92,'r16',4,'Winner R32-M7','Winner R32-M8','W-79','W-80','2026-07-09 21:00:00+00',79,80),
(93,'r16',5,'Winner R32-M9','Winner R32-M10','W-81','W-82','2026-07-10 18:00:00+00',81,82),
(94,'r16',6,'Winner R32-M11','Winner R32-M12','W-83','W-84','2026-07-10 21:00:00+00',83,84),
(95,'r16',7,'Winner R32-M13','Winner R32-M14','W-85','W-86','2026-07-11 18:00:00+00',85,86),
(96,'r16',8,'Winner R32-M15','Winner R32-M16','W-87','W-88','2026-07-11 21:00:00+00',87,88);

-- ═══════════════════════════════════════════════════════════════
-- QUARTERFINALS (matches 97-100)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(97,'qf',1,'Winner R16-M1','Winner R16-M2','W-89','W-90','2026-07-14 18:00:00+00',89,90),
(98,'qf',2,'Winner R16-M3','Winner R16-M4','W-91','W-92','2026-07-14 21:00:00+00',91,92),
(99,'qf',3,'Winner R16-M5','Winner R16-M6','W-93','W-94','2026-07-15 18:00:00+00',93,94),
(100,'qf',4,'Winner R16-M7','Winner R16-M8','W-95','W-96','2026-07-15 21:00:00+00',95,96);

-- ═══════════════════════════════════════════════════════════════
-- SEMIFINALS (matches 101-102)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(101,'sf',1,'Winner QF-M1','Winner QF-M2','W-97','W-98','2026-07-18 21:00:00+00',97,98),
(102,'sf',2,'Winner QF-M3','Winner QF-M4','W-99','W-100','2026-07-19 21:00:00+00',99,100);

-- ═══════════════════════════════════════════════════════════════
-- THIRD PLACE MATCH (103)
-- Both slots are filled by the LOSERS of SF-101 and SF-102.
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id,source_home_is_loser,source_away_is_loser) values
(103,'third_place',1,'SF-1 Loser','SF-2 Loser','L-101','L-102','2026-07-22 18:00:00+00',101,102,true,true);

-- ═══════════════════════════════════════════════════════════════
-- FINAL (104)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(104,'final',1,'SF-1 Winner','SF-2 Winner','W-101','W-102','2026-07-23 18:00:00+00',101,102);
