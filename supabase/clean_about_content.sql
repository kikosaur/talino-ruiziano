-- Script to clean out old about content data and optionally seed the new categories

-- Delete the old unused stats and core value sections that no longer appear on the About page
DELETE FROM public_content WHERE type IN ('about_stat', 'about_value', 'about_intro', 'about_creator', 'about_contact');

-- Prepopulate the new sections!
INSERT INTO public_content (type, title, description, metadata) VALUES 
('about_intro', 'Talino-Ruiziano', 'Make completing your ILTs fun and stress-free! Earn points, listen to music, and customize your avatar while submitting your tasks on time. Teachers can easily track and check your work, so everyone wins. Stay motivated, enjoy learning, and celebrate your achievements!', '{}'::jsonb);

INSERT INTO public_content (type, title, description, metadata) VALUES 
('about_creator', 'Kim Ramos Ciriaca', 'Researcher', '{"icon": "/creators/Ciriaca Kim, Ramos.jpg"}'::jsonb),
('about_creator', 'RJel Santiago Atraje', 'Researcher', '{"icon": "/creators/Atraje, RJel Santiago.jpg"}'::jsonb),
('about_creator', 'Kim P. Del Rosario', 'Researcher', '{"icon": "/creators/Del Rosario, Kim P.jpg"}'::jsonb),
('about_creator', 'Eddrian Santos Gaboy', 'Researcher', '{"icon": "/creators/Gaboy, Eddrian Santos.jpg"}'::jsonb),
('about_creator', 'Keizel B. Quinones', 'Researcher', '{"icon": "/creators/Quinones, Keizel B.jpg"}'::jsonb),
('about_creator', 'Robby Rian A. Yacat', 'Researcher', '{"icon": "/creators/Yacat, Robby Rian A.jpg"}'::jsonb),
('about_creator', 'Crissa Jane Catacutan', 'Researcher', '{"icon": "/creators/Crissa Jane Catacutan.jfif"}'::jsonb);

INSERT INTO public_content (type, title, description, metadata) VALUES 
('about_contact', 'Address', 'San Bartolome (POB.), 3102 San Leonardo, Nueva Ecija, Philippines', '{"icon": "MapPin"}'::jsonb),
('about_contact', 'Phone', 'N/A', '{"icon": "Phone"}'::jsonb),
('about_contact', 'Email', 'slrdaacademics@gmail.com', '{"icon": "Mail"}'::jsonb);
