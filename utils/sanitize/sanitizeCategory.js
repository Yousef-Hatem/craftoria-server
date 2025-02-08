exports.sanitizeCategory = function (category) {
  return {
    _id: category._id,
    name: category.name,
    description: category.description,
    image: category.image,
    createdAt: category.createdAt,
  };
};
