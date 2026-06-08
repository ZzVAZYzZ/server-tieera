const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");

//@param (accessToken, refreshToken, profile, done)
//@result (user)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile','email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return done(new Error("Không tìm thấy email trong Google profile"), null);
        }

        const [user, created] = await User.findOrCreate({
          where: { email },
          defaults: {
            google_id: profile.id,
            name: profile.displayName || "Google User",
            email,
            avatar: profile.photos && profile.photos[0]?.value,
            password: null,
          },
        });

        return done(null, user);
      } catch (error) {
        console.error("Lỗi khi xác thực Google:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user (chuyển user thành id lưu trong session)
//@param (user, done)
//@result user.user_id
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user (lấy user từ id lưu trong session)
//@param (id, done)
//@result user, error
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
