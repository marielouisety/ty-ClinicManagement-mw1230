const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = 3000;


// ========================================
// Middleware
// ========================================

app.use(express.json());

app.use(express.static(__dirname));


// ========================================
// MySQL Connection
// ========================================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "paSSword",

    database: "clinic_db"

});


// ========================================
// Test Database Connection
// ========================================

db.connect((err) => {

    if (err) {

        console.error(
            "Database connection failed:",
            err
        );

        return;

    }

    console.log(
        "Connected to MySQL"
    );

});


// ========================================
// PATIENTS
// ========================================


// GET - Retrieve Patients

app.get(
    "/api/patients",
    (req, res) => {

        const sql =
            "SELECT * FROM patients";


        db.query(
            sql,
            (err, results) => {

                if (err) {

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error"
                        });

                }


                res.json(results);

            }
        );

    }
);


// POST - Add Patient

app.post(
    "/api/patients",
    (req, res) => {

        const {
            name,
            age,
            gender,
            contact,
            address
        } = req.body;


        const sql = `
            INSERT INTO patients
            (name, age, gender, contact, address)

            VALUES (?, ?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                name,
                age,
                gender,
                contact,
                address
            ],

            (err, result) => {

                if (err) {

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error"
                        });

                }


                res.status(201).json({

                    message:
                        "Patient added successfully",

                    id:
                        result.insertId

                });

            }
        );

    }
);


// PUT - Update Patient

app.put(
    "/api/patients/:id",
    (req, res) => {

        const id =
            req.params.id;


        const {
            name,
            age,
            gender,
            contact,
            address
        } = req.body;


        const sql = `
            UPDATE patients

            SET
                name = ?,
                age = ?,
                gender = ?,
                contact = ?,
                address = ?

            WHERE id = ?
        `;


        db.query(
            sql,

            [
                name,
                age,
                gender,
                contact,
                address,
                id
            ],

            (err, result) => {

                if (err) {

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error"
                        });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Patient not found"
                        });

                }


                res.json({

                    message:
                        "Patient updated successfully"

                });

            }
        );

    }
);


// DELETE - Delete Patient

app.delete(
    "/api/patients/:id",
    (req, res) => {

        const id =
            req.params.id;


        const sql = `
            DELETE FROM patients
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],

            (err, result) => {

                if (err) {

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error"
                        });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Patient not found"
                        });

                }


                res.json({

                    message:
                        "Patient deleted successfully"

                });

            }
        );

    }
);


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);