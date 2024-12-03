const fs = require("fs/promises");
const asyncHandler = require("express-async-handler");
const pluralize = require("pluralize");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteImage } = require("../middlewares/uploadImageMiddleware");

class HandlersFactory {
  constructor(Model, options = {}) {
    this.Model = Model;
    this.options = options;
  }

  #setOptionsInQuery = (query, options) => {
    const select =
      options.select ||
      this.options.select ||
      `-__v -updatedAt -deleted ${options.addSelect || ""}`;
    const populate = options.populate || this.options.populate;
    const lean = options.lean || this.options.lean;

    query.select(select);

    if (lean !== false) {
      query.lean();
    }

    if (populate) {
      query = query.populate(populate);
    }
    return query;
  };

  #deleteImages = async (imageNames) => {
    const folderName = pluralize(this.Model.modelName.toLowerCase());
    await Promise.all(
      imageNames.map(async (imageName) => {
        const path = `uploads/images/${folderName}/${imageName}`;
        await fs.unlink(path);
      })
    );
  };

  deleteDocumentImage = async (
    req,
    imageKey,
    { select, getLocationOfImage } = {}
  ) => {
    if (req.body[imageKey]) {
      const { id } = req.params;
      const document = await this.Model.findById(id)
        .select(select || imageKey)
        .lean();
      if (!document) {
        await deleteImage(this.Model, req.body[imageKey]);
        throw new ApiError(`No document for this id ${id}`, 404);
      }
      let imageName;
      if (getLocationOfImage) {
        try {
          const location = getLocationOfImage(document);
          imageName = location[imageKey];
        } catch (err) {
          await deleteImage(this.Model, req.body[imageKey]);
          throw err;
        }
      } else {
        imageName = document[imageKey];
      }
      if (imageName !== undefined) {
        await deleteImage(this.Model, imageName);
      }
    }
  };

  deleteOne = (photoColumns = []) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const document = await this.Model.findByIdAndDelete(id);

      if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 404));
      }

      if (photoColumns.length) {
        const imageNames = [];

        photoColumns.forEach((column) => {
          const value = document[column];

          if (typeof value === "string") {
            imageNames.push(value);
          } else if (Array.isArray(value)) {
            imageNames.push(...value);
          } else if (value !== undefined) {
            throw new ApiError(
              `An error occurred while deleting photos for this id ${id}`,
              500
            );
          }
        });

        if (imageNames.length > 0) {
          await this.#deleteImages(this.Model, imageNames);
        }
      }

      res.status(204).send();
    });

  updateOne = (options = {}) =>
    asyncHandler(async (req, res, next) => {
      const { imageKey } = options;
      await this.deleteDocumentImage(req, imageKey);

      let query = this.Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      query = this.#setOptionsInQuery(query, options);

      const document = await query;

      if (!document) {
        return next(
          new ApiError(`No document for this id ${req.params.id}`, 404)
        );
      }
      res.status(200).json({ data: document });
    });

  createOne = (sanitize) =>
    asyncHandler(async (req, res) => {
      let newDoc = await this.Model.create(req.body);

      if (sanitize) {
        newDoc = sanitize(newDoc);
      } else if (sanitize !== false) {
        newDoc.__v = undefined;
        newDoc.updatedAt = undefined;
      }

      res.status(201).json({ data: newDoc });
    });

  getOne = (options = {}) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;

      let query = this.Model.findById(id);
      query = this.#setOptionsInQuery(query, options);

      const document = await query;

      if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 404));
      }
      res.status(200).json({ data: document });
    });

  getAll = (options = {}) =>
    asyncHandler(async (req, res) => {
      let filter = {};
      if (req.filterObject) {
        filter = req.filterObject;
      }

      const documentsCount = await this.Model.countDocuments();

      let query = this.Model.find(filter);
      query = this.#setOptionsInQuery(query, options);

      const apiFeatures = new ApiFeatures(query, req.query)
        .paginate(documentsCount)
        .filter()
        .search()
        .limitFields()
        .sort();

      const { mongooseQuery, paginationResult } = apiFeatures;
      const documents = await mongooseQuery;

      res
        .status(200)
        .json({ results: documents.length, paginationResult, data: documents });
    });
}

module.exports = HandlersFactory;
