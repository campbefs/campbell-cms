const db = require('../db/connection');
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

const showManagerNames = (action) => {
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

    if (action[0] === 'add_employee') {
      return addEmployee(mgrArr);
    } else if (action[0] === 'update_manager') {
      return updateEmployeeManager([action[1], mgrArr]);
    } else if (action[0] === 'view_employee') {
      return viewEmployeeByManager(mgrArr);
    }

  })
}

const showDepartmentNames = (action) => {
  db.query(`SELECT department_name FROM department`, (err, results) => {
    let deptArr = [];
    for (i=0; i < results.length; i++ ) {
      deptArr.push(results[i].department_name);
    }
    
    if (action === 'view_employee') {
      return showEmployeeByDept(deptArr);
    } else if (action === 'view_budget') {
      console.log(action);
      return showBudgetByDept(deptArr);
    }

  })

  // showDepartmentNames('view_employee')
}

const showBudgetByDept = (deptArr) => {
  inquirer
    .prompt({
      type: 'list',
      name: 'deptName',
      message: 'Please select a department to view associated employees',
      choices: deptArr
    })
    .then(data => {
      let department = data.deptName;
      db.query(`
        WITH dept_id as (
          SELECT
            department_id
          FROM department 
          WHERE department_name = ?
        ),
        role_id as (
          SELECT
            role_id
          FROM role
          WHERE department_id = (SELECT * FROM dept_id)
        )
        SELECT
          CONCAT('$ ', FORMAT(sum(b.salary),2)) as total_budget
        FROM employee a
        LEFT JOIN role b on a.role_id = b.role_id
        WHERE a.role_id IN (select * from role_id)
        `, department, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(cTable.getTable(results));
          promptUser();
        }
      );
    });
};

// const showBudgetByDept = (deptArr) => {
//   inquirer
//   .prompt({
//     type: 'list',
//     name: 'deptName',
//     message: 'Please select a department to view associated employees',
//     choices: deptArr
//   })
//   .then( dept => {
//     let department = dept.deptName;
//     console.log(department);
//     // db.query(`
//     // WITH dept_id as (
//     //   SELECT
//     //     department_id
//     //   FROM department 
//     //   WHERE department_name = ?
//     // ),
//     // role_id as (
//     //   SELECT
//     //     role_id
//     //   FROM role
//     //   WHERE department_id = (SELECT * FROM dept_id)
//     // )
//     // SELECT
//     //   sum(a.salary) as total_budget
//     // FROM employee a
//     // LEFT JOIN role b on a.role_id = b.role_id
//     // WHERE a.role_id IN (select * from role_id)
//     // `, department, (err, results) => {
//     //   if (err) {
//     //     console.log(err);
//     //     return;
//     //   }
//     //   console.log(cTable.getTable(results));
//     //   promptUser;
//     // });
//   });



const showEmployeeByDept = (deptArr) => {
  inquirer
  .prompt({
    type: 'list',
    name: 'deptName',
    message: 'Please select a department to view associated employees',
    choices: deptArr
  })
  .then( dept => {
    let department = dept.deptName;
    db.query(`
    WITH dept_id as (
      SELECT
        department_id
      FROM department 
      WHERE department_name = ?
    ),
    role_id as (
      SELECT
        role_id
      FROM role
      WHERE department_id = (SELECT * FROM dept_id)
    )
    SELECT
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
    WHERE a.role_id IN (select * from role_id)
    `, department, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(cTable.getTable(results));
      promptUser();
    })
  })
}

const showEmployeeNames = async (action) => {
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

    if (action === 'remove') {
      return removeEmployee(eeArr);
    } else if (action === 'update_role') {
      return updateEmployeeRole(eeArr);
    } else if (action === 'update_manager') {

      return showManagerNames(['update_manager', eeArr])
    
      // return updateEmployeeManager(eeMgrArr);
    }
  })
}

