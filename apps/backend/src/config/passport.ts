import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from 'db';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from './jwt';

interface JwtPayload {
  id: string;
}

// Local Strategy (email/password)
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        // Skip password check if user is using OAuth
        if (!user.password && user.oauthProvider) {
          return done(null, false, { 
            message: `This account uses ${user.oauthProvider} authentication` 
          });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        
        if (!isPasswordValid) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET as string,
    },
    async (jwtPayload: JwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });
        
        if (!user) {
          return done(null, false);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await prisma.user.findFirst({
          where: {
            oauthId: profile.id,
            oauthProvider: 'google',
          },
        });
        
        if (!user) {
          // Check if a user with this email already exists
          const email = profile.emails?.[0]?.value;
          
          if (email) {
            user = await prisma.user.findUnique({
              where: { email },
            });
            
            if (user) {
              // Link existing account with Google
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  oauthId: profile.id,
                  oauthProvider: 'google',
                },
              });
            } else {
              // Create new user
              user = await prisma.user.create({
                data: {
                  email,
                  name: profile.displayName,
                  oauthId: profile.id,
                  oauthProvider: 'google',
                },
              });
            }
          }
        }
        
        return done(null, user || false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
