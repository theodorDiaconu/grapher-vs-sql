import { Random } from 'meteor/random';
import * as db from './index';
import uuid from 'uuid/v4';

// Constants
const USERS = 10;
const POST_PER_USER = 20;
const COMMENTS_PER_POST = 20;
const GROUPS = ['Admins', 'Super Users', 'Apollo Masters', 'Other'];
const TAGS = [
  'graphql-performance',
  'graphql-tools',
  'apollo-new',
  'destroy-the-world',
];
const POST_CATEGORIES = ['JavaScript', 'Meteor', 'React', 'Other'];
const COMMENT_TEXT_SAMPLES = ['Good', 'Bad', 'Neutral'];

db.sequelize.sync();

const FORCE_FIXTURES = true;

// Fixtures
Meteor.setTimeout(async function() {
  const foundUsers = await db.User.findAll();

  if (!FORCE_FIXTURES) {
    if (foundUsers.length) {
      console.log(
        '[ok] we are no longer loading fixtures, we found users, we assume they are loaded'
      );
      return;
    }
  }

  await db.sequelize.sync({ force: true });

  console.log('[ok] now started to load fixtures, patience padawan!');

  let tags = [];
  for (let i in TAGS) {
    const tag = await db.Tag.create({ name: TAGS[i] });
    tags.push(tag);
  }

  let groups = [];

  for (let i in GROUPS) {
    const group = await db.Group.create({ name: GROUPS[i] });
    groups.push(group);
  }

  let categories = [];

  for (let i in POST_CATEGORIES) {
    const category = await db.PostCategory.create({ name: POST_CATEGORIES[i] });
    categories.push(category);
  }

  let users = [];
  for (let i = 0; i < USERS; i++) {
    const user = await db.User.create({
      email: `user-${uuid()}@app.com`,
      password: `12345`,
    });

    users.push(user);
  }

  for (k = 0; k < users.length; k++) {
    const user = users[k];
    await user.addGroup(_.sample(groups));

    for (let i = 0; i < POST_PER_USER; i++) {
      let post = await db.Post.create({
        title: `User Post - ${i}`,
      });

      await post.setPostCategory(_.sample(categories));
      await post.setUser(user);
      await post.addTag(_.sample(tags));

      for (let j = 0; j < COMMENTS_PER_POST; j++) {
        let comment = await db.Comment.create({
          text: _.sample(COMMENT_TEXT_SAMPLES),
        });

        await comment.setPost(post);
        await comment.setUser(_.sample(users));
      }
    }
  }

  console.log('[ok] fixtures have been loaded.');
}, 2000);
