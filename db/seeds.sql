INSERT INTO department (department_name) VALUES
('Operations'),
('Engineering'),
('Marketing');

INSERT INTO role (job_title, department_id, salary) VALUES
('Product Specialist', 1, 50000),
('Product Operations Lead', 1, 70000),
('Operations Manager', 1, 100000),
('Software Engineer', 2, 300000),
('Tech Lead', 2, 600000),
('Engineering Manager', 2, 900000),
('Marketing Specialist', 3, 60000),
('Product Marketing Lead', 3, 90000),
('Marketing Manager', 3, 250000),
('Chief Executive Officer', 1, 50000000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Chris', 'Campbell', 10, NULL),
('Tom', 'Ivy', 6, 1),
('Chris', 'Barron', 5, 2),
('Cory', 'Welsh', 4, 2),
('Mike', 'Brewster', 4, 2),

('Lauren', 'Campbell', 9, 1),
('Benjamin', 'Campbell', 8, 6),
('Hunter', 'Campbell', 7, 6),
('Owen', 'Campbell', 7, 6),

('John', 'Purcell', 3, 1),
('Jordan', 'Oster', 2, 10),
('Matt', 'Brown', 1, 10),
('Matt', 'Hardie', 1, 10);