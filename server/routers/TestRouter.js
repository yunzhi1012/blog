const express = require("express")
const { db, genid } = require("../db/DbUtils")
const router = express.Router()

router.get("/test", async (req, res) => {
    // db.all("select * from `admin`", [], (err, rows) => {
    //     console.log(rows)
    // })

    // db.async.all("select * from `admin`", []).then((res) => {
    //     console.log(res)
    // })

    let out = await db.async.all("select * from `admin`", [])

    res.send({
        id: genid.NextId(),
        out
    })
})

module.exports = router