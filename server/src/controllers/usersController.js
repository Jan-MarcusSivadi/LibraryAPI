const utils = require('../utils/utils')
const { db } = require("../db")
const users = db.users

//CREATE

exports.createNew = async (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.username || !req.body.phonenr) {
        return res.status(400).send({ error: "One or all required parameters are missing" })
    }
    const createdUser = await users.create(req.body, {
        fields: ["firstname", "lastname", "email", "password", "username", "phonenr"]
    })
    res.status(201)
        .location(`${utils.getBaseUrl(req)}/users/${createdUser.id}`)
        .json(createdUser)
}
// READ
exports.getAll = async (req, res) => {
    const result = await users.findAll({ attributes: ["id", "firstname", "lastname", "email", "password", "username", "phonenr"] })
    res.send(JSON.stringify(result))
}
exports.getById = async (req, res) => {
    const foundUser = await  users.findByPk(req.params.id)
    console.log("id", req.params.id)
    console.log("foundUser:", foundUser)
    if (foundUser === null) {
        return res.status(404).send({ error: `User not found` })
    }
    res.send(foundUser)
}
  // UPDATE
  exports.editById = async (req, res) => {
    const updatedUser = await users.update({ ...req.body }, {
        where: { id: req.params.id},
        fields: ["firstname", "lastname", "email", "password", "username", "phonenr"]
    })
      if (updatedUser[0] == 0) {
        return res.status(404).send({error: "User not found"})
      }
      res.status(202)
            .location(`${utils.getBaseUrl(req)}/users/${createdUser.id}`)
            .send()
  }
  // DELETE
  exports.deleteById = async (req, res) => {
    const deletedAmount = await users.destroy({
        where: { id: req.params.id }
    })

    if (deletedAmount == 0) {
        return res.status(404).send({ error: "User not found." })
    }
    res.status(204).send() 
}
  