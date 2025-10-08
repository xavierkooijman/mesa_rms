const tablesModel = require("../models/table.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const checkIfTableExistsById = async (restaurantId, tableId) => {
  const tableExists = await tablesModel.checkIfTableExistsById(
    restaurantId,
    tableId
  );

  if (!tableExists) {
    throw new AppError(
      "Table does not exist in this restaurant",
      ERROR_CODES.TABLE_NOT_FOUND,
      404
    );
  }
};

module.exports = { checkIfTableExistsById };
