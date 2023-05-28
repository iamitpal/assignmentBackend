const express = require("express")
const { InventoryModel } = require("../Models/inventoryModel.js")
const { oemSpecsModel } = require("../Models/oemSpecsModel.js")
const { userRelationShip } = require("../Middlewares/userRelationship.js")

const invetoryRouter = express.Router()

invetoryRouter.post("/inventory", async (req, res) => {
  try {
    let newInventoryModal = InventoryModel(req.body)
    await newInventoryModal.save()
    res.status(200).send({ msg: "Deal Added Successs" })
  } catch (error) {
    res.send({ error })
  }
})

invetoryRouter.get("/inventory", async (req, res) => {
  // const search="Honda"
  const { order, filter, search } = req.query
  try {
    if (filter === "price") {
      let deals

      if (order == "desc") {
        deals = await InventoryModel.find({})
          .populate("oemId")
          .sort({ price: -1 })
        console.log(deals)
      } else {
        deals = await InventoryModel.find({})
          .populate("oemId")
          .sort({ price: 1 })
      }

      res.status(200).send({ deals })
    } else if (filter == "mileage") {
      let deals = await InventoryModel.find({}).populate("oemId").lean()

      if (order == "desc") {
        deals.sort((a, b) => b.oemId.mileage - a.oemId.mileage)
      } else {
        deals.sort((a, b) => a.oemId.mileage - b.oemId.mileage)
      }

      res.status(200).send({ deals })
    } else if (filter === "colors") {
      let deals = await InventoryModel.find({}).populate({
        path: "oemId",
        match: { colors: { $regex: order, $options: "i" } },
      })
      deals = deals.filter((deal) => deal.oemId !== null)

      res.status(200).send({ deals })
    } else {
      let deals = await InventoryModel.find({}).populate({
        path: "oemId",
      })

      res.status(200).send({ deals })
    }
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
})

//particular user deals

//to get the partiucalar deal by id
invetoryRouter.get("/inventory/:id", async (req, res) => {
  const { id } = req.params

  try {
    let deals = await InventoryModel.findById(id)
    res.status(200).send({ deals })
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
})

invetoryRouter.get("/check", userRelationShip, async (req, res) => {
  res.send({ msg: "Done" })
})

invetoryRouter.patch("/inventory/:id", async (req, res) => {
  const { id } = req.params

  try {
    await InventoryModel.findByIdAndUpdate(id, req.body)
    res.status(200).send({ msg: "Updated Deal Success" })
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
})

invetoryRouter.delete("/inventory/:id", async (req, res) => {
  const { id } = req.params

  try {
    await InventoryModel.findByIdAndDelete(id)
    res.status(200).send({ msg: "Deleted Deal Success" })
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
})

module.exports = { invetoryRouter }
