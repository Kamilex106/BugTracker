-- Inserting sample users
INSERT INTO users (username, email, password, enabled)
VALUES
    ('john_doe', 'john@example.com', '$2a$10$RD5qrWMpsFkYai/AZZ8KweM55FhrG7UZC1.73fuHxJJyPrikB6nqq', TRUE),     --password: pass1
    ('jane_doe', 'jane@example.com', '$2a$12$gCwES.QaFnUkPElkk4y.L.n7Fpw7x/PicMxeQn0KyF7KjsYE32KYy', TRUE),     --password: pass2
    ('alice_smith', 'alice@example.com', '$2a$12$g4ToHT2RW0eNTgl9zaliU.2XfYjvqKABNS6eCKRJP9g/EJbomd4Ky', TRUE), --password: pass3
    ('bob_johnson', 'bob@example.com', '$2a$10$nrEXoiE5.qGatDiH0tSAYuI/5SKzpie/NTZ4/nW5bXtH/V8owJavy', TRUE);   --password: fun123


INSERT INTO users (username, email, password, enabled)
VALUES
    ('mark_wilson', 'mark@example.com', '$2a$10$QvfG5Wd9yyRZt1.FJxB3.eUgvD6SRnzKPL.dKsZ/D4gGqQl1ZjNPi', TRUE),     --password: mark123
    ('sarah_brown', 'sarah@example.com', '$2a$12$hT5LyJfLqWxuV1s.RhGk7.Vr/pGn7xAWoQw9Vhr1U/dKa4jDvhIHy', TRUE),   --password: sarah456
    ('david_miller', 'david@example.com', '$2a$10$8KzP.mU3y5W.wHJz1XCRPuUUZNdZ7MO.ZZsN4.qP.i0YkNrzfKEfG', TRUE),   --password: david789
    ('emily_jones', 'emily@example.com', '$2a$12$pLRu4oD5RQmZjHMSvdBBXeIqMl0nw.KjOLk0c9MBmcm/X.iAzT9VO', TRUE),    --password: emily101
    ('michael_clark', 'michael@example.com', '$2a$10$uV5D9Ct2T4aECnWyp.RRxe5YhGvM8PF4XRmCa.zl0KCRmT7EWwN3C', TRUE), --password: mike2023
    ('jessica_white', 'jessica@example.com', '$2a$12$FvzQvU5.TmEgEgc2NVkSbeQRRDXxV9Ry0Oe7YI3.ub0TZGc5YQh.q', TRUE), --password: jess2023
    ('ryan_taylor', 'ryan@example.com', '$2a$10$lKu8jvq9HxHQ.LYfzwVK8.1JxZf.Ppb2tKNJI2UbCkVQBSPKUXnHG', TRUE),     --password: ryan567
    ('lisa_martin', 'lisa@example.com', '$2a$12$3Xb8QYzlzK.zH.oVp5jCL.0Vb1ZZsGk2yNKaR2KQyj5WHJ0Y.VBHW', TRUE);     --password: lisa890

-- Inserting sample roles
INSERT INTO roles (name)
VALUES
    ('ROLE_ADMIN'),
    ('ROLE_MONKEY');

-- Assigning roles to users
INSERT INTO users_roles (user_id, role_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 2),
    (3, 2),
    (4, 2);
	
	INSERT INTO users_roles (user_id, role_id)
VALUES
    (5, 2),  -- mark_wilson jako ROLE_MONKEY
    (6, 2),  -- sarah_brown jako ROLE_MONKEY
    (7, 1),  -- david_miller jako ROLE_ADMIN
    (8, 2),  -- emily_jones jako ROLE_MONKEY
    (9, 2),  -- michael_clark jako ROLE_MONKEY
    (10, 1), -- jessica_white jako ROLE_ADMIN
    (10, 2), -- jessica_white również jako ROLE_MONKEY
    (11, 2), -- ryan_taylor jako ROLE_MONKEY
    (12, 1); -- lisa_martin jako ROLE_ADMIN


-- Inserting sample categories

INSERT INTO category (name)
VALUES
    ('Bug category 1'),
    ('Bug category 2'),
    ('Bug category 3');

-- Inserting sample bug statuses
INSERT INTO bug_status (name)
VALUES
    ('Open'),
    ('In Progress'),
    ('Resolved'),
    ('Closed');

-- Inserting sample bug reports
INSERT INTO bug_report (title, description, priority, actual_bug_status_id, category_id, user_id)
VALUES
    ('Login Issue', 'User cannot log in with valid credentials.', 'High', 1, 1, 1),
    ('API Timeout', 'API request takes too long to respond.', 'Medium', 2, 2, 2),
    ('Page Crash', 'Homepage crashes on load.', 'Critical', 1, 1, 3);


