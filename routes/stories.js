const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");

router.get("/add", ensureAuth, (req, res) => {
  try {
    res.render("stories/add", {
      name: req.user.fullName,
      name: req.user.fullName,
      whichPartial: function () {
        return "_header";
      },
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.post("/", ensureAuth, async (req, res) => {
  try {
    const story = new Story({
      title: req.body.title,
      body: req.body.textarea,
      status: req.body.status,
      user: req.user.id,
    });
    await story.save().then((user) => {
      if (user) {
        console.log(req.body);
      }
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.get("/", ensureAuth, async (req, res) => {
  try {
    let stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
      image: req.user.image,
      name: req.user.fullName,
      whichPartial: function () {
        return "_header";
      },
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.get("/edit/:id", ensureAuth, async (req, res) => {
  // 밑에 내용 원본과 다르게 내 맘대로 customize 성공
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) {
      res.render("error/404");
    }
    if (story) {
      if (story.user._id == req.user.id) {
        res.render("stories/edit", {
          story,
          image: req.user.image,
          name: req.user.fullName,
          whichPartial: function () {
            return "_header";
          },
        });
      } else {
        res.redirect("/dashboard");
      }
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      res.render("error/404");
    }
    if ((story.user = req.user.id)) {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    } else {
      res.redirect("/stories");
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      res.render("error/404");
    }
    if (story.user == req.user.id) {
      story = await Story.remove({ _id: req.params.id }).lean();
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) {
      res.render("error/404");
    } else {
      res.render("stories/show", {
        story,
        image: req.user.image,
        name: req.user.fullName,
        whichPartial: function () {
          return "_header";
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    let stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    if (!stories) {
      res.render("error/404");
    } else {
      res.render("stories/index", {
        stories,
        image: req.user.image,
        name: req.user.fullName,
        whichPartial: function () {
          return "_header";
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
module.exports = router;
