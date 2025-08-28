export const queryBuilder = async (Model, query) => {
  let mongooseQuery = Model.find();

  // 1️⃣ نسخ query
  const queryObj = { ...query };
  const excludeFields = [
    "page",
    "limit",
    "sort",
    "fields",
    "search",
    "populate",
  ];
  excludeFields.forEach((field) => delete queryObj[field]);

  // 2️⃣ تحويل القيم الرقمية
  Object.keys(queryObj).forEach((key) => {
    if (typeof queryObj[key] === "object") {
      Object.keys(queryObj[key]).forEach((op) => {
        // لو القيمة موجودة فقط
        if (queryObj[key][op] !== undefined) {
          queryObj[key][op] = Number(queryObj[key][op]);
        }
      });
    }
  });

  // 3️⃣ stringify + replace gte/lt
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 4️⃣ apply to mongoose query
  mongooseQuery = mongooseQuery.find(JSON.parse(queryStr));

  // =========================
  // 2. Search (مثال على name/title)
  // =========================
  if (query.search) {
    mongooseQuery = mongooseQuery.find({
      $or: [
        { name: { $regex: query.search, $options: "i" } },
        { title: { $regex: query.search, $options: "i" } },
      ],
    });
  }

  // =========================
  // 3. Sorting
  // =========================
  if (query.sort) {
    const sortBy = query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // =========================
  // 4. Field Limiting
  // =========================
  if (query.fields) {
    const fields = query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // =========================
  // 5. Pagination
  // =========================
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  mongooseQuery = mongooseQuery.skip(skip).limit(limit);

  // =========================
  // 6. Dynamic Nested Populate + Fields
  // =========================
  if (query.populate) {
    // مثال:
    // populate=user:name,email;user.profile:bio,avatar;user.profile.address:city,country
    const populateFields = query.populate
      .split(";")
      .map((field) => field.trim());

    const buildPopulate = (field) => {
      const [pathPart, select] = field.split(":");
      return {
        path: pathPart.trim(),
        select: select ? select.split(",").join(" ") : undefined,
      };
    };

    // دعم nested populate: user.profile.address
    const populateMap = {};

    populateFields.forEach((field) => {
      const [pathPart, select] = field.split(":");
      const pathSegments = pathPart.split(".");

      let current = populateMap;
      pathSegments.forEach((segment, idx) => {
        if (!current[segment]) current[segment] = {};
        if (idx === pathSegments.length - 1) {
          current[segment]._select = select
            ? select.split(",").join(" ")
            : undefined;
        }
        current = current[segment];
      });
    });

    const convertToPopulateArray = (map, parentPath = "") => {
      return Object.entries(map).map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}.${key}` : key;
        const populateObj = { path: fullPath };
        if (value._select) populateObj.select = value._select;

        const children = Object.entries(value).filter(([k]) => k !== "_select");
        if (children.length > 0) {
          populateObj.populate = convertToPopulateArray(value, fullPath);
        }
        return populateObj;
      });
    };

    const populateArray = convertToPopulateArray(populateMap);
    populateArray.forEach((pop) => {
      mongooseQuery = mongooseQuery.populate(pop);
    });
  }

  // =========================
  // 7. Execute Query
  // =========================
  const results = await mongooseQuery;
  const total = await Model.countDocuments(JSON.parse(queryStr));

  return { results, total, page, limit };
};
