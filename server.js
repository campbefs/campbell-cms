const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


// Department Table
const showDepartmentTable = () => {

  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(cTable.getTable(results));
    return promptUser();
  });

};


// Role Table
const showRoleTable = () => {

  db.query(`
    
    SELECT 
      a.job_title,
      a.salary,
      b.department_name
    FROM role a 
    left join department b on a.department_id = b.department_id 
    
    `, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(cTable.getTable(results));
    return promptUser();
  });

};


// Employee Table
const showEmployeeTable = () => {

  db.query(`
    SELECT 
      a.employee_id,
      a.first_name,
      a.last_name,
      b.job_title,
      b.salary,
      c.department_name,
      CONCAT(d.first_name, ' ', d.last_name) as manager

    FROM employee a
    LEFT JOIN role b on a.role_id = b.role_id
    LEFT JOIN department c on b.department_id = c.department_id
    LEFT JOIN employee d on a.manager_id = d.employee_id
      
    `, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(cTable.getTable(results));
    return promptUser();
  });

};

const showManagerNames = () => {
  db.query(`
  SELECT 
    CONCAT(first_name, ' ', last_name) as employeeName
  FROM employee a
  LEFT JOIN role b on a.role_id = b.role_id
  where job_title like '%Manager%' OR job_title = 'Chief Executive Officer'
  order by salary desc;
  `, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    let mgrArr = [];
    for (i=0; i < results.length; i++ ) {
      mgrArr.push(results[i].employeeName);
    }
    return addEmployee(mgrArr);
  })
}


const showEmployeeNames = () => {
  db.query(`
  SELECT 
    CONCAT(first_name, ' ', last_name) as employeeName
  FROM employee a
  order by role_id;
  `, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    let eeArr = [];
    for (i=0; i < results.length; i++ ) {
      eeArr.push(results[i].employeeName);
    }
    return removeEmployee(eeArr);
  })
}

const removeEmployee = (eeArr) => {
  inquirer
    .prompt(
      {
        type: `list`,
        name: 'employeeName',
        message: `What is the employee's name?`,
        choices: eeArr
      }

    )
    .then(data => {
      // console.log(data);
      return removeEmployeeData(data);
    })
}

removeEmployeeData = (employeeData) => {
  eeNameArr = employeeData.employeeName.split(' ');
  db.query(`DELETE FROM employee WHERE first_name = ? and last_name = ?`, eeNameArr,
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      return promptUser();
    }
  )
}


addEmployeeData = (employeeData) => {

  mgrNameArr = employeeData.manager.split(' ');

  db.query(`SELECT employee_id FROM employee WHERE first_name = ? and last_name = ?`, 
    mgrNameArr, (err, result) => {
      const mgrId = result[0].employee_id;

      db.query(`SELECT role_id FROM role WHERE job_title = ?`,
      employeeData.role, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const roleId = result[0].role_id;

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)`, [employeeData.firstName, employeeData.lastName, roleId, mgrId],
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }

            return promptUser();
            
        });

      }
      )



    }
  )
}


const promptUser = () => {
  return mainMenuPrompts()
    .then ( data => {
      if (data.mainMenuSelection === 'View Departments') {
        return showDepartmentTable();
        // return promptUser();
      }
      else if (data.mainMenuSelection === 'View Roles') {
        return showRoleTable();
        // return promptUser();
      }
      else if (data.mainMenuSelection === 'View All Employees') {
        showEmployeeTable();
        return promptUser();
      } else if (data.mainMenuSelection === 'Add Employee') {
        return showManagerNames();
      } else if (data.mainMenuSelection === 'Remove Employee') {
        return showEmployeeNames();
      }

    })
}


const mainMenuPrompts = () => {
  return inquirer
    .prompt({
      type: 'list',
      name: 'mainMenuSelection',
      message: 'What would you like to do?',
      choices: ['View Departments', 'View Roles', 'View All Employees', 
        'Add Employee', 'Remove Employee', 'Update Employee Role', 
        'Update Employee Manager', 'Quit']
    })
}

const addEmployee = (managerData) => {
  inquirer
    .prompt([
      {
        type: `text`,
        name: 'firstName',
        message: `What is the employee's first name?`,
        validate: firstName => {
          if (firstName) {
            return true;
          } else {
            console.log(` Enter a first name!`);
            return false;
          }
        }
      },
      {
        type: `text`,
        name: 'lastName',
        message: `What is the employee's last name?`,
        validate: lastName => {
          if (lastName) {
            return true;
          } else {
            console.log(` Enter a last name!`);
            return false;
          }
        }
      },

      {
        type: `list`,
        name: 'role',
        message: `What is the employee's role?`,
        choices: ['Product Specialist', 'Product Lead', 'Operations Manager',
          'Software Engineer', 'Tech Lead', 'Engineering Manager',
          'Marketing Specialist', 'Product Marketing Manager', 
          'Head of Marketing', 'Chief Executive Officer'
        ]
      },
      {
        type: `list`,
        name: 'manager',
        message: `What is the employee's manager's name?`,
        choices: managerData
      }

    ])
    .then(data => {
      // console.log(data);
      return addEmployeeData(data);
    })
}


// showDepartmentTable();
// showRoleTable();
// showEmployeeTable();


promptUser();
// showManagerNames();