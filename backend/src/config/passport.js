import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract user information from Google profile
                const googleId = profile.id;
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const picture = profile.photos[0]?.value;

                // Check if user already exists
                let user = await prisma.user.findUnique({
                    where: { googleId }
                });

                if (user) {
                    // Update last login time
                    user = await prisma.user.update({
                        where: { googleId },
                        data: { lastLoginAt: new Date() }
                    });
                } else {
                    // Create new user
                    user = await prisma.user.create({
                        data: {
                            googleId,
                            email,
                            name,
                            picture,
                            isPro: false,
                            isAdmin: false
                        }
                    });
                }

                return done(null, user);
            } catch (error) {
                console.error('Google OAuth error:', error);
                return done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                googleId: true,
                email: true,
                name: true,
                picture: true,
                isPro: true,
                isAdmin: true
            }
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
