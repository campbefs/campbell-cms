DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;


CREATE TABLE department (
  department_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL
);

CREATE TABLE role (
  role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(30) NOT NULL,
  department_id INTEGER NOT NULL,
  salary FLOAT NOT NULL,
  CONSTRAINT fk_dept FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
);

CREATE TABLE employee (
  employee_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- job_title VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  CONSTRAINT fk_ee FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
  CONSTRAINT fk_mgr FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE SET NULL
);

