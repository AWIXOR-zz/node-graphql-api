const User = {
  posts: (parent, _, { posts }, _info) =>
    posts.filter(item => item.author === parent.id),
  comments: (parent, _, { comments }) =>
    comments.filter(item => item.author === parent.id)
};

export default User;
