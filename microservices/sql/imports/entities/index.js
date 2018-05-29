import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('grapher_test', 'root', null, {
  dialect: 'mysql',
  logging: false,
});

export const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  roles: {
    type: Sequelize.STRING,
  },
});

export const Tag = sequelize.define('tag', {
  name: Sequelize.STRING,
});

export const PostCategory = sequelize.define('postCategory', {
  name: Sequelize.STRING,
});

export const Post = sequelize.define('post', {
  title: Sequelize.STRING,
});

export const Group = sequelize.define('group', {
  name: Sequelize.STRING,
});

export const Comment = sequelize.define('comment', {
  text: Sequelize.STRING,
});

// Define relationships

// User & Group
Group.belongsToMany(User, { as: 'Users', through: 'UserGroup' });
User.belongsToMany(Group, { as: 'Groups', through: 'UserGroup' });

// Tag & Post
Tag.belongsToMany(Post, { through: 'PostTag' });
Post.Tags = Post.belongsToMany(Tag, { through: 'PostTag' });

// Post & PostCategory
PostCategory.hasMany(Post, { as: 'Posts' });
Post.Category = Post.belongsTo(PostCategory);

Post.Comments = Post.hasMany(Comment, { as: 'comments' });
Comment.belongsTo(Post);

// Post & User
User.hasMany(Post, { as: 'posts' });
Post.User = Post.belongsTo(User);

// Comment & User
Comment.belongsTo(User);
User.hasMany(Comment, { as: 'comments' });
