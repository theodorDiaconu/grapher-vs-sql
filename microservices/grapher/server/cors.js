import { Config } from 'meteor/cultofcoders:apollo';
import cors from 'cors';

// Maybe you want this only in development
Meteor.isDevelopment && Config.EXPRESS_MIDDLEWARES.push(cors());
