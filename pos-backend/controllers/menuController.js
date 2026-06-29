const createHttpError = require("http-errors");
const MenuItem = require("../models/menuItemModel");

const createMenuItem = async (req, res, next) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
      const error = createHttpError(400, "Nombre, precio y categoría son obligatorios.");
      return next(error);
    }

    const item = await MenuItem.create({ name, price, category, description });
    res.status(201).json({ success: true, message: "Plato creado correctamente.", data: item });
  } catch (error) {
    next(error);
  }
};

const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const item = await MenuItem.findByIdAndUpdate(id, update, { new: true });
    if (!item) {
      const error = createHttpError(404, "Plato no encontrado.");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Plato actualizado correctamente.", data: item });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      const error = createHttpError(404, "Plato no encontrado.");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Plato eliminado correctamente." });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem };
