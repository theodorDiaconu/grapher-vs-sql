export default {
  Query: {
    users(_, args, { db }, ast) {
      return db.users.astToQuery(ast).fetch();
    },

    comments(_, args, { db }, ast) {
      return db.comments.astToQuery(ast).fetch();
    },

    posts(_, { first }, { db }, ast) {
      let $options = {};
      if (first) {
        $options.limit = first;
      }

      return db.posts
        .astToQuery(ast, {
          $options,
        })
        .fetch();
    },

    tags(_, args, { db }, ast) {
      return db.tags.astToQuery(ast).fetch();
    },

    groups(_, args, { db }, ast) {
      return db.groups.astToQuery(ast).fetch();
    },

    postCategories(_, args, { db }, ast) {
      return db.postCategories.astToQuery(ast).fetch();
    },
  },
  Mutation: {
    addPost(_, { title }, { db }) {
      return db.posts.insert({ title });
    },
  },
};
