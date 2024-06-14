const Products = require('../models/productModel.js');
const Sale = require('../models/salesModel.js');

const getPaginatedUsers = async (page, limit) => {
  let skipLimit = (page - 1) * limit;

  try {
    const products = await Products.find()
      .skip(skipLimit)
      .limit(limit)
      .exec();

    const count = await Products.countDocuments();
    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    };
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    throw new Error('Error fetching paginated users: ' + error.message);
  }
};



const getWeeklySales = async () => {
  const today = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - today.getDay() - 7); 

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  console.log("Start of Previous Week:", startOfWeek);
  console.log("End of Previous Week:", endOfWeek);

  const sales = await Sale.aggregate([
    {
      $unwind: "$products"
    },
    {
      $match: {
        "products.date": {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$products.date" },
        totalProductCount: { $sum: "$products.count" }
      }
    },
    {
      $sort: { "_id": 1 } 
    },
    {
      $project: {
        dayOfWeek: "$_id",
        totalProductCount: 1,
        _id: 0
      }
    }
  ]);

  console.log("Aggregated Sales:", JSON.stringify(sales, null, 2));

  // Create an array with days of the week
  const dayMapping = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Map the results to include all days of the week with default count of 0
  const result = dayMapping.map((day, index) => {
    const salesForDay = sales.find(sale => sale.dayOfWeek === index + 1);
    return {
      day,
      totalProductCount: salesForDay ? salesForDay.totalProductCount : 0
    };
  });

  return result;
};

const getWeeklyProfit = async () => {
  const today = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - today.getDay() - 7); 

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const sales = await Sale.aggregate([
    {
      $unwind: "$products"
    },
    {
      $match: {
        "products.date": {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$products.date" },
        profit: {
          $cond: {
            if: { $and: [{ $ne: ["$products.discountPrice", null] }, { $ne: ["$products.discountPrice", undefined] }] },
            then: { 
              $multiply: [
                { $subtract: ["$products.discountPrice", "$products.purchasePrice"] }, 
                "$products.count"
              ]
            },
            else: { 
              $multiply: [
                { $subtract: ["$products.price", "$products.purchasePrice"] }, 
                "$products.count"
              ]
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$dayOfWeek",
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { "_id": 1 }
    },
    {
      $project: {
        dayOfWeek: "$_id",
        totalProfit: 1,
        _id: 0
      }
    }
  ]);

  // Create an array with days of the week
  const dayMapping = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Map the results to include all days of the week with default profit of 0
  const result = dayMapping.map((day, index) => {
    const profit = sales.find(sale => sale.dayOfWeek === index + 1);
    return {
      day,
      totalProfit: profit ? profit.totalProfit : 0
    };
  });

  return result;
};



const getMonthlySales = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based index (0 = January, 1 = February, etc.)

  const sales = await Sale.aggregate([
    {
      $unwind: "$products"
    },
    {
      $match: {
        "products.date": {
          $gte: new Date(currentYear, 0, 1), 
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      }
    },
    {
      $group: {
        _id: { 
          year: { $year: "$products.date" },
          month: { $month: "$products.date" }
        },
        totalProfit: { 
          $sum: { 
            $cond: {
              if: { $and: [{ $ne: ["$products.discountPrice", null] }, { $ne: ["$products.discountPrice", undefined] }] },
              then: { $multiply: [{ $subtract: ["$products.discountPrice", "$products.purchasePrice"] }, "$products.count"] },
              else: { $multiply: [{ $subtract: ["$products.price", "$products.purchasePrice"] }, "$products.count"] }
            }
          }
        },
        totalRevenue: {
          $sum: {
            $cond: {
              if: { $and: [{ $ne: ["$products.discountPrice", null] }, { $ne: ["$products.discountPrice", undefined] }] },
              then: { $multiply: ["$products.discountPrice", "$products.count"] },
              else: { $multiply: ["$products.price", "$products.count"] }
            }
          }
        },
        totalProductCount: { $sum: "$products.count" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        totalProfit: 1,
        totalRevenue: 1,
        totalProductCount: 1,
        _id: 0
      }
    }
  ]);

  // Convert month numbers to month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Create a complete list of months for the current year with zero values
  const completeMonthlyData = Array.from({ length: currentMonth + 1 }, (_, index) => ({
    month: `${monthNames[index]} ${currentYear}`,
    Profit: 0,
    Revenue: 0,
    Sales: 0
  }));

  // Merge the aggregation results with the complete list of months
  sales.forEach(sale => {
    const monthIndex = sale.month - 1; // Convert 1-based month to 0-based index
    completeMonthlyData[monthIndex] = {
      month: `${monthNames[monthIndex]} ${sale.year}`,
      Profit: sale.totalProfit,
      Revenue: sale.totalRevenue,
      Sales: sale.totalProductCount
    };
  });




  console.log("Aggregated Sales, Profit, and Revenue by Month for Current Year:", JSON.stringify(completeMonthlyData, null, 2));

  return completeMonthlyData;
};


const getWeeklyRevenue = async () => {
  const today = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - today.getDay() - 7); // Start of current week (last Sunday)

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // End of current week (next Sunday)

  try {
    const sales = await Sale.aggregate([
      {
        $unwind: "$products"
      },
      {
        $match: {
          "products.date": {
            $gte: startOfWeek,
            $lt: endOfWeek,
          },
        },
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$products.date" },
          revenue: {
            $cond: {
              if: { $and: [{ $ne: ["$products.discountPrice", null] }, { $ne: ["$products.discountPrice", undefined] }] },
              then: {
                $multiply: [
                  "$products.discountPrice",
                  "$products.count"
                ]
              },
              else: {
                $multiply: [
                  "$products.price",
                  "$products.count"
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$dayOfWeek",
          totalRevenue: { $sum: "$revenue" }
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          dayOfWeek: "$_id",
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    // Create an array with days of the week
    const dayMapping = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Map the results to include all days of the week with default revenue of 0
    const result = dayMapping.map((day, index) => {
      const financialSummary = sales.find(sale => sale.dayOfWeek === index + 1);
      return {
        day,
        totalRevenue: financialSummary ? financialSummary.totalRevenue : 0
      };
    });

    return result;
  } catch (error) {
    console.error("Error calculating weekly revenue:", error.message);
    throw new Error(error.message);
  }
};



module.exports = {
  getPaginatedUsers,
  getWeeklySales,
  getWeeklyProfit,
  getMonthlySales,
  getWeeklyRevenue
};
