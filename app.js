// error 1시간 반... dotenv.config에서 .빼먹음, router 대신 app으로 씀
// passport에서 find and create 부분 로직 틀림. findOrcreate가 함수가 아니라 따로 분리해서 쓰는 거였음
// create가 save역할도 한다고 나옴 / font awesome은 css로 받아서 style에다 넣는 건데 js로 받아서 script로 넣어버림
// materialize 여러 양식들 틀리게 씀 / isAuthenticated에 괄호 안 써서 한참 고생
// https://stackoverflow.com/questions/31905684/dynamic-partial-in-handlebars / dynamic partial 해냈다!!!
// materialize 에서는 신기하게 a태그 놓고 class에 btn 놓으면 버튼됨. submit 할 때 말고는 굳이 버튼 태그 안 써도 됨. add.hbs 참고
// save를 쓰냐 create를 쓰냐에 따라 방식 좀 다름, save 어색, bodyparser 까먹음, name 잘못 설정해서 오류, helpers 적는 방법
// 황당하게도 global var를 passport.initialize보다 위에 놓으니까 오류 생김. req.user써서 그런가 봄
// ==냐 ===냐에서도 큰 차이, 그냥 post하는 주소 != delete랑 put하는 주소임, put이나 delete나 findbyid로 일단 찾은다음
// 필요한 조치 해주는 것이 순서!! / findoneUpdate 쓰는 방법 틀리게 함 / put logic 계속 틀림
// show template에서 사진 동그랗게 만드는 거 자꾸 안 되서 그냥 예전 거 베낌(small은 customize인 거 까먹음)
// 마지막 get도 몇 가지 빠트림. public story만 보이게 만들어야 됨 / profile에 이름과 사진 어디서나 보이게 만듦
// flash 넣어줌,
/* <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script> */
// <script>M.toast({ html: document.querySelector('#toast'), displayLength: 1500 });</script> 이 순서대로 되어야 스타일 먹힌다!!!
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const app = express();
connectDB();
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");
const MongoStore = require("connect-mongo")(session);
require("./config/passport")(passport);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(
  session({
    secret: "gogo",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  next();
});

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`server connected on ${PORT} in ${process.env.NODE_ENV} mode`)
);
