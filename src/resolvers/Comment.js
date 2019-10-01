const Comment = {
  author: (parent, _, { users }, _info) =>
    users.find(item => item.id === parent.author),
  post: (parent, _, { posts }) => posts.find(item => item.id === parent.post)
};

export default Comment;
