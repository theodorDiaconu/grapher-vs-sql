import { GraphQLSchema } from 'graphql';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import joinMonster from 'join-monster';
import { sequelize } from './index';

export const User = new GraphQLObjectType({
  name: 'User',
  sqlTable: 'users',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    email: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    comments: {
      type: GraphQLList(Comment),
      sqlJoin: (userTable, commentTable) =>
        `${userTable}.id = ${commentTable}.userId`,
    },
    posts: {
      type: GraphQLList(Post),
      sqlJoin: (userTable, postTable) =>
        `${userTable}.id = ${postTable}.userId`,
    },
    groups: {
      type: GraphQLList(Group),
      junction: {
        sqlTable: 'UserGroup',
        sqlJoins: [
          (userTable, userGroupTable) =>
            `${userTable}.id = ${userGroupTable}.userId`,
          (userGroupTable, groupTable) =>
            `${userGroupTable}.groupId = ${groupTable}.id`,
        ],
      },
    },
  }),
});

export const Group = new GraphQLObjectType({
  name: 'Group',
  sqlTable: 'groups',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    users: {
      type: GraphQLList(User),
      junction: {
        sqlTable: 'UserGroup',
        sqlJoins: [
          (groupTable, userGroupTable) =>
            `${groupTable}.id = ${userGroupTable}.groupId`,
          (userGroupTable, userTable) =>
            `${userGroupTable}.userId = ${userTable}.id`,
        ],
      },
    },
  }),
});

export const Comment = new GraphQLObjectType({
  name: 'Comment',
  sqlTable: 'comments',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    text: {
      type: GraphQLString,
    },
    user: {
      type: User,
      sqlJoin: (commentTable, userTable) =>
        `${commentTable}.userId = ${userTable}.id`,
    },
    post: {
      type: Post,
      sqlJoin: (commentTable, postTable) =>
        `${commentTable}.postId = ${postTable}.id`,
    },
  }),
});

export const Tag = new GraphQLObjectType({
  name: 'Tag',
  sqlTable: 'tags',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    user: {
      type: User,
      sqlJoin: (tagTable, userTable) => `${tagTable}.userId = ${userTable}.id`,
    },
    posts: {
      type: GraphQLList(Post),
      junction: {
        sqlTable: 'PostTag',
        sqlJoins: [
          (tagTable, postTagTable) => `${tagTable}.id = ${postTagTable}.tagId`,
          (postTagTable, postTable) =>
            `${postTagTable}.postId = ${postTable}.id`,
        ],
      },
    },
  }),
});

export const PostCategory = new GraphQLObjectType({
  name: 'PostCategory',
  sqlTable: 'postCategories',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    posts: {
      type: GraphQLList(Post),
      sqlJoin: (categoryTable, postTable) =>
        `${categoryTable}.id = ${postTable}.postCategoryId`,
    },
  }),
});

export const Post = new GraphQLObjectType({
  name: 'Post',
  sqlTable: 'posts',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    title: {
      type: GraphQLString,
    },
    user: {
      type: User,
      sqlJoin: (postTable, userTable) =>
        `${postTable}.userId = ${userTable}.id`,
    },
    category: {
      type: PostCategory,
      sqlJoin: (postTable, categoryTable) =>
        `${postTable}.postCategoryId = ${categoryTable}.id`,
    },
    comments: {
      type: GraphQLList(Comment),
      sqlJoin: (postTable, commentTable) =>
        `${postTable}.id = ${commentTable}.postId`,
    },
    tags: {
      type: GraphQLList(Tag),
      junction: {
        sqlTable: 'PostTag',
        sqlJoins: [
          (postTable, postTagTable) =>
            `${postTable}.id = ${postTagTable}.postId`,
          (postTagTable, tagTable) => `${postTagTable}.tagId = ${tagTable}.id`,
        ],
      },
    },
  }),
});

const resolve = (parent, args, context, resolveInfo) => {
  return joinMonster(
    resolveInfo,
    {},
    sql => {
      return sequelize.query(sql).then(function(result) {
        return result[0];
      });
    },
    { dialect: 'mysql' }
  );
};

export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(User),
      resolve,
    },

    posts: {
      type: new GraphQLList(Post),
      args: {
        first: {
          type: GraphQLInt,
        },
      },
      resolve,
    },

    groups: {
      type: new GraphQLList(Group),
      resolve,
    },

    comments: {
      type: new GraphQLList(Comment),
      resolve,
    },

    tags: {
      type: new GraphQLList(Tag),
      resolve,
    },

    categories: {
      type: new GraphQLList(PostCategory),
      resolve,
    },
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
});
