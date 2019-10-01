const Query = {
  comments: (_parent, _args, { comments }, _info) => comments,
  users: (_parent, { query }, { users }) => {
    if (!query) {
      return users;
    }

    return users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts: (_, { query, published }, { posts }, _info) => {
    if (!query) {
      return posts;
    }

    return posts.filter(post => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());
      const isPublished = published && post.published;

      return (isBodyMatch && isPublished) || (isTitleMatch && isPublished);
    });
  },
  me: () => ({
    id: "1",
    username: "Smakosh",
    email: "ismail@ghallou.com"
  })
};

export default Query;
