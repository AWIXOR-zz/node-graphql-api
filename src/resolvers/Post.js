const Post = {
  author: (parent, _, { users }, _info) =>
    users.find(item => item.id === parent.author),
  comments: (parent, _, { comments }) =>
    comments.filter(item => item.post === parent.id)
};

export default Post;