INSERT INTO bug_report (title, description, priority, actual_bug_status_id, category_id, user_id) VALUES
('Page Crash', 'API request takes too long to respond.', 'Low', 2, 2, 2),
('Page Crash', 'Page load time exceeds acceptable limits.', 'Critical', 3, 2, 1),
('Login Issue', 'Hyperlink leads to a 404 page.', 'Critical', 1, 1, 2),
('API Timeout', 'Database connection fails intermittently.', 'Medium', 4, 1, 2),
('Memory Leak', 'Memory usage spikes under load.', 'Critical', 3, 1, 2),
('Memory Leak', 'Button does not work as expected.', 'Critical', 2, 1, 3),
('Database Error', 'Button does not work as expected.', 'Medium', 2, 2, 4),
('Login Issue', 'Database connection fails intermittently.', 'Critical', 2, 3, 3),
('Database Error', 'User cannot log in with valid credentials.', 'Low', 1, 3, 2),
('UI Bug', 'Sensitive data is exposed in logs.', 'Low', 3, 2, 1),
('Performance Issue', 'Styles are not applied correctly on mobile devices.', 'Low', 4, 3, 2),
('Page Crash', 'Database connection fails intermittently.', 'High', 1, 1, 1),
('Memory Leak', 'Sensitive data is exposed in logs.', 'Low', 2, 3, 3),
('Database Error', 'Database connection fails intermittently.', 'Critical', 3, 3, 1),
('API Timeout', 'API request takes too long to respond.', 'Low', 1, 1, 1),
('UI Bug', 'Sensitive data is exposed in logs.', 'Critical', 1, 2, 4),
('CSS Issue', 'Styles are not applied correctly on mobile devices.', 'Medium', 2, 3, 4),
('Login Issue', 'API request takes too long to respond.', 'Medium', 3, 3, 1),
('UI Bug', 'Sensitive data is exposed in logs.', 'Low', 1, 2, 4),
('Login Issue', 'User cannot log in with valid credentials.', 'High', 3, 2, 2),
('Page Crash', 'User cannot log in with valid credentials.', 'Low', 1, 1, 1),
('Database Error', 'Page load time exceeds acceptable limits.', 'High', 4, 1, 3),
('Memory Leak', 'Button does not work as expected.', 'High', 2, 3, 1),
('Memory Leak', 'Memory usage spikes under load.', 'Medium', 2, 1, 2),
('Performance Issue', 'Sensitive data is exposed in logs.', 'Medium', 2, 2, 2),
('API Timeout', 'API request takes too long to respond.', 'High', 1, 2, 1),
('Login Issue', 'Database connection fails intermittently.', 'Low', 3, 1, 2),
('Login Issue', 'API request takes too long to respond.', 'Low', 2, 3, 3),
('Performance Issue', 'Page load time exceeds acceptable limits.', 'Medium', 1, 1, 4),
('Broken Link', 'User cannot log in with valid credentials.', 'Low', 1, 1, 4),
('Page Crash', 'User cannot log in with valid credentials.', 'Critical', 3, 3, 2),
('Broken Link', 'Button does not work as expected.', 'Medium', 4, 3, 1),
('Performance Issue', 'Homepage crashes on load.', 'Low', 2, 3, 4),
('UI Bug', 'Homepage crashes on load.', 'Medium', 3, 3, 4),
('Performance Issue', 'API request takes too long to respond.', 'Critical', 3, 1, 1),
('Performance Issue', 'Memory usage spikes under load.', 'Low', 4, 1, 2),
('UI Bug', 'Page load time exceeds acceptable limits.', 'Critical', 1, 2, 2),
('Performance Issue', 'API request takes too long to respond.', 'Critical', 1, 2, 1),
('Login Issue', 'API request takes too long to respond.', 'Medium', 2, 2, 3),
('Memory Leak', 'Homepage crashes on load.', 'Critical', 4, 1, 2),
('API Timeout', 'Hyperlink leads to a 404 page.', 'Critical', 3, 3, 2),
('Database Error', 'Button does not work as expected.', 'Low', 4, 3, 3),
('Page Crash', 'Page load time exceeds acceptable limits.', 'Medium', 2, 2, 2),
('UI Bug', 'Memory usage spikes under load.', 'Critical', 4, 3, 3),
('CSS Issue', 'Styles are not applied correctly on mobile devices.', 'Medium', 1, 2, 1),
('UI Bug', 'Page load time exceeds acceptable limits.', 'Low', 3, 2, 3),
('API Timeout', 'Styles are not applied correctly on mobile devices.', 'Critical', 3, 1, 4),
('Security Flaw', 'Memory usage spikes under load.', 'Low', 3, 3, 1),
('Page Crash', 'Memory usage spikes under load.', 'Critical', 2, 3, 3),
('Login Issue', 'Hyperlink leads to a 404 page.', 'High', 4, 2, 1);


