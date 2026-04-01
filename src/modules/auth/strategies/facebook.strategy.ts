import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

interface FacebookProfile {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails?: { value: string }[];
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FacebookProfile,
  ): unknown {
    return {
      email: profile.emails?.[0]?.value,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
    };
  }
}
