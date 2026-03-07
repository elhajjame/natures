const fs = require('fs');
const Tour = require('./../models/tourModel')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    // built ths query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(req.query, queryObj);
    const query = await Tour.find(queryObj);
    // find method is going to return a query
    // const query = await Tour
    //   .find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .equals(5)

    //EXECUTE THE QUERY
    const tours = await query
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
    await Tour.findOneAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'the tour has been deleted',
    })
  } catch (err) {
    res.status(204).json({
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