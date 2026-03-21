const fs = require('fs');
const Tour = require('./../models/tourModel');
const { match } = require('assert');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// 69ba925254cc3361d25c1e8c
exports.getAllTours = async (req, res) => {
  try {
    // built ths query
    //1A) filtering:
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(req.query, queryObj);
    console.log(req.query);
    //1B) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // here to replace our object with the object that comes from the query which mean the mongodb operators
    // we did it with regular expression \b mens we only wanna match the exact operations that we want and G for to happen that multiple times 
    // without the g it will match just the first one
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting:
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy)
    } else query.sort('-createdAt')

    // 3) fields limiting:

    //EXECUTE THE QUERY
    const tours = await query
    // find method is going to return a query
    // const query = await Tour
    //   .find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .equals(5)


    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

// --------- get a single tour by id ----------
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findById({_id:req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }

}

//----------- create new tour ------------
exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
}

// --------- delete a tour -----------
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'the tour has been deleted',
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    })
  }
}
// 204 means no content
//in delete we don't sent any data we jus sent null and that mean the data no longer exist


// -------- update tour ----------
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    const stats = Tour.aggregate([
      //each element in the array is a stage
      {
        //to select/felter doc
        $match: {
          ratingAverage: { $gte: 4.5 }
        },
        //its allow you to group data
        $group: {
          _id: null,

        }
      }
    ])
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
}