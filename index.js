const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Sequelize('bcytqjuavpr0plhx57cc', 'uojrvraauvxny7jw', 'I2QhuVhKwrFwNBeZtG6M', {
    host: 'bcytqjuavpr0plhx57cc-mysql.services.clever-cloud.com',
    dialect: 'mysql'
})

db.sync({ alter: true });
const Employees = db.define('Employees', {
    idNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    manager: {
        type: DataTypes.STRING
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
const EmployeesRoles = db.define('EmployeesRoles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

EmployeesRoles.hasMany(Employees);
Employees.belongsTo(EmployeesRoles);

app.get('/roles', async (req, res) => {
    try {
        const roles = await EmployeesRoles.findAll();
        res.json(roles);
    }
    catch (err) {
        res.send(err);
    }
});

app.get('/employees', async (req, res) => {
    try {
        const employeesList = await Employees.findAll({ include: EmployeesRoles });
        res.json(employeesList);
    }
    catch (err) {
        res.send(err);
    }
});

app.get('/managmentEmployees', async (req, res) => {
    try {
        const employeesList = await Employees.findAll({ where: { EmployeesRoleId: 2 }, include: EmployeesRoles });
        res.json(employeesList);
    }
    catch (err) {
        res.send(err);
    }
});

app.get('/osEmployees', async (req, res) => {
    try {
        const employeesList = await Employees.findAll({ where: { EmployeesRoleId: 3 }, include: EmployeesRoles });
        res.json(employeesList);
    }
    catch (err) {
        res.send(err);
    }
});

app.get('/formerEmployees', async (req, res) => {
    try {
        const employeesList = await Employees.findAll({ where: { isDelete: 1 }, include: EmployeesRoles });
        res.json(employeesList);
    }
    catch (err) {
        res.send(err);
    }
});

app.post('/addEmployee', async (req, res) => {
    let { name, idNumber, manager, EmployeesRoleId } = req.body;
    if (idNumber.length === 8) {
        idNumber = "0" + idNumber;
    }
    try {
        const addEmployee = await Employees.create({
            name, idNumber, manager, EmployeesRoleId,
            fields: ['name', 'idNumber', 'manager', 'EmployeesRoleId']
        });
        res.json(addEmployee);
    }
    catch (err) {
        res.send(err);
    }
});

app.delete('/deleteEmployee', async (req, res) => {
    try {
        const deleteEmployee = await Employees.update({
            isDelete: true
        },
            { where: { idNumber: req.body.idNumber } });
        res.send(deleteEmployee);
    }
    catch (err) {
        res.send(err);
    }
});

app.put('/updateEmployee', async (req, res) => {
    const { name, idNumber, manager, EmployeesRoleId } = req.body;
    try {
        const updateEmployee = await Employees.update({
            name, manager, EmployeesRoleId
        },
            { where: { idNumber } });
        res.send(updateEmployee);
    }
    catch (err) {
        res.send(err);
    }
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(process.env.PORT || 3001, () => console.log('app on port 3002'));