const axios = require("axios");
const { Router } = require("express");
const async = require("hbs/lib/async");
const { message } = require("response-format");
const { ObjectId } = require("mongoose").Types;
const FormatResponse = require("response-format");
const ContentPass = require("../models/Contentpass");
const hostName = require("../utils/constant")
const router = Router();

// test API
router.post("/hello", (req, res) => {
  try {
    res.send("hello world");
  } catch (err) {}
});

// --------------------------------------------------------------------------------------------------------------------------------
// adding seried data with new users this is added in register part
router.post("/addSeriesInUserPass/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json(FormatResponse.badRequest("Enter All Fileds", {}));

    const { data } = await axios(
      `${hostName.seriesHostName}/Api/book/getAllComtent`
    );
    let ans = data.data;
    let totalChapterUnlocked = 4;
    ans.map(async (item) => {
      let data = {
        userId,
        seriesId: item._id,
        title: item.title,
        totalChapterUnlocked: totalChapterUnlocked,
      };
      const series = new ContentPass({ ...data });
      series.save();
    });
    console.log(data);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// ------------------------------------------------------------------------------------------------------------------
// API to get series unlocked for the user
router.get("/getSeriesDataById/:userId", async (req, res) => {
  try {
    const { seriesList } = req.body;
    const { userId } = req.params;
    if (!userId || seriesList?.length == 0 || !seriesList)
      return res
        .status(404)
        .json(FormatResponse.badRequest("Enter all fileds", {}));
    let userData = [];
    let response = [];
    seriesList.forEach((item) => {
      userData.push({
        seriesId: ObjectId(item),
        userId: userId,
      });
    });

    const resultContentList = await ContentPass.find({
      $or: userData,
    });
    const { data } = await axios.post(
      `${hostName.seriesHostName}/Api/book/seriesById`,
      { seriesId: resultContentList }
    );
    // console.log(data);
    // console.log(userData);
    var userData1 = {};
    data.map((item, index) => {
      resultContentList.find((element) => {
        if (element.seriesId === item._id) {
          // console.log(
          //   element.totalChapterUnlocked,
          //   item.totalChapter,
          //   "line 20"
          // );
          if (element.totalChapterUnlocked < item.totalChapter) {
            data[index].seriesList.splice(
              element.totalChapterUnlocked,
              item.totalChapter - element.totalChapterUnlocked
            );
          }
        }
      });
    });
    console.log({ aaa: resultContentList });
    return res.status(200).json(FormatResponse.success("Success", data));
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});
// -------------------------------------------------------------------------------------------------------------------------
// create pass when we create series  this is added in new series  part
router.post("/addSeriesForAllUser", async (req, res) => {
  try {
    const { seriesId, title } = req.body;
    if (!seriesId || !title)
      return res
        .status(404)
        .json(FormatResponse.badRequest("Enter all fileds", {}));

    const { data } = await axios(`${hostName.userHostName}/Api/user/fetchAllUser`);
    let response = data;
    let totalChapterUnlocked = 4;
    console.log(response);
    response.map((item) => {
      let data = {
        userId: item._id,
        seriesId,
        title,
        totalChapterUnlocked: totalChapterUnlocked,
      };
      const series = new ContentPass({ ...data });
      series.save();
    });

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// ---------------------------------------------------------------------------------------------------------------------------
// to update chapters of the user by series id (single user)
router.patch("/unlockSeriesChapterForUser", async (req, res) => {
  try {
    const { userId, seriesId } = req.body;
    if (!seriesId || !userId)
      return res
        .status(404)
        .json(FormatResponse.badRequest("Enter all fileds", {}));

    const response = await ContentPass.findOne({
      userId: userId,
      seriesId: seriesId,
    });
    response.totalChapterUnlocked = response.totalChapterUnlocked + 1;
   await response.save();
    res.status(200).json(FormatResponse.success("Success", response));
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

module.exports = router;

// //   const { response } = await axios.post(
//   `http://localhost:8082/Api/dailyPass/addSeriesByUserId`,
//   { userId, seriesId: item._id, title: item.title ,totalChapterUnlocked:totalChapterUnlocked }
// );
