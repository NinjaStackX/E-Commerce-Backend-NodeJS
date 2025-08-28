export const queryBuilder = async (Model, queryParams, defaultFilter = {}) => {
  let queryObj = { ...defaultFilter };

  // keyword search
  if (queryParams.keyword) {
    queryObj.$or = [
      { title: { $regex: queryParams.keyword, $options: "i" } },
      { description: { $regex: queryParams.keyword, $options: "i" } },
    ];
  }

  // category filter
  if (queryParams.category) {
    queryObj.category = queryParams.category;
  }

  // price filter
  if (queryParams.minPrice || queryParams.maxPrice) {
    queryObj.price = {};
    if (queryParams.minPrice)
      queryObj.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice)
      queryObj.price.$lte = Number(queryParams.maxPrice);
  }

  // rating filter
  if (queryParams.minRating) {
    queryObj.rating = { $gte: Number(queryParams.minRating) };
  }

  // build query
  let query = Model.find(queryObj);

  // sort
  if (queryParams.sortBy) {
    const sortField = queryParams.sortBy;
    const sortOrder = queryParams.sortOrder === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  }

  // pagination
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit).lean();

  // execute
  const results = await query;
  const total = await Model.countDocuments(queryObj);

  return { results, total, page, limit };
};