-- Inserting sample bug report logs
INSERT INTO bug_report_log (bug_report_id, bug_status_id, comment)
VALUES
    (1, 2, 'Investigating the issue.'),
    (2, 1, 'Issue confirmed.'),
    (3, 3, 'Fix implemented and tested.');
	
	INSERT INTO bug_report_log (bug_report_id, bug_status_id, comment)
VALUES
    (4, 2, 'Analiza problemu w toku, zidentyfikowano potencjalną przyczynę.'),
    (5, 3, 'Problem rozwiązany poprzez aktualizację biblioteki.'),
    (6, 1, 'Potwierdzono zgłoszenie, oczekuje na przydzielenie.'),
    (7, 4, 'Problem zamknięty - nie można odtworzyć.'),
    (8, 3, 'Naprawiono wyciek pamięci w module głównym.'),
    (9, 2, 'Pracujemy nad poprawą działania przycisku.'),
    (10, 2, 'Zidentyfikowano problem z zapytaniem SQL.'),
    (11, 2, 'Problem z uwierzytelnianiem wymaga dodatkowej analizy.'),
    (12, 1, 'Zgłoszenie zweryfikowane, priorytet niski.'),
    (13, 3, 'Poprawiono zabezpieczenia logów.'),
    (14, 4, 'Problem rozwiązany w najnowszej wersji CSS.'),
    (15, 1, 'Rozpoczęto analizę problemu z bazą danych.'),
    (16, 2, 'Zidentyfikowano przyczynę wycieku pamięci.'),
    (17, 3, 'Naprawiono połączenie z bazą danych.'),
    (18, 1, 'Potwierdzono problem z timeoutem API.'),
    (19, 1, 'Rozpoczęto analizę problemu z interfejsem.'),
    (20, 2, 'Testowanie poprawek dla stylów mobilnych.'),
    (21, 3, 'Poprawiono czas odpowiedzi API.'),
    (22, 1, 'Zgłoszenie wymaga dalszej weryfikacji.'),
    (23, 3, 'Problem z logowaniem rozwiązany.'),
    (24, 1, 'Rozpoczęto analizę problemu z ładowaniem strony.'),
    (25, 4, 'Problem zamknięty po wdrożeniu nowej wersji bazy danych.'),
    (26, 2, 'Testowanie poprawki dla przycisku.'),
    (27, 2, 'Zoptymalizowano zarządzanie pamięcią.'),
    (28, 2, 'Trwa analiza wydajności systemu.'),
    (29, 1, 'Potwierdzono problem z API.'),
    (30, 3, 'Naprawiono problem z połączeniem do bazy danych.'),
    (31, 2, 'Zidentyfikowano przyczynę problemu z API.'),
    (32, 1, 'Rozpoczęto analizę problemu z wydajnością.'),
    (33, 1, 'Zgłoszenie zweryfikowane, przydzielono zespołowi.'),
    (34, 1, 'Rozpoczęto analizę problemu z logowaniem.'),
    (35, 3, 'Problem z ładowaniem strony rozwiązany.'),
    (36, 4, 'Problem z linkiem naprawiony i zamknięty.'),
    (37, 2, 'Testowanie rozwiązania problemu z wydajnością.'),
    (38, 3, 'Naprawiono błąd w interfejsie użytkownika.'),
    (39, 3, 'Zoptymalizowano czas odpowiedzi API.'),
    (40, 4, 'Problem z pamięcią rozwiązany i zamknięty.'),
    (41, 1, 'Rozpoczęto analizę problemu z interfejsem.'),
    (42, 1, 'Potwierdzono problem z wydajnością.'),
    (43, 2, 'Testowanie poprawki dla problemu z logowaniem.'),
    (44, 4, 'Problem z pamięcią rozwiązany i zamknięty.'),
    (45, 3, 'Naprawiono problem z linkiem 404.'),
    (46, 4, 'Problem z przyciskiem naprawiony i zamknięty.'),
    (47, 2, 'Testowanie poprawki dla problemu z ładowaniem strony.'),
    (48, 4, 'Problem z interfejsem użytkownika rozwiązany i zamknięty.'),
    (49, 1, 'Rozpoczęto analizę problemu ze stylami CSS.'),
    (50, 3, 'Naprawiono problem z interfejsem użytkownika.');


-- Inserting sample bug assignments
INSERT INTO bug_assignment (bug_report_id, employee_id)
VALUES
    (1, 2),
    (2, 3),
    (3, 1);