const viewEmployeeByManager = (mgrArr) => {
  inquirer
    .prompt(
      {
        type: `list`,
        name: 'mgrName',
        message: 'Please select a manager to view direct reports.',
        choices: mgrArr
      }
    )
    .then( data => {
      let mgrArr = data['mgrName'].split(' ');

      db.query(`
      WITH mgr_id as (
        SELECT
          employee_id
        FROM employee 
        WHERE first_name = ? and last_name = ?
      )
      SELECT
        a.first_name,
        a.last_name,
        b.job_title,
        b.salary,
        c.department_name
      FROM employee a
      LEFT JOIN role b on a.role_id = b.role_id
      LEFT JOIN department c on b.department_id = c.department_id
      WHERE manager_id = (select * from mgr_id)
      `, mgrArr, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(cTable.getTable(results));
        promptUser();
      })
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

const updateEmployeeManager = (eeMgrArr) => {
  inquirer
    .prompt([
      {
        type: `list`,
        name: 'employeeName',
        message: `What is the name of the employee you would like to update?`,
        choices: eeMgrArr[0]
      },
      {
        type: `list`,
        name: 'mgrName',
        message: `What is manager's name of the employee you'd like to update?`,
        choices: eeMgrArr[1]
      },

    ]).then(data => {

      let mgrNameArr = data.mgrName.split(' ');
      db.query(`SELECT employee_id FROM employee WHERE first_name = ? and last_name = ?`,
        mgrNameArr, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          // console.log(result[0].employee_id);
          let eeNameArr = data.employeeName.split(' ');
          eeNameArr.unshift(result[0].employee_id);

          db.query(`UPDATE employee
                  SET manager_id = ?
                  where first_name = ? and last_name = ?`, eeNameArr, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    return promptUser();
                  }
          )

        }
      )
    })
}

const updateEmployeeRole = (eeArr) => {
  inquirer
    .prompt([
      {
        type: `list`,
        name: 'employeeName',
        message: `What is the name of the employee you would like to update?`,
        choices: eeArr
      },
      {
        type: `list`,
        name: 'role',
        message: `What is the employee's new role?`,
        choices: ['Product Specialist', 'Product Operations Lead', 'Operations Manager',
        'Software Engineer', 'Tech Lead', 'Engineering Manager',
        'Marketing Specialist', 'Product Marketing Lead', 
        'Marketing Manager', 'Chief Executive Officer'
        ]
      }
    ])
    .then(data => {
      
      role = data.role;
      eeNewRole = data.employeeName.split(' ');
      // console.log('role', role);

      db.query(`SELECT role_id FROM role WHERE job_title = ?`, role, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        // console.log(result);
        // console.log(result[0].role_id);
        eeNewRole.unshift(result[0].role_id);
        // return;
        db.query(`UPDATE employee
                  SET role_id = ?
                  WHERE first_name = ? and last_name = ?
        `, eeNewRole, (err, result) => {
          if (err) {
            console.log('error', err);
            return;
          }
          return promptUser();
        })
      })

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
        return showEmployeeTable();
      } else if (data.mainMenuSelection === 'Add Employee') {
        return showManagerNames(['add_employee'], 1);
      } else if (data.mainMenuSelection === 'Remove Employee') {
        return showEmployeeNames('remove');
      } else if (data.mainMenuSelection === 'Update Employee Role') {
        return showEmployeeNames('update_role');
      } else if (data.mainMenuSelection === 'Update Employee Manager') {
        return showEmployeeNames('update_manager');
      } else if (data.mainMenuSelection === 'View Employees by Manager') {
        return showManagerNames(['view_employee'], 1);
      } else if (data.mainMenuSelection === 'View Employees by Department') {
        return showDepartmentNames('view_employee');
      } else if (data.mainMenuSelection === 'View Budget by Department') {
        return showDepartmentNames('view_budget');
      } else if (data.mainMenuSelection === 'Quit') {
        console.log(`
        ░█▀▀░█▀█░█▀█░█▀▄░█▀▄░█░█░█▀▀░█
        ░█░█░█░█░█░█░█░█░█▀▄░░█░░█▀▀░▀
        ░▀▀▀░▀▀▀░▀▀▀░▀▀░░▀▀░░░▀░░▀▀▀░▀
          `);
        return;
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
        'View Employees by Manager', 'View Employees by Department', 'View Budget by Department',
        'Add Employee', 'Remove Employee', 'Update Employee Role', 
        'Update Employee Manager', 'Quit']
    })
}

const addEmployee = (managerData) => {
  return inquirer
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
        choices: ['Product Specialist', 'Product Operations Lead', 'Operations Manager',
          'Software Engineer', 'Tech Lead', 'Engineering Manager',
          'Marketing Specialist', 'Product Marketing Lead', 
          'Marketing Manager', 'Chief Executive Officer'
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

// promptUser();
module.exports = promptUser;