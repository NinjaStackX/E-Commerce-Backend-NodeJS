export default getAll = async (Name, req, res) => {
  let queryObj = {};

  if (req.query.keyword) {
    queryObj.$or = [
      {
        title: { $regex: req.query.keyword, $option: "i" },
        description: { $regex: req.query.keyword, $option: "i" },
      },
    ];
  }

  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
  }
  if (req.query.minRating) {
    queryObj.rating = {
      $gte: Number(req.query.minRating),
    };
  }

  const query = await Name.find(queryObj);

  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortB === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  }

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  //query = query; //.limit(limit).skip(skip);

  const products = await query; //.lean();
  const total = await Name.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    message: "Completed get Products successfully!",
    total,
    page,
    limit,
    products,
  });
};
