module.exports.vendorsPageService = async (query) => {
      const { params, error } = queryConstructor(query, "createdAt", "vendors");
      if (error) {
            return messageHandler(error, false, BAD_REQUEST, {});
      }

      const vendor = await Vendor.findOne({ _id: mongoose.Types.ObjectId(params.vendorId) })
            .select({ restaurantName: 1, address: 1, operatingHours: 1, ratings: 1, coverPhoto: 1, image: 1 });
      if(vendor === null) {
            return messageHandler("Kindly provide a valid Vendor Id", false, BAD_REQUEST, {});
      }

      const ratings = await Rating.find({ vendorId: mongoose.Types.ObjectId(vendor._id) }).populate("customerId", { name: 1, image: 1});
      const categories = await Category.find({$or: [{default: true}, { vendorId: params.vendorId}]})

      const sortByCategory = {};
      categories.forEach(category => {
            sortByCategory[category.name] = [
                  {
                        $match: {
                              category: category.name
                        }
                  }
            ];
      })

      // const menus = await Menu.aggregate([
      //       {
      //             $match: {
      //                   vendorId: {$in: [mongoose.Types.ObjectId(params.vendorId)]}
      //             }
      //       },
      //       {
      //             $project: { name: 1, images: 1, price: 1, category: 1 }
      //       },
      //       {
      //             $facet: sortByCategory
      //       }
      // ]);

      const menus = await Menu.aggregate([
            {
            $group: {
                  _id: "$category",
                  menus: {
                        $push: {
                              name: "$name",
                              images: "$images",
                              price: "$price",
                              category: "$category",
                              vendorId: "$vendorId"
                        }
                  }
            }
            },
            { $match: { "menus.vendorId": mongoose.Types.ObjectId(params.vendorId) } },
      ]);

      // const totalMenuCategories = categories.length;
      // let totalMenus = 0;
      // for(let i = 0; i < totalMenuCategories; i++) {
      //       totalMenus += menus[0][categories[i].name].length
      // }

      // const data = { restaurant: vendor, reviews: { totalReviews: ratings.length, reviews: ratings }, menus: { totalMenuCategories, totalMenus, menus: { ...menus[0] } } };


      return messageHandler("Vendor found", true, SUCCESS, menus);
}